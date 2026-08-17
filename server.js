const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'vkare_secret_key_1029384756';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || 'vkare_secret_encrypt_key_32bytes', 'utf8'); // 32 bytes
const IV_LENGTH = 16;

const isVercel = process.env.VERCEL || process.env.NOW_BUILDER;
const storageBase = isVercel ? '/tmp' : __dirname;

// Ensure directories exist
const uploadDir = path.join(storageBase, 'uploads');
if (!fs.existsSync(uploadDir)) {
    try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) {}
}

const backupDir = path.join(storageBase, 'backups');
if (!fs.existsSync(backupDir)) {
    try { fs.mkdirSync(backupDir, { recursive: true }); } catch (e) {}
}

// Security Middlewares
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            "style-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
            "img-src": ["'self'", "data:", "blob:"]
        }
    }
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));

// Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// ----------------------------------------------------
// DB SETUP
// ----------------------------------------------------
const dbPath = path.join(storageBase, 'vkare_clinic.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('DB connection error:', err);
    else console.log('SQLite Database Connected at:', dbPath);
});

// Encryption Helper Functions
function encrypt(text) {
    if (!text) return text;
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    if (!text) return text;
    try {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (e) {
        return '[Decryption Error/Unencrypted] ' + text;
    }
}

// Initialize tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        phone TEXT,
        gender TEXT,
        age TEXT,
        city TEXT,
        password_hash TEXT,
        role TEXT, -- patient, doctor, admin
        is_verified INTEGER DEFAULT 0,
        otp TEXT,
        otp_expiry INTEGER,
        two_fa_secret TEXT,
        two_fa_enabled INTEGER DEFAULT 0,
        failed_attempts INTEGER DEFAULT 0,
        locked_until INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        specialization TEXT,
        experience TEXT,
        consultation_fee REAL DEFAULT 500.0,
        availability_status TEXT DEFAULT 'online',
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        doctor_id TEXT,
        counselling_type TEXT,
        date TEXT,
        time_slot TEXT,
        reason TEXT,
        reports_path TEXT,
        status TEXT DEFAULT 'pending', -- pending, paid, completed, cancelled
        meeting_link TEXT,
        created_at INTEGER,
        FOREIGN KEY(patient_id) REFERENCES users(id),
        FOREIGN KEY(doctor_id) REFERENCES doctors(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        appointment_id TEXT,
        amount REAL,
        payment_method TEXT,
        transaction_id TEXT,
        status TEXT,
        timestamp INTEGER,
        FOREIGN KEY(appointment_id) REFERENCES appointments(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS consultations (
        id TEXT PRIMARY KEY,
        appointment_id TEXT,
        prescription_path TEXT,
        session_notes TEXT,
        completed_at INTEGER,
        FOREIGN KEY(appointment_id) REFERENCES appointments(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        action TEXT,
        ip_address TEXT,
        timestamp INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS content (
        key TEXT PRIMARY KEY,
        value TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        appointment_id TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        is_read INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(appointment_id) REFERENCES appointments(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS notification_logs (
        id TEXT PRIMARY KEY,
        appointment_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        channel TEXT NOT NULL,
        status TEXT NOT NULL,
        error_message TEXT,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY(appointment_id) REFERENCES appointments(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Seed default accounts if empty
    db.get("SELECT count(*) as count FROM users", (err, row) => {
        if (row && row.count === 0) {
            const adminPassword = bcrypt.hashSync('admin123', 10);
            const doctorPassword = bcrypt.hashSync('doctor123', 10);
            const patientPassword = bcrypt.hashSync('patient123', 10);

            // Admin
            db.run(`INSERT INTO users (id, name, email, phone, gender, age, city, password_hash, role, is_verified) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    ['user_admin', 'Clinic Admin', 'admin@vkare.com', encrypt('+919980999068'), 'Male', '35', 'Tumkur', adminPassword, 'admin', 1]);

            // Doctors
            db.run(`INSERT INTO users (id, name, email, phone, gender, age, city, password_hash, role, is_verified) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    ['user_doc1', 'Dr. Vinay Kumar', 'vinay@vkare.com', encrypt('+919980999069'), 'Male', '42', 'Tumkur', doctorPassword, 'doctor', 1]);
            db.run(`INSERT INTO doctors (id, user_id, specialization, experience, consultation_fee, availability_status) 
                    VALUES (?, ?, ?, ?, ?, ?)`, ['doc1', 'user_doc1', 'Psychiatrist & Mental Wellness Expert', '12+ Years Experience', 600.0, 'online']);

            db.run(`INSERT INTO users (id, name, email, phone, gender, age, city, password_hash, role, is_verified) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    ['user_doc2', 'Dr. Anitha K.', 'anitha@vkare.com', encrypt('+919980999070'), 'Female', '36', 'Tumkur', doctorPassword, 'doctor', 1]);
            db.run(`INSERT INTO doctors (id, user_id, specialization, experience, consultation_fee, availability_status) 
                    VALUES (?, ?, ?, ?, ?, ?)`, ['doc2', 'user_doc2', 'Senior Clinical Psychologist & Child Counselor', '8+ Years Experience', 500.0, 'online']);

            db.run(`INSERT INTO users (id, name, email, phone, gender, age, city, password_hash, role, is_verified) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    ['user_doc3', 'Dr. Kiran R. S.', 'kiran@vkare.com', encrypt('+919980999071'), 'Male', '40', 'Tumkur', doctorPassword, 'doctor', 1]);
            db.run(`INSERT INTO doctors (id, user_id, specialization, experience, consultation_fee, availability_status) 
                    VALUES (?, ?, ?, ?, ?, ?)`, ['doc3', 'user_doc3', 'Pediatric Orthopedic Surgeon', '10+ Years Experience', 700.0, 'online']);

            db.run(`INSERT INTO users (id, name, email, phone, gender, age, city, password_hash, role, is_verified) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    ['user_doc4', 'Mrs. Shwetha G.', 'shwetha@vkare.com', encrypt('+919980999072'), 'Female', '32', 'Tumkur', doctorPassword, 'doctor', 1]);
            db.run(`INSERT INTO doctors (id, user_id, specialization, experience, consultation_fee, availability_status) 
                    VALUES (?, ?, ?, ?, ?, ?)`, ['doc4', 'user_doc4', 'Speech Therapist & Audiologist', '6+ Years Experience', 450.0, 'online']);

            // Patient
            db.run(`INSERT INTO users (id, name, email, phone, gender, age, city, password_hash, role, is_verified) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    ['user_patient', 'Sunil Kumar', 'patient@vkare.com', encrypt('+91876543210'), 'Male', '28', 'Tumkur', patientPassword, 'patient', 1]);

            console.log('Seeded Initial Accounts.');
        }
    });
});

// ----------------------------------------------------
// SECURITY MIDDLEWARES & HELPERS
// ----------------------------------------------------
function logAudit(userId, action, req) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    db.run(`INSERT INTO audit_logs (id, user_id, action, ip_address, timestamp) VALUES (?, ?, ?, ?, ?)`,
        [crypto.randomUUID(), userId || 'GUEST', action, ip, Date.now()]);
}

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token missing' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token invalid or expired' });
        req.user = decoded;
        next();
    });
}

function checkRole(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Unauthorized access role' });
        }
        next();
    };
}

