// V-KARE PORTAL SYSTEM JAVASCRIPT

const API_BASE = 'http://localhost:3000/api';
let userToken = localStorage.getItem('token') || null;
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let localStream = null;
let screenStream = null;
let sessionInterval = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initPortalNavigation();
    initAuthForms();
    checkAutoLogin();
    setupFAQAccordion();
});

// Toast Manager
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Navigation Handling
function initPortalNavigation() {
    // Nav bar links
    const counselLink = document.getElementById('nav-online-counselling');
    if (counselLink) {
        counselLink.addEventListener('click', (e) => {
            e.preventDefault();
            showOnlineCounsellingSection();
        });
    }

    const portalBtn = document.getElementById('nav-portal');
    if (portalBtn) {
        portalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (userToken) {
                openUserDashboard();
            } else {
                openModal('login-modal');
            }
        });
    }

    // Modal close triggers
    const closeBtns = document.querySelectorAll('.close-modal-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.portal-modal');
            if (modal) modal.style.display = 'none';
        });
    });

    // Close on overlay click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('portal-modal')) {
            e.target.style.display = 'none';
        }
    });

    // Landing Book CTAs
    const bookCta = document.getElementById('btn-book-session-cta');
    if (bookCta) {
        bookCta.addEventListener('click', () => {
            openModal('booking-modal');
        });
    }
}

function checkAutoLogin() {
    if (userToken && currentUser) {
        updateNavbarForLoggedInUser();
        // Seed dashboard data
        if (currentUser.role === 'patient') {
            loadPatientDashboard();
        } else if (currentUser.role === 'doctor') {
            loadDoctorDashboard();
        } else if (currentUser.role === 'admin') {
            loadAdminDashboard();
        }
    }
}

function updateNavbarForLoggedInUser() {
    const portalBtn = document.getElementById('nav-portal');
    if (portalBtn) {
        portalBtn.innerHTML = `<i class="fa-solid fa-circle-user"></i> Portal (${currentUser.name.split(' ')[0]})`;
        portalBtn.classList.add('highlight');
    }
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'flex';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
}

function showOnlineCounsellingSection() {
    // Hide Dashboards and Main site components except header/footer
    document.getElementById('main-site').style.display = 'block';
    document.getElementById('patient-dashboard').style.display = 'none';
    document.getElementById('doctor-dashboard').style.display = 'none';
    document.getElementById('admin-section').style.display = 'none';

    // Show Only the Online Counselling hero/sections on main main-site
    const landingSection = document.getElementById('online-counselling-landing');
    if (landingSection) {
        landingSection.style.display = 'block';
        landingSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ----------------------------------------------------
// AUTHENTICATION LOGIC
// ----------------------------------------------------
function initAuthForms() {
    // Login form
    const loginForm = document.getElementById('portal-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-pass').value;
            const otp = document.getElementById('login-otp-2fa').value || null;

            try {
                const res = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, otp })
                });
                const data = await res.json();
                if (data.error) {
                    showToast(data.error, 'danger');
                    return;
                }

                if (data.twoFaRequired) {
                    showToast('Two-Factor OTP required.', 'warning');
                    document.getElementById('2fa-otp-group').style.display = 'block';
                    document.getElementById('login-otp-2fa').setAttribute('required', 'true');
                    // Mock populate the OTP for convenience
                    document.getElementById('login-otp-2fa').value = data.otp;
                    return;
                }

                userToken = data.token;
                currentUser = data.user;
                localStorage.setItem('token', userToken);
                localStorage.setItem('user', JSON.stringify(currentUser));

                showToast(`Welcome back, ${currentUser.name}!`, 'success');
                closeModal('login-modal');
                updateNavbarForLoggedInUser();
                openUserDashboard();
            } catch (err) {
                showToast('Authentication failed.', 'danger');
            }
        });
    }

    // Register Form
    const regForm = document.getElementById('portal-register-form');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const phone = document.getElementById('reg-phone').value;
            const age = document.getElementById('reg-age').value;
            const gender = document.getElementById('reg-gender').value;
            const city = document.getElementById('reg-city').value;
            const password = document.getElementById('reg-password').value;

            try {
                const res = await fetch(`${API_BASE}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, age, gender, city, password })
                });
                const data = await res.json();
                if (data.error) {
                    showToast(data.error, 'danger');
                    return;
                }

                showToast('Registration successful! OTP sent to email.', 'success');
                closeModal('register-modal');
                openModal('otp-verify-modal');
                document.getElementById('otp-verify-email').value = email;
                document.getElementById('otp-verify-code').value = data.otp; // Seed code
            } catch (err) {
                showToast('Registration failed.', 'danger');
            }
        });
    }

    // OTP verification
    const otpForm = document.getElementById('otp-verify-form');
    if (otpForm) {
        otpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('otp-verify-email').value;
            const otp = document.getElementById('otp-verify-code').value;

            try {
                const res = await fetch(`${API_BASE}/auth/verify-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp })
                });
                const data = await res.json();
                if (data.error) {
                    showToast(data.error, 'danger');
                    return;
                }

                showToast(data.message, 'success');
                closeModal('otp-verify-modal');
                openModal('login-modal');
            } catch (err) {
                showToast('OTP verification failed.', 'danger');
            }
        });
    }
}

// Navigation between tabs in sidebar dashboards
function setupDashboardTabs(prefix) {
    const tabBtns = document.querySelectorAll(`[data-${prefix}-tab]`);
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from sibling buttons
            btn.parentNode.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tabName = btn.getAttribute(`data-${prefix}-tab`);
            const pane = document.getElementById(tabName);
            if (pane) {
                pane.parentNode.querySelectorAll('.dashboard-pane').forEach(p => p.classList.remove('active'));
                pane.classList.add('active');
            }
        });
    });
}

function openUserDashboard() {
    if (!currentUser) return;
    document.getElementById('main-site').style.display = 'none';

    if (currentUser.role === 'patient') {
        document.getElementById('patient-dashboard').style.display = 'block';
        setupDashboardTabs('patient');
        loadPatientDashboard();
        startNotificationPolling();
    } else if (currentUser.role === 'doctor') {
        document.getElementById('doctor-dashboard').style.display = 'block';
        setupDashboardTabs('doctor');
        loadDoctorDashboard();
    } else if (currentUser.role === 'admin') {
        document.getElementById('admin-section').style.display = 'block';
        loadAdminDashboard();
    }
}