// File Upload Config with Security Filters
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadFilter = (req, file, cb) => {
    const allowedTypes = ['.png', '.jpg', '.jpeg', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.includes(ext)) {
        return cb(new Error('Only PNG, JPG, JPEG, and PDF files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: uploadFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ----------------------------------------------------
// AUTH APIS
// ----------------------------------------------------
app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, gender, age, city, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Fields missing' });

    // Strong Password check
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!pwdRegex.test(password)) {
        return res.status(400).json({ error: 'Password must contain at least 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special character.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = 'usr_' + Date.now();

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

    db.run(`INSERT INTO users (id, name, email, phone, gender, age, city, password_hash, role, otp, otp_expiry, is_verified) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'patient', ?, ?, 0)`,
        [userId, name, email, encrypt(phone), gender, age, city, passwordHash, otp, otpExpiry],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Email already exists' });
                return res.status(500).json({ error: err.message });
            }
            logAudit(userId, 'USER_REGISTERED', req);
            console.log(`[Email OTP sent to ${email}]: ${otp}`);
            res.json({ message: 'Registration successful! Verification OTP sent to email.', userId, otp });
        }
    );
});

app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.otp !== otp || Date.now() > user.otp_expiry) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }
        db.run("UPDATE users SET is_verified = 1, otp = NULL, otp_expiry = NULL WHERE id = ?", [user.id], () => {
            logAudit(user.id, 'USER_VERIFIED_OTP', req);
            res.json({ message: 'Email successfully verified! You can now log in.' });
        });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password, otp } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        // Locked account check
        if (user.locked_until && Date.now() < user.locked_until) {
            const minsLeft = Math.ceil((user.locked_until - Date.now()) / (60 * 1000));
            return res.status(403).json({ error: `Account locked. Try again in ${minsLeft} minutes.` });
        }

        if (!bcrypt.compareSync(password, user.password_hash)) {
            const failed = user.failed_attempts + 1;
            let lockedUntil = 0;
            let errorMsg = 'Invalid email or password';
            if (failed >= 5) {
                lockedUntil = Date.now() + 15 * 60 * 1000;
                errorMsg = 'Too many failed login attempts. Account locked for 15 minutes.';
            }
            db.run("UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?", [failed, lockedUntil, user.id]);
            logAudit(user.id, `LOGIN_FAILED (Attempt ${failed})`, req);
            return res.status(400).json({ error: errorMsg });
        }

        if (user.is_verified === 0) {
            return res.status(400).json({ error: 'Email not verified. Please verify your email first.' });
        }

        if (user.two_fa_enabled === 1) {
            if (!otp) {
                const loginOtp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = Date.now() + 5 * 60 * 1000;
                db.run("UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?", [loginOtp, otpExpiry, user.id], () => {
                    console.log(`[2FA OTP sent to ${email}]: ${loginOtp}`);
                    res.json({ twoFaRequired: true, otp: loginOtp, message: '2FA OTP sent to email.' });
                });
                return;
            } else {
                if (user.otp !== otp || Date.now() > user.otp_expiry) {
                    return res.status(400).json({ error: 'Invalid or expired 2FA OTP' });
                }
            }
        }

        db.run("UPDATE users SET failed_attempts = 0, locked_until = 0, otp = NULL, otp_expiry = NULL WHERE id = ?", [user.id]);

        const token = jwt.sign({ id: user.id, role: user.role, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
        logAudit(user.id, 'USER_LOGGED_IN', req);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: decrypt(user.phone),
                gender: user.gender,
                age: user.age,
                city: user.city,
                role: user.role,
                twoFaEnabled: !!user.two_fa_enabled
            }
        });
    });
});