// ----------------------------------------------------
// PATIENT NOTIFICATION SYSTEM & REAL-TIME POLLING
// ----------------------------------------------------
let notificationPollTimer = null;
let lastNotifPollTimestamp = Date.now();

function startNotificationPolling() {
    if (notificationPollTimer) clearInterval(notificationPollTimer);
    if (!userToken || !currentUser || currentUser.role !== 'patient') return;

    loadPatientNotifications();

    notificationPollTimer = setInterval(async () => {
        try {
            const res = await fetch(`${API_BASE}/notifications/poll?since=${lastNotifPollTimestamp}`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (!res.ok) return;
            const data = await res.json();
            
            if (data.newNotifications && data.newNotifications.length > 0) {
                data.newNotifications.forEach(n => {
                    if (n.created_at > lastNotifPollTimestamp) {
                        lastNotifPollTimestamp = n.created_at;
                    }
                    showRealtimeNotificationAlert(n);
                });
                loadPatientNotifications();
                loadPatientAppointments();
            } else if (data.unreadCount !== undefined) {
                updateUnreadBadge(data.unreadCount);
            }
        } catch (e) {
            console.error('Notification polling error:', e);
        }
    }, 5000);
}

function showRealtimeNotificationAlert(notif) {
    const isApproval = notif.title.includes('Approved') || notif.type === 'success';
    const alertBg = isApproval ? '#10b981' : (notif.type === 'danger' ? '#ef4444' : '#3b82f6');

    const toast = document.createElement('div');
    toast.className = 'realtime-notif-toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #0f172a;
        color: #ffffff;
        border-left: 6px solid ${alertBg};
        padding: 1.2rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
        z-index: 999999;
        max-width: 420px;
        font-family: inherit;
    `;

    toast.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem;">
            <div>
                <h4 style="margin:0 0 0.4rem 0; color:#fff; font-size:1.05rem; display:flex; align-items:center; gap:0.5rem;">
                    ${notif.title}
                </h4>
                <p style="margin:0; font-size:0.88rem; color:#cbd5e1; line-height:1.4;">${notif.message}</p>
                <small style="display:block; margin-top:0.6rem; color:#94a3b8; font-size:0.75rem;">${new Date(notif.created_at).toLocaleTimeString()}</small>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:1.2rem;">&times;</button>
        </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }
    }, 8000);
}

function updateUnreadBadge(unreadCount) {
    const badge = document.getElementById('pat-unread-badge');
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

async function loadPatientNotifications() {
    if (!userToken || !currentUser) return;
    try {
        const res = await fetch(`${API_BASE}/notifications`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        const { notifications, unreadCount } = data;

        updateUnreadBadge(unreadCount);

        const container = document.getElementById('patient-notifications-list');
        if (!container) return;

        if (!notifications || notifications.length === 0) {
            container.innerHTML = `<div class="empty-state" style="text-align:center; padding:3rem; background:#fff; border-radius:12px; border:1px solid #e2e8f0;"><i class="fa-solid fa-bell-slash" style="font-size:3rem; color:#cbd5e1; margin-bottom:1rem;"></i><p style="color:#64748b;">No notifications found yet.</p></div>`;
            return;
        }

        container.innerHTML = '';
        notifications.forEach(n => {
            const isUnread = n.is_read === 0;
            const borderCol = n.type === 'success' ? '#10b981' : (n.type === 'danger' ? '#ef4444' : '#3b82f6');
            const createdDate = new Date(n.created_at).toLocaleString();

            const card = document.createElement('div');
            card.className = `notification-card ${isUnread ? 'unread' : ''}`;
            card.style.cssText = `
                background: ${isUnread ? '#f0fdf4' : '#ffffff'};
                border-left: 5px solid ${borderCol};
                border: 1px solid ${isUnread ? '#bbf7d0' : '#e2e8f0'};
                border-left-width: 5px;
                padding: 1.2rem 1.5rem;
                border-radius: 10px;
                margin-bottom: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 1rem;
                transition: all 0.2s ease;
            `;

            card.innerHTML = `
                <div style="flex:1;">
                    <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.4rem;">
                        <h4 style="margin:0; font-size:1rem; color:#1e293b;">${n.title}</h4>
                        ${isUnread ? '<span style="background:#ef4444; color:#fff; font-size:0.65rem; font-weight:700; padding:2px 6px; border-radius:4px;">NEW</span>' : ''}
                    </div>
                    <p style="margin:0 0 0.6rem 0; font-size:0.9rem; color:#475569; line-height:1.4;">${n.message}</p>
                    <div style="display:flex; gap:1rem; font-size:0.75rem; color:#64748b; flex-wrap:wrap;">
                        <span><i class="fa-solid fa-hashtag"></i> Apt ID: <strong>${n.appointment_id}</strong></span>
                        <span><i class="fa-regular fa-clock"></i> ${createdDate}</span>
                    </div>
                </div>
                <div>
                    ${isUnread ? `
                        <button onclick="markNotificationAsRead('${n.id}')" class="btn btn-secondary" style="font-size:0.75rem; padding:0.3rem 0.7rem; white-space:nowrap;">
                            <i class="fa-solid fa-check"></i> Mark Read
                        </button>
                    ` : '<span style="color:#94a3b8; font-size:0.75rem;"><i class="fa-solid fa-check-double"></i> Read</span>'}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error('Error loading notifications:', err);
    }
}

async function markNotificationAsRead(notifId) {
    try {
        await fetch(`${API_BASE}/notifications/mark-read`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notificationId: notifId })
        });
        loadPatientNotifications();
    } catch (e) {
        console.error('Error marking notification as read:', e);
    }
}