app.post('/api/auth/enable-2fa', verifyToken, (req, res) => {
    const { enable } = req.body;
    db.run("UPDATE users SET two_fa_enabled = ? WHERE id = ?", [enable ? 1 : 0, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        logAudit(req.user.id, enable ? '2FA_ENABLED' : '2FA_DISABLED', req);
        res.json({ message: enable ? 'Two-Factor Authentication Enabled' : 'Two-Factor Authentication Disabled' });
    });
});

// ----------------------------------------------------
// PATIENT/DOCTOR APIS
// ----------------------------------------------------
app.get('/api/doctors', (req, res) => {
    db.all(`SELECT d.*, u.name, u.email FROM doctors d JOIN users u ON d.user_id = u.id`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/appointments', verifyToken, upload.single('report'), (req, res) => {
    let { doctorId, counsellingType, date, timeSlot, reason } = req.body;

    if (!doctorId || doctorId === 'undefined' || doctorId === 'null') {
        const typeLower = (counsellingType || '').toLowerCase();
        if (typeLower.includes('ortho')) doctorId = 'doc3';
        else if (typeLower.includes('speech') || typeLower.includes('child')) doctorId = 'doc4';
        else if (typeLower.includes('depression') || typeLower.includes('anxiety')) doctorId = 'doc2';
        else doctorId = 'doc1';
    }

    if (!counsellingType || !date || !timeSlot) {
        return res.status(400).json({ error: 'Required booking details missing.' });
    }

    const appointmentId = 'APT-' + Date.now();
    const reportsPath = req.file ? '/uploads/' + req.file.filename : null;

    db.run(`INSERT INTO appointments (id, patient_id, doctor_id, counselling_type, date, time_slot, reason, reports_path, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
        [appointmentId, req.user.id, doctorId, counsellingType, date, timeSlot, encrypt(reason), reportsPath, Date.now()],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            logAudit(req.user.id, `BOOKED_APPOINTMENT_${appointmentId}`, req);
            res.json({ message: 'Appointment booked successfully! Directing to payment page.', appointmentId });
        }
    );
});

app.get('/api/appointments', verifyToken, (req, res) => {
    let query = '';
    let params = [];
    if (req.user.role === 'patient') {
        query = `SELECT a.*, u.name as doctor_name, d.consultation_fee 
                 FROM appointments a 
                 JOIN doctors d ON a.doctor_id = d.id
                 JOIN users u ON d.user_id = u.id
                 WHERE a.patient_id = ?
                 ORDER BY a.date DESC, a.time_slot DESC`;
        params = [req.user.id];
    } else if (req.user.role === 'doctor') {
        query = `SELECT a.*, u.name as patient_name, u.age as patient_age, u.gender as patient_gender, u.email as patient_email
                 FROM appointments a 
                 JOIN users u ON a.patient_id = u.id
                 JOIN doctors d ON a.doctor_id = d.id
                 WHERE d.user_id = ?
                 ORDER BY a.date DESC, a.time_slot DESC`;
        params = [req.user.id];
    } else {
        query = `SELECT a.*, p.name as patient_name, d_u.name as doctor_name
                 FROM appointments a 
                 JOIN users p ON a.patient_id = p.id
                 JOIN doctors d ON a.doctor_id = d.id
                 JOIN users d_u ON d.user_id = d_u.id
                 ORDER BY a.date DESC, a.time_slot DESC`;
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const decryptedRows = rows.map(r => {
            if (r.reason) r.reason = decrypt(r.reason);
            return r;
        });
        res.json(decryptedRows);
    });
});

// ----------------------------------------------------
// NOTIFICATION DISPATCHER SERVICE
// ----------------------------------------------------
function dispatchAppointmentNotification(appointmentId, newStatus, options = {}, callback) {
    const { rejectionReason, importantInstructions } = options;

    const query = `
        SELECT 
            a.id as appointment_id, a.patient_id, a.counselling_type, a.date, a.time_slot, a.status,
            p.name as patient_name, p.email as patient_email, p.phone as patient_phone,
            d_u.name as doctor_name
        FROM appointments a
        JOIN users p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users d_u ON d.user_id = d_u.id
        WHERE a.id = ?
    `;

    db.get(query, [appointmentId], (err, apt) => {
        if (err || !apt) {
            if (callback) callback(err || new Error('Appointment not found'));
            return;
        }

        const patientId = apt.patient_id;
        const patientName = apt.patient_name;
        const doctorName = apt.doctor_name || 'V-KARE Specialist';
        const dateStr = apt.date;
        const timeStr = apt.time_slot;
        const deptStr = apt.counselling_type || 'General Consultation';
        let decryptedPhone = 'N/A';
        try { decryptedPhone = decrypt(apt.patient_phone); } catch (e) { decryptedPhone = apt.patient_phone; }

        let title = '';
        let message = '';
        let type = 'info';

        if (newStatus === 'approved') {
            title = 'Appointment Approved ✅';
            message = `Hello ${patientName}, your ${deptStr} appointment (ID: ${appointmentId}) with ${doctorName} on ${dateStr} at ${timeStr} has been approved.`;
            if (importantInstructions) {
                message += ` Instructions: ${importantInstructions}`;
            } else {
                message += ` Please log in to your portal 10 minutes prior to your slot.`;
            }
            type = 'success';
        } else if (newStatus === 'rejected') {
            title = 'Appointment Update ❌';
            message = `Hello ${patientName}, your appointment request (ID: ${appointmentId}) with ${doctorName} on ${dateStr} at ${timeStr} could not be approved at this time.`;
            if (rejectionReason) {
                message += ` Reason: ${rejectionReason}`;
            }
            type = 'danger';
        } else {
            title = `Appointment Status: ${newStatus.toUpperCase()}`;
            message = `Hello ${patientName}, your appointment (ID: ${appointmentId}) status has been updated to ${newStatus}.`;
            type = 'info';
        }

        const notifId = 'NOTIF-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        const now = Date.now();

        db.run(
            `INSERT INTO notifications (id, user_id, appointment_id, title, message, type, is_read, created_at)
             VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
            [notifId, patientId, appointmentId, title, message, type, now],
            (notifErr) => {
                if (notifErr) console.error('Error saving notification to DB:', notifErr);

                // Delivery channels logging
                // 1. Website Channel
                db.run(
                    `INSERT INTO notification_logs (id, appointment_id, user_id, channel, status, error_message, timestamp)
                     VALUES (?, ?, ?, 'website', 'sent', NULL, ?)`,
                    ['LOG-WEB-' + Date.now(), appointmentId, patientId, now]
                );

                // 2. Email Channel
                console.log(`[EMAIL NOTIFICATION DISPATCH] Sent to ${apt.patient_email} | Subject: ${title} | Message: ${message}`);
                db.run(
                    `INSERT INTO notification_logs (id, appointment_id, user_id, channel, status, error_message, timestamp)
                     VALUES (?, ?, ?, 'email', 'sent', NULL, ?)`,
                    ['LOG-EML-' + Date.now(), appointmentId, patientId, now]
                );

                // 3. WhatsApp Channel
                console.log(`[WHATSAPP NOTIFICATION DISPATCH] Sent to ${decryptedPhone} | Message: ${message}`);
                db.run(
                    `INSERT INTO notification_logs (id, appointment_id, user_id, channel, status, error_message, timestamp)
                     VALUES (?, ?, ?, 'whatsapp', 'sent', NULL, ?)`,
                    ['LOG-WA-' + Date.now(), appointmentId, patientId, now]
                );

                if (callback) callback(null, { notifId, title, message });
            }
        );
    });
}

// Update Appointment Status API (Approve / Reject)
app.post('/api/appointments/status', verifyToken, checkRole(['admin', 'doctor']), (req, res) => {
    const { appointmentId, status, rejectionReason, importantInstructions } = req.body;
    if (!appointmentId || !status) {
        return res.status(400).json({ error: 'Appointment ID and status are required.' });
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'cancelled', 'completed', 'paid'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid appointment status.' });
    }

    db.run(
        `UPDATE appointments SET status = ? WHERE id = ?`,
        [status, appointmentId],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Appointment not found.' });

            logAudit(req.user.id, `UPDATED_APPOINTMENT_STATUS_${appointmentId}_TO_${status.toUpperCase()}`, req);

            // Trigger notification service for patient
            dispatchAppointmentNotification(appointmentId, status, { rejectionReason, importantInstructions }, (notifErr, result) => {
                if (notifErr) console.error('Notification dispatch warning:', notifErr.message);
                res.json({
                    message: `Appointment ${status} successfully. Patient notification dispatched.`,
                    appointmentId,
                    status
                });
            });
        }
    );
});

// Notifications List API (Patient-Scoped)
app.get('/api/notifications', verifyToken, (req, res) => {
    const userId = req.user.id;
    db.all(
        `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            const unreadCount = rows.filter(n => n.is_read === 0).length;
            res.json({ notifications: rows, unreadCount });
        }
    );
});

// Real-time Polling API for Unread Notifications
app.get('/api/notifications/poll', verifyToken, (req, res) => {
    const userId = req.user.id;
    const since = parseInt(req.query.since) || 0;

    db.all(
        `SELECT * FROM notifications WHERE user_id = ? AND created_at > ? AND is_read = 0 ORDER BY created_at DESC`,
        [userId, since],
        (err, newNotifs) => {
            if (err) return res.status(500).json({ error: err.message });
            db.get(`SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = 0`, [userId], (cntErr, row) => {
                const unreadCount = row ? row.unread : 0;
                res.json({ newNotifications: newNotifs, unreadCount });
            });
        }
    );
});

// Mark Single Notification as Read
app.post('/api/notifications/mark-read', verifyToken, (req, res) => {
    const { notificationId } = req.body;
    if (!notificationId) return res.status(400).json({ error: 'Notification ID required.' });

    db.run(
        `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`,
        [notificationId, req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Notification marked as read.' });
        }
    );
});

// Mark All Notifications as Read
app.post('/api/notifications/mark-all-read', verifyToken, (req, res) => {
    db.run(
        `UPDATE notifications SET is_read = 1 WHERE user_id = ?`,
        [req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'All notifications marked as read.' });
        }
    );
});

// Admin Notification Delivery Tracking Logs
app.get('/api/admin/notification-logs', verifyToken, checkRole(['admin', 'doctor']), (req, res) => {
    const aptId = req.query.appointmentId;
    let query = `SELECT nl.*, u.name as patient_name, u.email as patient_email 
                 FROM notification_logs nl 
                 JOIN users u ON nl.user_id = u.id`;
    let params = [];

    if (aptId) {
        query += ` WHERE nl.appointment_id = ?`;
        params.push(aptId);
    }
    query += ` ORDER BY nl.timestamp DESC`;

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Admin Notification Retry API
app.post('/api/admin/notifications/retry', verifyToken, checkRole(['admin', 'doctor']), (req, res) => {
    const { appointmentId, channel } = req.body;
    if (!appointmentId || !channel) return res.status(400).json({ error: 'Appointment ID and channel required.' });

    const now = Date.now();
    db.run(
        `UPDATE notification_logs SET status = 'sent', error_message = NULL, timestamp = ? WHERE appointment_id = ? AND channel = ?`,
        [now, appointmentId, channel],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            logAudit(req.user.id, `RETRIED_NOTIFICATION_${channel.toUpperCase()}_APPOINTMENT_${appointmentId}`, req);
            res.json({ message: `Notification delivery retried successfully for ${channel}.` });
        }
    );
});

app.post('/api/profile/update', verifyToken, (req, res) => {
    const { name, phone, age, gender, city } = req.body;
    db.run("UPDATE users SET name = ?, phone = ?, age = ?, gender = ?, city = ? WHERE id = ?",
        [name, encrypt(phone), age, gender, city, req.user.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            logAudit(req.user.id, 'PROFILE_UPDATED', req);
            res.json({ message: 'Profile updated successfully.' });
        });
});

app.post('/api/appointments/reschedule', verifyToken, (req, res) => {
    const { appointmentId, date, timeSlot } = req.body;
    db.run("UPDATE appointments SET date = ?, time_slot = ? WHERE id = ? AND (patient_id = ? OR EXISTS(SELECT 1 FROM doctors d WHERE d.id = doctor_id AND d.user_id = ?))",
        [date, timeSlot, appointmentId, req.user.id, req.user.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            logAudit(req.user.id, `RESCHEDULED_APPOINTMENT_${appointmentId}`, req);
            res.json({ message: 'Appointment rescheduled successfully.' });
        });
});

app.post('/api/appointments/cancel', verifyToken, (req, res) => {
    const { appointmentId } = req.body;
    db.run("UPDATE appointments SET status = 'cancelled' WHERE id = ? AND (patient_id = ? OR EXISTS(SELECT 1 FROM doctors d WHERE d.id = doctor_id AND d.user_id = ?))",
        [appointmentId, req.user.id, req.user.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            logAudit(req.user.id, `CANCELLED_APPOINTMENT_${appointmentId}`, req);
            res.json({ message: 'Appointment cancelled successfully.' });
        });
});

// ----------------------------------------------------
// PAYMENT APIS
// ----------------------------------------------------
app.post('/api/payments/process', verifyToken, (req, res) => {
    const { appointmentId, method, amount } = req.body;
    if (!appointmentId || !method) return res.status(400).json({ error: 'Payment details missing.' });

    const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const meetingLink = `http://localhost:3000/#consultation?room=${appointmentId}`;

    db.serialize(() => {
        db.run(`INSERT INTO payments (id, appointment_id, amount, payment_method, transaction_id, status, timestamp)
                VALUES (?, ?, ?, ?, ?, 'completed', ?)`,
            ['PAY-' + Date.now(), appointmentId, amount, method, transactionId, Date.now()]);

        db.run(`UPDATE appointments SET status = 'paid', meeting_link = ? WHERE id = ?`, [meetingLink, appointmentId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            
            logAudit(req.user.id, `PAYMENT_COMPLETED_${appointmentId}`, req);
            console.log(`[Notification Email/WhatsApp] Sent to Patient. Appointment ID: ${appointmentId}. Secure Video Consultation Link: ${meetingLink}`);
            res.json({
                message: 'Payment completed successfully! Confirmed via Email and WhatsApp.',
                transactionId,
                meetingLink
            });
        });
    });
});

// ----------------------------------------------------
// CONSULTATION & DOCTOR ACTIONS
// ----------------------------------------------------
app.post('/api/consultations/complete', verifyToken, checkRole(['doctor']), upload.single('prescription'), (req, res) => {
    const { appointmentId, notes } = req.body;
    if (!appointmentId) return res.status(400).json({ error: 'Appointment ID required.' });

    const prescriptionPath = req.file ? '/uploads/' + req.file.filename : null;
    const consultationId = 'CON-' + Date.now();

    db.serialize(() => {
        db.run(`INSERT INTO consultations (id, appointment_id, prescription_path, session_notes, completed_at)
                VALUES (?, ?, ?, ?, ?)`,
            [consultationId, appointmentId, prescriptionPath, encrypt(notes), Date.now()]);

        db.run(`UPDATE appointments SET status = 'completed' WHERE id = ?`, [appointmentId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            logAudit(req.user.id, `COMPLETED_CONSULTATION_${appointmentId}`, req);
            res.json({ message: 'Session completed successfully. Notes and prescription uploaded.' });
        });
    });
});

app.get('/api/consultations/history', verifyToken, (req, res) => {
    let query = '';
    let params = [];
    if (req.user.role === 'patient') {
        query = `SELECT c.*, a.date, a.counselling_type, u.name as doctor_name
                 FROM consultations c
                 JOIN appointments a ON c.appointment_id = a.id
                 JOIN doctors d ON a.doctor_id = d.id
                 JOIN users u ON d.user_id = u.id
                 WHERE a.patient_id = ?
                 ORDER BY c.completed_at DESC`;
        params = [req.user.id];
    } else if (req.user.role === 'doctor') {
        query = `SELECT c.*, a.date, a.counselling_type, u.name as patient_name
                 FROM consultations c
                 JOIN appointments a ON c.appointment_id = a.id
                 JOIN users u ON a.patient_id = u.id
                 JOIN doctors d ON a.doctor_id = d.id
                 WHERE d.user_id = ?
                 ORDER BY c.completed_at DESC`;
        params = [req.user.id];
    } else {
        query = `SELECT c.*, a.date, a.counselling_type, p.name as patient_name, d_u.name as doctor_name
                 FROM consultations c
                 JOIN appointments a ON c.appointment_id = a.id
                 JOIN users p ON a.patient_id = p.id
                 JOIN doctors d ON a.doctor_id = d.id
                 JOIN users d_u ON d.user_id = d_u.id
                 ORDER BY c.completed_at DESC`;
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const decryptedRows = rows.map(r => {
            if (r.session_notes) r.session_notes = decrypt(r.session_notes);
            return r;
        });
        res.json(decryptedRows);
    });
});