async function markAllNotificationsAsRead() {
    try {
        await fetch(`${API_BASE}/notifications/mark-all-read`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        showToast('All notifications marked as read.', 'success');
        loadPatientNotifications();
    } catch (e) {
        console.error('Error marking all notifications as read:', e);
    }
}

// ADMIN APPOINTMENT STATUS & NOTIFICATION MANAGEMENT
let currentAdminAptFilter = 'all';

function setAdminAptFilter(status, evt) {
    currentAdminAptFilter = status;
    const btns = document.querySelectorAll('.apt-status-filters .filter-btn');
    btns.forEach(b => b.classList.remove('active'));
    if (evt && evt.target) evt.target.classList.add('active');
    loadAdminAppointmentsList();
}

function openAdminStatusModal(aptId, targetStatus) {
    document.getElementById('admin-status-apt-id').value = aptId;
    document.getElementById('admin-status-target').value = targetStatus;

    const titleEl = document.getElementById('admin-status-modal-title');
    const descEl = document.getElementById('admin-status-modal-desc');
    const instGroup = document.getElementById('admin-instructions-group');
    const reasonGroup = document.getElementById('admin-reason-group');
    const submitBtn = document.getElementById('admin-status-submit-btn');

    if (targetStatus === 'approved') {
        titleEl.textContent = 'Approve Appointment';
        descEl.textContent = 'Change status to Approved and dispatch notifications to patient.';
        instGroup.style.display = 'block';
        reasonGroup.style.display = 'none';
        submitBtn.textContent = 'Confirm Approval & Send Notification';
        submitBtn.style.background = '#10b981';
    } else if (targetStatus === 'rejected') {
        titleEl.textContent = 'Reject Appointment';
        descEl.textContent = 'Change status to Rejected and notify the patient with rejection details.';
        instGroup.style.display = 'none';
        reasonGroup.style.display = 'block';
        submitBtn.textContent = 'Confirm Rejection & Send Notification';
        submitBtn.style.background = '#ef4444';
    }

    openModal('admin-status-modal');
}

async function submitAdminStatusChange(e) {
    e.preventDefault();
    const aptId = document.getElementById('admin-status-apt-id').value;
    const status = document.getElementById('admin-status-target').value;
    const instructions = document.getElementById('admin-status-instructions').value;
    const reason = document.getElementById('admin-status-reason').value;

    if (status === 'rejected' && !reason.trim()) {
        showToast('Please provide a rejection reason.', 'warning');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/appointments/status`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                appointmentId: aptId,
                status: status,
                rejectionReason: reason,
                importantInstructions: instructions
            })
        });

        const data = await res.json();
        if (res.ok) {
            showToast(data.message || `Appointment ${status} successfully.`, 'success');
            closeModal('admin-status-modal');
            loadAdminAppointmentsList();
            if (typeof renderAdminStats === 'function') renderAdminStats();
        } else {
            showToast(data.error || 'Failed to update status.', 'danger');
        }
    } catch (err) {
        console.error('Error updating appointment status:', err);
        showToast('Error connecting to server.', 'danger');
    }
}

async function retryNotificationChannel(aptId, channel) {
    try {
        const res = await fetch(`${API_BASE}/admin/notifications/retry`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ appointmentId: aptId, channel })
        });
        const data = await res.json();
        if (res.ok) {
            showToast(`Retried ${channel} notification successfully.`, 'success');
            loadAdminAppointmentsList();
        } else {
            showToast(data.error || 'Retry failed.', 'danger');
        }
    } catch (e) {
        console.error('Retry error:', e);
    }
}

async function loadAdminAppointmentsList() {
    const aptsBody = document.getElementById('admin-apts-body');
    if (!aptsBody) return;

    try {
        const [aptsRes, logsRes] = await Promise.all([
            fetch(`${API_BASE}/appointments`, { headers: { 'Authorization': `Bearer ${userToken}` } }),
            fetch(`${API_BASE}/admin/notification-logs`, { headers: { 'Authorization': `Bearer ${userToken}` } })
        ]);

        if (!aptsRes.ok) return;
        let apts = await aptsRes.json();
        let logs = logsRes.ok ? await logsRes.json() : [];

        // Apply status filter
        if (currentAdminAptFilter !== 'all') {
            apts = apts.filter(a => a.status === currentAdminAptFilter);
        }

        aptsBody.innerHTML = '';
        if (apts.length === 0) {
            aptsBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:#64748b;">No ${currentAdminAptFilter} appointments found.</td></tr>`;
            return;
        }

        apts.forEach(a => {
            const tr = document.createElement('tr');
            const aptLogs = logs.filter(l => l.appointment_id === a.id);

            const webLog = aptLogs.find(l => l.channel === 'website') || { status: 'sent' };
            const emlLog = aptLogs.find(l => l.channel === 'email') || { status: 'sent' };
            const waLog = aptLogs.find(l => l.channel === 'whatsapp') || { status: 'sent' };

            const statusBadgeClass = a.status === 'approved' ? 'success' : (a.status === 'rejected' ? 'danger' : (a.status === 'paid' ? 'info' : 'warning'));
            const pid = a.patient_id || a.patientId || ('VK-PT-' + (a.id ? a.id.toString().replace(/[^0-9]/g, '').slice(-4) : Math.floor(1000 + Math.random() * 9000)));

            tr.innerHTML = `
                <td>
                    <strong>${a.patient_name || a.name || 'Patient'}</strong><br>
                    <span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:10px; font-weight:700; font-size:0.78rem; display:inline-block; margin-top:3px;">Patient ID: ${pid}</span>
                </td>
                <td>
                    <strong>${a.counselling_type || a.dept || 'General'}</strong><br>
                    <small style="color:#64748b;">${a.doctor_name || a.docName || 'Specialist'}</small>
                </td>
                <td>
                    <strong>${a.date}</strong><br>
                    <small>${a.time_slot || a.time}</small>
                </td>
                <td><span class="badge ${a.counselling_type === 'video' ? 'video' : 'in-person'}">${a.counselling_type || 'In-Clinic'}</span></td>
                <td><span class="badge ${statusBadgeClass}" style="text-transform:capitalize;">${a.status}</span></td>
                <td>
                    <div style="display:flex; flex-direction:column; gap:0.2rem; font-size:0.75rem;">
                        <span style="color:${webLog.status === 'sent' ? '#166534' : '#991b1b'};">Web: <strong>${webLog.status}</strong></span>
                        <span style="color:${emlLog.status === 'sent' ? '#166534' : '#991b1b'};">Email: <strong>${emlLog.status}</strong></span>
                        <span style="color:${waLog.status === 'sent' ? '#166534' : '#991b1b'};">WA: <strong>${waLog.status}</strong></span>
                    </div>
                </td>
                <td>
                    <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                        ${a.status === 'pending' ? `
                            <button class="btn btn-primary" onclick="openAdminStatusModal('${a.id}', 'approved')" style="padding:0.25rem 0.6rem; font-size:0.75rem; background:#10b981; border:none;" title="Approve Appointment">
                                <i class="fa-solid fa-check"></i> Approve
                            </button>
                            <button class="btn btn-secondary" onclick="openAdminStatusModal('${a.id}', 'rejected')" style="padding:0.25rem 0.6rem; font-size:0.75rem; background:#ef4444; color:#fff; border:none;" title="Reject Appointment">
                                <i class="fa-solid fa-xmark"></i> Reject
                            </button>
                        ` : ''}
                        ${a.status === 'approved' ? `
                            <button class="btn btn-secondary" onclick="openAdminStatusModal('${a.id}', 'rejected')" style="padding:0.25rem 0.6rem; font-size:0.75rem; background:#f87171; color:#fff; border:none;">Reject</button>
                        ` : ''}
                    </div>
                </td>
            `;
            aptsBody.appendChild(tr);
        });
    } catch (err) {
        console.error('Error loading admin appointments:', err);
    }
}