// ----------------------------------------------------
// ADMIN CONTROL APIS
// ----------------------------------------------------
app.get('/api/admin/logs', verifyToken, checkRole(['admin']), (req, res) => {
    db.all(`SELECT a.*, u.email FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.timestamp DESC LIMIT 100`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/admin/doctors/update-fee', verifyToken, checkRole(['admin']), (req, res) => {
    const { doctorId, fee } = req.body;
    db.run("UPDATE doctors SET consultation_fee = ? WHERE id = ?", [fee, doctorId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        logAudit(req.user.id, `ADMIN_UPDATED_FEE_DOC_${doctorId}`, req);
        res.json({ message: 'Consultation fee updated successfully.' });
    });
});

// Backup System
app.post('/api/admin/backup', verifyToken, checkRole(['admin']), (req, res) => {
    const dbPath = path.join(__dirname, 'vkare_clinic.db');
    const backupName = `backup-${Date.now()}.db`;
    const destPath = path.join(backupDir, backupName);
    
    fs.copyFile(dbPath, destPath, (err) => {
        if (err) return res.status(500).json({ error: 'Backup failed: ' + err.message });
        logAudit(req.user.id, `DB_BACKUP_CREATED_${backupName}`, req);
        res.json({ message: 'Database backup created successfully.', file: backupName });
    });
});

app.get('/api/admin/backups', verifyToken, checkRole(['admin']), (req, res) => {
    fs.readdir(backupDir, (err, files) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(files.map(f => ({ name: f, time: fs.statSync(path.join(backupDir, f)).mtimeMs })));
    });
});

app.post('/api/admin/restore', verifyToken, checkRole(['admin']), (req, res) => {
    const { filename } = req.body;
    const backupPath = path.join(backupDir, filename);
    const dbPath = path.join(__dirname, 'vkare_clinic.db');

    if (!fs.existsSync(backupPath)) return res.status(404).json({ error: 'Backup file not found.' });

    db.close(() => {
        fs.copyFile(backupPath, dbPath, (err) => {
            if (err) {
                res.status(500).json({ error: 'Restore failed: ' + err.message });
                db = new sqlite3.Database(dbPath);
                return;
            }
            db = new sqlite3.Database(dbPath, (err) => {
                if (err) console.error(err);
                logAudit(req.user.id, `RESTORED_DB_FROM_${filename}`, req);
                res.json({ message: 'Database restored successfully from backup.' });
            });
        });
    });
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`V-KARE Portal Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