// ----------------------------------------------------
// LICENSED EXPERTS MODAL & DETAILED PROFILE CONTROLLERS
// ----------------------------------------------------
function viewDoctorProfile(docId) {
    const doctors = typeof getDoctors === 'function' ? getDoctors() : [];
    const doc = doctors.find(d => d.id === docId);
    if (!doc) {
        showToast('Doctor profile not found.', 'warning');
        return;
    }

    const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'en';
    const name = lang === 'en' ? doc.name : (doc.nameKn || doc.name);
    const spec = lang === 'en' ? doc.spec : (doc.specKn || doc.spec);
    const exp = lang === 'en' ? doc.exp : (doc.expKn || doc.exp);
    const bio = lang === 'en' ? doc.bio : (doc.bioKn || doc.bio);
    const hours = lang === 'en' ? doc.hours : (doc.hoursKn || doc.hours);

    document.getElementById('doc-modal-avatar').textContent = doc.avatar || '🧠';
    document.getElementById('doc-modal-name').textContent = name;
    document.getElementById('doc-modal-qual').textContent = doc.qual;
    document.getElementById('doc-modal-spec').textContent = spec;
    document.getElementById('doc-modal-license').innerHTML = `<i class="fa-solid fa-certificate" style="color:#10b981;"></i> ${doc.licenseNo || 'Verified License'}`;
    document.getElementById('doc-modal-exp').innerHTML = `<i class="fa-solid fa-briefcase"></i> ${exp}`;
    document.getElementById('doc-modal-rating').textContent = `⭐ ${doc.rating || 4.9} (${doc.reviewsCount || 100}+ Reviews)`;
    document.getElementById('doc-modal-fee').textContent = `₹${doc.fee || 500} / Session`;
    document.getElementById('doc-modal-bio').textContent = bio || `${name} is a senior board-certified specialist with extensive clinical experience at V-KARE Clinic.`;
    document.getElementById('doc-modal-hours').textContent = hours;
    document.getElementById('doc-modal-languages').textContent = doc.languages || 'English, Kannada';

    const tagsContainer = document.getElementById('doc-modal-tags');
    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        const tags = doc.expertiseTags || ['Specialist Consultation', 'Therapeutic Care'];
        tags.forEach(tag => {
            const pill = document.createElement('span');
            pill.style.cssText = `background:#e0f2fe; color:#0369a1; font-size:0.78rem; font-weight:600; padding:4px 10px; border-radius:15px; border:1px solid #bae6fd;`;
            pill.textContent = tag;
            tagsContainer.appendChild(pill);
        });
    }

    const bookBtn = document.getElementById('doc-modal-book-btn');
    if (bookBtn) {
        bookBtn.onclick = function() {
            closeModal('doctor-detail-modal');
            if (typeof scrollToBooking === 'function') {
                scrollToBooking(doc.dept, doc.id);
            } else {
                openModal('booking-modal');
            }
        };
    }

    openModal('doctor-detail-modal');
}

function openLicensedExpertsModal() {
    renderLicensedExpertsDirectory();
    openModal('licensed-experts-modal');
}

function renderLicensedExpertsDirectory(filterQuery = '') {
    const doctors = typeof getDoctors === 'function' ? getDoctors() : [];
    const container = document.getElementById('licensed-experts-modal-list');
    if (!container) return;

    const q = filterQuery.toLowerCase().trim();
    const filteredDocs = doctors.filter(doc => {
        if (!q) return true;
        const nameMatch = (doc.name || '').toLowerCase().includes(q);
        const specMatch = (doc.spec || '').toLowerCase().includes(q);
        const qualMatch = (doc.qual || '').toLowerCase().includes(q);
        const tagMatch = (doc.expertiseTags || []).some(t => t.toLowerCase().includes(q));
        const licMatch = (doc.licenseNo || '').toLowerCase().includes(q);
        return nameMatch || specMatch || qualMatch || tagMatch || licMatch;
    });

    container.innerHTML = '';
    if (filteredDocs.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:#64748b;"><i class="fa-solid fa-user-slash" style="font-size:2.5rem; margin-bottom:1rem;"></i><p>No medical experts matching "${filterQuery}" found.</p></div>`;
        return;
    }

    filteredDocs.forEach(doc => {
        const card = document.createElement('div');
        card.style.cssText = `background:#fff; border:1px solid #cbd5e1; border-radius:14px; padding:1.2rem; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 4px 12px rgba(0,0,0,0.04);`;
        card.innerHTML = `
            <div>
                <div style="display:flex; gap:1rem; align-items:center; margin-bottom:0.8rem;">
                    <div style="font-size:2.5rem; background:#f0f9ff; width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${doc.avatar || '🩺'}</div>
                    <div>
                        <h4 style="margin:0; font-size:1.05rem; color:#0f172a;">${doc.name}</h4>
                        <span style="font-size:0.75rem; color:#0284c7; font-weight:700;">${doc.qual}</span>
                        <div style="font-size:0.75rem; color:#1e40af; font-weight:600; margin-top:2px;">
                            <i class="fa-solid fa-certificate" style="color:#10b981;"></i> ${doc.licenseNo || 'Verified License'}
                        </div>
                    </div>
                </div>
                <p style="margin:0 0 0.6rem 0; font-size:0.85rem; color:#475569;">${doc.spec}</p>
                <div style="font-size:0.78rem; color:#64748b; margin-bottom:0.8rem;">
                    <span>⭐ ${doc.rating || 4.9} (${doc.reviewsCount || 100}+ reviews)</span> • 
                    <span style="color:#16a34a; font-weight:700;">₹${doc.fee || 500}</span>
                </div>
            </div>
            <div style="display:flex; gap:0.5rem;">
                <button class="btn btn-secondary" onclick="closeModal('licensed-experts-modal'); viewDoctorProfile('${doc.id}');" style="flex:1; font-size:0.78rem; padding:0.5rem;">View Details</button>
                <button class="btn btn-primary" onclick="closeModal('licensed-experts-modal'); scrollToBooking('${doc.dept}', '${doc.id}');" style="flex:1; font-size:0.78rem; padding:0.5rem;">Book Slot</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function searchLicensedExperts() {
    const input = document.getElementById('expert-search-input');
    if (input) {
        renderLicensedExpertsDirectory(input.value);
    }
}

// ----------------------------------------------------
// PATIENT PORTAL OPERATIONS
// ----------------------------------------------------
async function loadPatientDashboard() {
    // Populate Profile Tab
    document.getElementById('pat-profile-name').value = currentUser.name;
    document.getElementById('pat-profile-phone').value = currentUser.phone;
    document.getElementById('pat-profile-age').value = currentUser.age;
    document.getElementById('pat-profile-gender').value = currentUser.gender;
    document.getElementById('pat-profile-city').value = currentUser.city;
    document.getElementById('pat-2fa-enabled').checked = currentUser.twoFaEnabled;

    // Fetch doctors for booking select fields
    const docRes = await fetch(`${API_BASE}/doctors`);
    const doctors = await docRes.json();
    const docSelect = document.getElementById('book-session-doctor');
    if (docSelect) {
        docSelect.innerHTML = `<option value="" disabled selected>Select Therapist/Doctor</option>`;
        doctors.forEach(d => {
            docSelect.innerHTML += `<option value="${d.id}" data-fee="${d.consultation_fee}">${d.name} (${d.specialization}) - Fee: ₹${d.consultation_fee}</option>`;
        });
    }

    // Fetch appointments & notifications
    loadPatientAppointments();
    loadPatientNotifications();
    loadPatientHistory();
}

async function loadPatientAppointments() {
    try {
        const res = await fetch(`${API_BASE}/appointments`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const apts = await res.json();
        const container = document.getElementById('patient-appointments-list');
        if (!container) return;

        if (apts.length === 0) {
            container.innerHTML = `<p style="padding:2rem; text-align:center; color:var(--text-muted);">No online counselling appointments booked yet.</p>`;
            return;
        }

        container.innerHTML = apts.map(apt => {
            const dateStr = new Date(apt.date).toLocaleDateString();
            let actionBtn = '';
            
            if (apt.status === 'pending') {
                actionBtn = `<button class="btn btn-primary" onclick="openPaymentPortal('${apt.id}', ${apt.consultation_fee})"><i class="fa-solid fa-credit-card"></i> Pay Consultation Fee</button>`;
            } else if (apt.status === 'paid') {
                actionBtn = `<button class="btn btn-success" onclick="joinVideoConsultation('${apt.id}')"><i class="fa-solid fa-video"></i> Join Video Consultation</button>`;
            } else if (apt.status === 'completed') {
                actionBtn = `<span class="badge success">Completed</span>`;
            } else {
                actionBtn = `<span class="badge danger">Cancelled</span>`;
            }

            return `
                <div class="benefit-card" style="text-align:left; margin-bottom:1.5rem; display:flex; flex-direction:column; gap:1rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h4 style="color:var(--portal-primary);">ID: ${apt.id}</h4>
                        <span class="badge ${apt.status === 'paid' ? 'success' : apt.status === 'pending' ? 'warning' : 'info'}">${apt.status.toUpperCase()}</span>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1rem; font-size:0.95rem;">
                        <p><strong>Doctor:</strong> ${apt.doctor_name}</p>
                        <p><strong>Session Category:</strong> ${apt.counselling_type}</p>
                        <p><strong>Date & Time:</strong> ${dateStr} - ${apt.time_slot}</p>
                    </div>
                    <div>
                        <p><strong>Reason for consultation:</strong> ${apt.reason || 'Not Specified'}</p>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(0,0,0,0.05); padding-top:1rem;">
                        <div style="display:flex; gap:1rem;">
                            ${apt.status !== 'completed' && apt.status !== 'cancelled' ? `
                                <button class="btn btn-secondary" style="padding:0.4rem 1rem;" onclick="rescheduleApt('${apt.id}')">Reschedule</button>
                                <button class="btn btn-secondary" style="padding:0.4rem 1rem; background-color:var(--portal-danger); color:#fff;" onclick="cancelApt('${apt.id}')">Cancel</button>
                            ` : ''}
                            ${apt.status === 'completed' || apt.status === 'paid' ? `
                                <button class="btn btn-secondary" style="padding:0.4rem 1rem;" onclick="downloadInvoice('${apt.id}', '${apt.counselling_type}', ${apt.consultation_fee})"><i class="fa-solid fa-download"></i> Receipt</button>
                            ` : ''}
                        </div>
                        <div>
                            ${actionBtn}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        showToast('Error loading appointments.', 'danger');
    }
}

async function loadPatientHistory() {
    try {
        const res = await fetch(`${API_BASE}/consultations/history`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const history = await res.json();
        const container = document.getElementById('patient-history-list');
        if (!container) return;

        if (history.length === 0) {
            container.innerHTML = `<p style="padding:2rem; text-align:center; color:var(--text-muted);">No completed consultations found.</p>`;
            return;
        }

        container.innerHTML = history.map(h => `
            <div class="benefit-card" style="text-align:left; margin-bottom:1.5rem; padding:1.5rem;">
                <h4 style="margin-bottom:0.5rem;">Session: ${h.counselling_type} (with ${h.doctor_name})</h4>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">Completed on: ${new Date(h.completed_at).toLocaleString()}</p>
                <div style="background:#f8fafc; padding:1rem; border-radius:8px; margin-bottom:1rem;">
                    <strong>Session Notes:</strong>
                    <p style="margin-top:0.5rem; font-style:italic;">${h.session_notes}</p>
                </div>
                ${h.prescription_path ? `
                    <a href="${h.prescription_path}" target="_blank" class="btn btn-secondary" style="font-size:0.85rem; padding:0.4rem 1rem;"><i class="fa-solid fa-file-medical"></i> Download Prescription</a>
                ` : '<p style="font-size:0.85rem; color:var(--text-muted);">No prescription attachment uploaded.</p>'}
            </div>
        `).join('');
    } catch (e) {
        showToast('Error loading consultation history.', 'danger');
    }
}

// ----------------------------------------------------
// BOOKING FORM LOGIC
// ----------------------------------------------------
async function submitBookingForm(e) {
    e.preventDefault();
    const type = document.getElementById('book-session-type').value;
    const date = document.getElementById('book-session-date').value;
    const time = document.getElementById('book-session-time').value;
    const reason = document.getElementById('book-session-reason').value;
    const reportFile = document.getElementById('book-session-report').files[0];

    if (!type || !date || !time) {
        showToast('Please fill out all required fields.', 'warning');
        return;
    }

    let targetDocId = typeof selectedDoctorForBooking !== 'undefined' && selectedDoctorForBooking ? selectedDoctorForBooking : null;
    if (!targetDocId) {
        const typeLower = type.toLowerCase();
        if (typeLower.includes('ortho')) targetDocId = 'doc3';
        else if (typeLower.includes('speech') || typeLower.includes('child')) targetDocId = 'doc4';
        else if (typeLower.includes('depression') || typeLower.includes('anxiety')) targetDocId = 'doc2';
        else targetDocId = 'doc1';
    }

    const formData = new FormData();
    formData.append('doctorId', targetDocId);
    formData.append('counsellingType', type);
    formData.append('date', date);
    formData.append('timeSlot', time);
    formData.append('reason', reason);
    if (reportFile) formData.append('report', reportFile);

    try {
        const res = await fetch(`${API_BASE}/appointments`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${userToken}` },
            body: formData
        });
        const data = await res.json();
        if (data.error) {
            showToast(data.error, 'danger');
            return;
        }

        showToast(data.message, 'success');
        closeModal('booking-modal');
        document.getElementById('booking-session-form').reset();
        
        const fee = 500;
        openPaymentPortal(data.appointmentId, fee);
    } catch (err) {
        showToast('Error booking appointment.', 'danger');
    }
}

// Reschedule / Cancel actions
async function rescheduleApt(id) {
    const date = prompt("Enter new Date (YYYY-MM-DD):");
    const timeSlot = prompt("Enter new Time Slot (e.g. 10:00 AM, 11:30 AM):");
    if (!date || !timeSlot) return;

    try {
        const res = await fetch(`${API_BASE}/appointments/reschedule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ appointmentId: id, date, timeSlot })
        });
        const data = await res.json();
        showToast(data.message || data.error, data.error ? 'danger' : 'success');
        loadPatientAppointments();
    } catch (e) {
        showToast('Rescheduling failed.', 'danger');
    }
}

async function cancelApt(id) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
        const res = await fetch(`${API_BASE}/appointments/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ appointmentId: id })
        });
        const data = await res.json();
        showToast(data.message || data.error, data.error ? 'danger' : 'success');
        loadPatientAppointments();
    } catch (e) {
        showToast('Cancellation failed.', 'danger');
    }
}

// ----------------------------------------------------
// UPDATE PROFILE FLOW
// ----------------------------------------------------
async function updateProfile(e) {
    e.preventDefault();
    const name = document.getElementById('pat-profile-name').value;
    const phone = document.getElementById('pat-profile-phone').value;
    const age = document.getElementById('pat-profile-age').value;
    const gender = document.getElementById('pat-profile-gender').value;
    const city = document.getElementById('pat-profile-city').value;

    try {
        const res = await fetch(`${API_BASE}/profile/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ name, phone, age, gender, city })
        });
        const data = await res.json();
        if (data.error) {
            showToast(data.error, 'danger');
            return;
        }

        currentUser.name = name;
        currentUser.phone = phone;
        currentUser.age = age;
        currentUser.gender = gender;
        currentUser.city = city;
        localStorage.setItem('user', JSON.stringify(currentUser));

        showToast('Profile details updated successfully.', 'success');
    } catch (err) {
        showToast('Profile update failed.', 'danger');
    }
}

async function toggle2FA(checked) {
    try {
        const res = await fetch(`${API_BASE}/auth/enable-2fa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ enable: checked })
        });
        const data = await res.json();
        showToast(data.message, 'success');
        currentUser.twoFaEnabled = checked;
        localStorage.setItem('user', JSON.stringify(currentUser));
    } catch (e) {
        showToast('Error modifying 2FA status.', 'danger');
    }
}

// ----------------------------------------------------
// PAYMENT FLOW
// ----------------------------------------------------
function openPaymentPortal(appointmentId, amount) {
    openModal('payment-modal');
    document.getElementById('pay-appointment-id').textContent = appointmentId;
    document.getElementById('pay-amount').textContent = amount;
    
    // Wire submit button
    const payForm = document.getElementById('payment-checkout-form');
    payForm.onsubmit = async (e) => {
        e.preventDefault();
        const method = document.querySelector('input[name="payment-method"]:checked').value;

        try {
            const res = await fetch(`${API_BASE}/payments/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({ appointmentId, method, amount })
            });
            const data = await res.json();
            if (data.error) {
                showToast(data.error, 'danger');
                return;
            }

            showToast(data.message, 'success');
            closeModal('payment-modal');
            loadPatientDashboard();
        } catch (err) {
            showToast('Payment execution failed.', 'danger');
        }
    };
}

function downloadInvoice(id, type, amount) {
    // Generate a beautiful client-side print view / PDF for payment receipt
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Payment Receipt - V-KARE Clinic</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                .receipt-container { border: 1px solid #ddd; padding: 30px; border-radius: 8px; max-width: 600px; margin: auto; }
                .header { text-align: center; border-bottom: 2px solid #0A4ABF; padding-bottom: 20px; }
                .logo { font-size: 24px; font-weight: bold; color: #0A4ABF; }
                .meta-grid { display: grid; grid-template-columns: 1fr 1fr; margin: 20px 0; font-size: 14px; line-height: 1.6; }
                .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .table th, .table td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
                .table th { background: #f5f5f5; }
                .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
                .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #777; }
            </style>
        </head>
        <body>
            <div class="receipt-container">
                <div class="header">
                    <div class="logo">V-KARE Mind & Brain Clinic</div>
                    <p>Siddaganga Extension, Tumkur, Karnataka</p>
                </div>
                <div class="meta-grid">
                    <div>
                        <strong>Receipt To:</strong><br>
                        ${currentUser.name}<br>
                        Email: ${currentUser.email}
                    </div>
                    <div style="text-align: right;">
                        <strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}<br>
                        <strong>Receipt ID:</strong> REC-${Date.now()}<br>
                        <strong>Appointment ID:</strong> ${id}
                    </div>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Online Counselling Consultation - ${type}</td>
                            <td>₹${amount.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="total">Total Paid: ₹${amount.toFixed(2)}</div>
                <div class="footer">
                    <p>Thank you for choosing V-KARE Mind & Brain Clinic.</p>
                    <p>This is a computer generated invoice and requires no physical signature.</p>
                </div>
            </div>
            <script>window.print();</script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// ----------------------------------------------------
// DOCTOR PORTAL OPERATIONS
// ----------------------------------------------------
async function loadDoctorDashboard() {
    try {
        const res = await fetch(`${API_BASE}/appointments`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const apts = await res.json();
        
        // Filter today's appointments
        const todayStr = new Date().toISOString().split('T')[0];
        const todaysApts = apts.filter(a => a.date === todayStr);

        const todayContainer = document.getElementById('doctor-today-appointments');
        if (todayContainer) {
            if (todaysApts.length === 0) {
                todayContainer.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--text-muted);">No consultations scheduled for today.</td></tr>`;
            } else {
                todayContainer.innerHTML = todaysApts.map(a => `
                    <tr>
                        <td><strong>${a.patient_name}</strong><br><small>Age: ${a.patient_age}, Gender: ${a.patient_gender}</small></td>
                        <td>${a.counselling_type}</td>
                        <td>${a.time_slot}</td>
                        <td><span class="badge ${a.status === 'paid' ? 'success' : 'info'}">${a.status.toUpperCase()}</span></td>
                        <td>
                            ${a.status === 'paid' ? `
                                <button class="btn btn-primary" style="padding:0.4rem 1rem;" onclick="startConsultationSession('${a.id}', '${a.patient_name}')"><i class="fa-solid fa-play"></i> Start Session</button>
                            ` : '<span style="color:var(--text-muted);">Awaiting Payment</span>'}
                        </td>
                    </tr>
                `).join('');
            }
        }

        // Complete list
        const rosterContainer = document.getElementById('doctor-all-appointments');
        if (rosterContainer) {
            if (apts.length === 0) {
                rosterContainer.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--text-muted);">No appointments booked in roster.</td></tr>`;
            } else {
                rosterContainer.innerHTML = apts.map(a => `
                    <tr>
                        <td><strong>${a.patient_name}</strong></td>
                        <td>${a.counselling_type}</td>
                        <td>${a.date} - ${a.time_slot}</td>
                        <td><span class="badge ${a.status === 'completed' ? 'success' : a.status === 'cancelled' ? 'danger' : 'warning'}">${a.status.toUpperCase()}</span></td>
                        <td>
                            ${a.status !== 'completed' && a.status !== 'cancelled' ? `
                                <button class="btn btn-secondary" style="padding:0.3rem 0.6rem;" onclick="rescheduleApt('${a.id}')">Reschedule</button>
                            ` : '-'}
                        </td>
                    </tr>
                `).join('');
            }
        }
    } catch (e) {
        showToast('Error loading doctor portal data.', 'danger');
    }
}

function startConsultationSession(appointmentId, patientName) {
    openModal('video-room-modal');
    document.getElementById('video-room-patient-name').textContent = patientName;
    document.getElementById('session-complete-appointment-id').value = appointmentId;

    // Show Session Notes pane for Doctor
    document.getElementById('doctor-notes-area').style.display = 'block';

    // Start Video
    startLocalVideoFeed();
    startSessionTimer(45); // 45 minutes limit
}

function joinVideoConsultation(appointmentId) {
    openModal('video-room-modal');
    document.getElementById('video-room-patient-name').textContent = 'Dr. Vinay Kumar (Therapist)';
    document.getElementById('doctor-notes-area').style.display = 'none';

    // Start Video
    startLocalVideoFeed();
    startSessionTimer(45);
}

// ----------------------------------------------------
// VIDEO CONSULTATION ENGINE (MOCK WEBRTC)
// ----------------------------------------------------
async function startLocalVideoFeed() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const localVideo = document.getElementById('local-video-element');
        if (localVideo) {
            localVideo.srcObject = localStream;
            localVideo.style.display = 'block';
            document.getElementById('local-video-placeholder').style.display = 'none';
        }
    } catch (e) {
        showToast('Unable to access camera or microphone.', 'warning');
    }
}

function startSessionTimer(minutes) {
    let seconds = minutes * 60;
    const display = document.getElementById('session-timer-display');
    
    clearInterval(sessionInterval);
    sessionInterval = setInterval(() => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        display.textContent = `${m}:${s}`;
        
        if (seconds <= 0) {
            clearInterval(sessionInterval);
            showToast('Consultation session time limit reached.', 'warning');
        }
        seconds--;
    }, 1000);
}

function toggleAudio() {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            const btn = document.getElementById('video-btn-audio');
            btn.classList.toggle('active', audioTrack.enabled);
            btn.innerHTML = audioTrack.enabled ? `<i class="fa-solid fa-microphone"></i>` : `<i class="fa-solid fa-microphone-slash"></i>`;
            showToast(audioTrack.enabled ? 'Microphone unmuted' : 'Microphone muted', 'info');
        }
    }
}

function toggleVideo() {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            const btn = document.getElementById('video-btn-camera');
            btn.classList.toggle('active', videoTrack.enabled);
            btn.innerHTML = videoTrack.enabled ? `<i class="fa-solid fa-video"></i>` : `<i class="fa-solid fa-video-slash"></i>`;
            showToast(videoTrack.enabled ? 'Camera turned on' : 'Camera turned off', 'info');
        }
    }
}

async function toggleScreenShare() {
    const btn = document.getElementById('video-btn-screenshare');
    if (!screenStream) {
        try {
            screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const localVideo = document.getElementById('local-video-element');
            localVideo.srcObject = screenStream;
            btn.classList.add('active');
            showToast('Screen sharing started.', 'success');

            // Handle stop screen sharing from browser bar
            screenStream.getVideoTracks()[0].onended = () => {
                stopScreenShare();
            };
        } catch (e) {
            showToast('Screen sharing cancelled.', 'warning');
        }
    } else {
        stopScreenShare();
    }
}

function stopScreenShare() {
    if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
        screenStream = null;
    }
    const btn = document.getElementById('video-btn-screenshare');
    btn.classList.remove('active');
    
    // Restore local camera
    const localVideo = document.getElementById('local-video-element');
    if (localVideo && localStream) {
        localVideo.srcObject = localStream;
    }
    showToast('Screen sharing stopped.', 'info');
}

function sendSessionChatMessage() {
    const input = document.getElementById('video-chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const messages = document.getElementById('video-chat-messages');
    const msgEl = document.createElement('div');
    msgEl.style.marginBottom = '0.5rem';
    msgEl.innerHTML = `<strong>${currentUser.name.split(' ')[0]}:</strong> <span>${msg}</span>`;
    messages.appendChild(msgEl);
    messages.scrollTop = messages.scrollHeight;
    input.value = '';

    // Mock replies for natural response
    setTimeout(() => {
        const replyEl = document.createElement('div');
        replyEl.style.marginBottom = '0.5rem';
        replyEl.innerHTML = `<strong>Doctor:</strong> <span>Yes, I can hear you clearly. Let's start the session.</span>`;
        messages.appendChild(replyEl);
        messages.scrollTop = messages.scrollHeight;
    }, 2000);
}

function endConsultationCall() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
        screenStream = null;
    }
    clearInterval(sessionInterval);
    closeModal('video-room-modal');
    showToast('Consultation session call ended.', 'info');
    
    if (currentUser.role === 'doctor') {
        loadDoctorDashboard();
    } else {
        loadPatientDashboard();
    }
}

async function submitConsultationNotes(e) {
    e.preventDefault();
    const aptId = document.getElementById('session-complete-appointment-id').value;
    const notes = document.getElementById('session-doctor-notes').value;
    const prescriptionFile = document.getElementById('session-doctor-prescription').files[0];

    const formData = new FormData();
    formData.append('appointmentId', aptId);
    formData.append('notes', notes);
    if (prescriptionFile) formData.append('prescription', prescriptionFile);

    try {
        const res = await fetch(`${API_BASE}/consultations/complete`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${userToken}` },
            body: formData
        });
        const data = await res.json();
        showToast(data.message || data.error, data.error ? 'danger' : 'success');
        
        // Clean call
        endConsultationCall();
    } catch (err) {
        showToast('Error uploading session closure.', 'danger');
    }
}

// ----------------------------------------------------
// ADMIN DASHBOARD BACKUP/AUDIT SYSTEM
// ----------------------------------------------------
async function loadAdminDashboard() {
    // Populate Audit logs
    try {
        const res = await fetch(`${API_BASE}/admin/logs`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const logs = await res.json();
        const container = document.getElementById('admin-audit-logs-body');
        if (container) {
            container.innerHTML = logs.map(l => `
                <tr>
                    <td>${new Date(l.timestamp).toLocaleString()}</td>
                    <td>${l.user_id}</td>
                    <td>${l.action}</td>
                    <td>${l.ip_address}</td>
                </tr>
            `).join('');
        }

        // Load backup list
        loadAdminBackups();
    } catch (e) {
        console.error(e);
    }
}

async function triggerDatabaseBackup() {
    try {
        const res = await fetch(`${API_BASE}/admin/backup`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const data = await res.json();
        showToast(data.message, 'success');
        loadAdminBackups();
    } catch (e) {
        showToast('Backup creation failed.', 'danger');
    }
}

async function loadAdminBackups() {
    try {
        const res = await fetch(`${API_BASE}/admin/backups`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const backups = await res.json();
        const container = document.getElementById('admin-backups-list');
        if (container) {
            if (backups.length === 0) {
                container.innerHTML = `<li style="padding:1rem; color:var(--text-muted);">No backups found.</li>`;
                return;
            }
            container.innerHTML = backups.map(b => `
                <li style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:0.8rem 1rem; border-radius:8px; margin-bottom:0.5rem; font-size:0.9rem;">
                    <span>${b.name} (${new Date(b.time).toLocaleString()})</span>
                    <button class="btn btn-secondary" style="padding:0.3rem 0.8rem; font-size:0.8rem;" onclick="restoreDatabaseBackup('${b.name}')">Restore</button>
                </li>
            `).join('');
        }
    } catch (e) {
        console.error(e);
    }
}

async function restoreDatabaseBackup(filename) {
    if (!confirm(`Are you sure you want to restore database to ${filename}? Current sessions and modifications will be replaced.`)) return;

    try {
        const res = await fetch(`${API_BASE}/admin/restore`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ filename })
        });
        const data = await res.json();
        showToast(data.message, 'success');
        logout(); // Force login again
    } catch (e) {
        showToast('Restore operations failed.', 'danger');
    }
}

// FAQs logic
function setupFAQAccordion() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentNode;
            item.classList.toggle('active');
        });
    });
}
