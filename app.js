// --- V-KARE CLINIC WEB CONTROLLER ---

// 1. DATA SEEDING (Initialize LocalStorage if empty)
const SEED_DATA = {
    doctors: [
        {
            id: "doc1",
            name: "Dr. Vinay Kumar",
            nameKn: "ಡಾ. ವಿನಯ್ ಕುಮಾರ್",
            qual: "MD (Psychiatry), DPM (NIMHANS)",
            spec: "Consultant Psychiatrist & Mental Wellness Specialist",
            specKn: "ಮನೋವೈದ್ಯರು ಮತ್ತು ಮಾನಸಿಕ ಸ್ವಾಸ್ಥ್ಯ ತಜ್ಞರು",
            exp: "12+ Years Experience",
            expKn: "೧೨+ ವರ್ಷಗಳ ಅನುಭವ",
            licenseNo: "KMC Reg. No. 78241",
            rating: 4.9,
            reviewsCount: 142,
            fee: 600,
            languages: "English, Kannada, Hindi",
            hours: "Mon - Sat: 10:00 AM - 1:00 PM, 5:00 PM - 8:00 PM",
            hoursKn: "ಸೋಮ - ಶನಿ: ಬೆಳಿಗ್ಗೆ 10:00 - ಮಧ್ಯಾಹ್ನ 1:00, ಸಂಜೆ 5:00 - ರಾತ್ರಿ 8:00",
            dept: "psychiatry",
            avatar: "🧠",
            onlineAvail: true,
            bio: "Dr. Vinay Kumar is an acclaimed Psychiatrist trained at NIMHANS with 12+ years of clinical excellence in treating clinical depression, bipolar disorder, panic anxiety, OCD, and stress management through evidence-based pharmacological and CBT counseling therapies.",
            bioKn: "ಡಾ. ವಿನಯ್ ಕುಮಾರ್ ಅವರು ನಿಮ್ಹಾನ್ಸ್‌ನಿಂದ ತರಬೇತಿ ಪಡೆದ ಪ್ರಸಿದ್ಧ ಮನೋವೈದ್ಯರಾಗಿದ್ದು, ಖಿನ್ನತೆ, ಆತಂಕ ಮತ್ತು ಒತ್ತಡ ನಿವಾರಣೆಯಲ್ಲಿ ೧೨ಕ್ಕೂ ಹೆಚ್ಚು ವರ್ಷಗಳ ಅನುಭವ ಹೊಂದಿದ್ದಾರೆ.",
            expertiseTags: ["Clinical Depression", "Anxiety & Panic", "OCD & Bipolar", "Psychiatric Medication", "Cognitive Behavioral Therapy (CBT)"]
        },
        {
            id: "doc2",
            name: "Dr. Anitha K.",
            nameKn: "ಡಾ. ಅನಿತಾ ಕೆ.",
            qual: "Ph.D. in Clinical Psychology, M.Phil (NIMHANS)",
            spec: "Senior Clinical Psychologist & Child Counselor",
            specKn: "ಹಿರಿಯ ಕ್ಲಿನಿಕಲ್ ಸೈಕಾಲಜಿಸ್ಟ್ ಮತ್ತು ಮಕ್ಕಳ ಆಪ್ತಸಮಾಲೋಚಕರು",
            exp: "8+ Years Experience",
            expKn: "೮+ ವರ್ಷಗಳ ಅನುಭವ",
            licenseNo: "RCI Reg. No. A59210",
            rating: 4.8,
            reviewsCount: 98,
            fee: 500,
            languages: "English, Kannada",
            hours: "Mon - Fri: 2:00 PM - 6:00 PM",
            hoursKn: "ಸೋಮ - ಶುಕ್ರ: ಮಧ್ಯಾಹ್ನ 2:00 - ಸಂಜೆ 6:00",
            dept: "psychiatry",
            avatar: "👩‍⚕️",
            onlineAvail: true,
            bio: "Dr. Anitha K. is a licensed Rehabilitation Council of India (RCI) Clinical Psychologist specializing in ADHD behavioral therapy, IQ testing, adolescent counseling, trauma recovery, and family psychotherapy.",
            bioKn: "ಡಾ. ಅನಿತಾ ಕೆ. ಅವರು ಆರ್‌ಸಿಐ ಮಾನ್ಯತೆ ಪಡೆದ ಕ್ಲಿನಿಕಲ್ ಸೈಕಾಲಜಿಸ್ಟ್ ಆಗಿದ್ದು, ಮಕ್ಕಳ ನಡವಳಿಕೆ, ಎಡಿಎಚ್‌ಡಿ ಮತ್ತು ಕೌಟುಂಬಿಕ ಆಪ್ತಸಮಾಲೋಚನೆಯಲ್ಲಿ ಪರಿಣಿತರು.",
            expertiseTags: ["Child ADHD Therapy", "IQ & Learning Assessments", "Teenage Counseling", "Trauma & Stress", "Family Therapy"]
        },
        {
            id: "doc3",
            name: "Dr. Kiran R. S.",
            nameKn: "ಡಾ. ಕಿರಣ್ ಆರ್. ಎಸ್.",
            qual: "MS (Ortho), Fellowship in Pediatric Orthopedics (UK)",
            spec: "Senior Pediatric Orthopedic Surgeon",
            specKn: "ಮಕ್ಕಳ ಮೂಳೆ ಮತ್ತು ಕೀಲು ತಜ್ಞರು",
            exp: "10+ Years Experience",
            expKn: "೧೦+ ವರ್ಷಗಳ ಅನುಭವ",
            licenseNo: "KMC Reg. No. 64109",
            rating: 4.9,
            reviewsCount: 115,
            fee: 700,
            languages: "English, Kannada, Telugu",
            hours: "Tue, Thu, Sat: 4:00 PM - 7:00 PM",
            hoursKn: "ಮಂಗಳ, ಗುರು, ಶನಿ: ಸಂಜೆ 4:00 - ರಾತ್ರಿ 7:00",
            dept: "orthopedics",
            avatar: "🦴",
            onlineAvail: false,
            bio: "Dr. Kiran R. S. completed fellowship training in Pediatric Orthopedics in the UK. He specializes in Ponseti clubfoot correction, pediatric bone deformity corrections, cerebral palsy gait rehabilitation, and pediatric trauma management.",
            bioKn: "ಡಾ. ಕಿರಣ್ ಆರ್. ಎಸ್. ಅವರು ಯುಕೆ ಯಲ್ಲಿ ಮಕ್ಕಳ ಮೂಳೆ ಚಿಕಿತ್ಸೆಯ ಫೆಲೋಶಿಪ್ ಪಡೆದಿದ್ದು, ಕ್ಲಬ್‌ಫುಟ್ ಮತ್ತು ಮೂಳೆ ವೈಪರೀತ್ಯಗಳ ನಿವಾರಣೆಯಲ್ಲಿ ನುರಿತವರು.",
            expertiseTags: ["Clubfoot (Ponseti Method)", "Gait Analysis", "Limb Deformity Correction", "Pediatric Trauma & Fractures", "Cerebral Palsy Care"]
        },
        {
            id: "doc4",
            name: "Mrs. Shwetha G.",
            nameKn: "ಶ್ರೀಮತಿ ಶ್ವೇತಾ ಜಿ.",
            qual: "BASLP, M.Sc. (Speech-Language Pathology)",
            spec: "Senior Speech Therapist & Audiologist",
            specKn: "ಮಾತು ಮತ್ತು ಶ್ರವಣ ಚಿಕಿತ್ಸಕರು",
            exp: "6+ Years Experience",
            expKn: "೬+ ವರ್ಷಗಳ ಅನುಭವ",
            licenseNo: "RCI Reg. No. B84123",
            rating: 4.9,
            reviewsCount: 160,
            fee: 450,
            languages: "English, Kannada, Tamil",
            hours: "Mon - Sat: 9:30 AM - 1:30 PM, 3:30 PM - 6:30 PM",
            hoursKn: "ಸೋಮ - ಶನಿ: ಬೆಳಿಗ್ಗೆ 9:30 - ಮಧ್ಯಾಹ್ನ 1:30, ಸಂಜೆ 3:30 - 6:30",
            dept: "speech",
            avatar: "🗣️",
            onlineAvail: true,
            bio: "Mrs. Shwetha G. is an RCI-registered Speech Pathologist with extensive experience in pediatric articulation disorders, stammering/stuttering therapy, autism spectrum communication therapy, and digital audiometric evaluations.",
            bioKn: "ಶ್ರೀಮತಿ ಶ್ವೇತಾ ಜಿ. ಅವರು ಮಾತು ಮತ್ತು ಶ್ರವಣ ಚಿಕಿತ್ಸೆಯಲ್ಲಿ ೬ ವರ್ಷಕ್ಕೂ ಹೆಚ್ಚು ಅನುಭವ ಹೊಂದಿದ್ದು, ತೋತಲಾಡುವಿಕೆ ಮತ್ತು ಆಟಿಸಂ ಮಕ್ಕಳ ಸಂವಹನ ಚಿಕಿತ್ಸೆಯಲ್ಲಿ ಪರಿಣಿತರು.",
            expertiseTags: ["Stuttering & Stammering Therapy", "Autism Communication", "Speech Sound Articulation", "Voice Disorders", "Audiometry & Hearing Aids"]
        }
    ],
    appointments: [
        {
            id: "apt-101",
            name: "Sunil Kumar",
            phone: "9876543210",
            email: "sunil@example.com",
            dept: "psychiatry",
            docId: "doc1",
            docName: "Dr. Vinay Kumar",
            date: "2026-06-12",
            time: "11:00 AM",
            msg: "Regular checkup for stress management",
            status: "approved",
            timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: "apt-102",
            name: "Raju Gowda",
            phone: "9900112233",
            email: "raju@example.com",
            dept: "orthopedics",
            docId: "doc3",
            docName: "Dr. Kiran R. S.",
            date: "2026-06-15",
            time: "05:30 PM",
            msg: "Consultation for child club foot",
            status: "pending",
            timestamp: new Date().toISOString()
        }
    ],
    testimonials: [
        {
            name: "Ananya Deshpande",
            rating: 5,
            text: "The psychology team at V-KARE helped my daughter navigate her learning difficulties with so much care. We have seen tremendous improvement in her ADHD symptoms.",
            textKn: "ನನ್ನ ಮಗಳ ಕಲಿಕಾ ತೊಂದರೆಗಳು ಮತ್ತು ಎಡಿಎಚ್‌ಡಿ ಲಕ್ಷಣಗಳನ್ನು ನಿವಾರಿಸುವಲ್ಲಿ ವಿ-ಕೇರ್ ಮನೋವಿಜ್ಞಾನ ತಂಡವು ಬಹಳ ಕಾಳಜಿಯಿಂದ ಸಹಾಯ ಮಾಡಿದೆ. ಅವರ ಚಿಕಿತ್ಸೆಯಿಂದ ಉತ್ತಮ ಪ್ರಗತಿ ಕಂಡಿದ್ದೇವೆ."
        },
        {
            name: "Nagaraj Rao",
            rating: 5,
            text: "Dr. Vinay Kumar is an exceptional psychiatrist. His counseling and treatment plans for my anxiety were highly practical and evidence-based. Highly recommended!",
            textKn: "ಡಾ. ವಿನಯ್ ಕುಮಾರ್ ಅವರು ಅತ್ಯುತ್ತಮ ಮನೋವೈದ್ಯರು. ನನ್ನ ಆತಂಕಕ್ಕೆ ಅವರ ಆಪ್ತಸಮಾಲೋಚನೆ ಮತ್ತು ಚಿಕಿತ್ಸೆಗಳು ಅತ್ಯಂತ ಪರಿಣಾಮಕಾರಿಯಾಗಿದ್ದವು. ನನ್ನ ಹೃತ್ಪೂರ್ವಕ ಧನ್ಯವಾದಗಳು."
        },
        {
            name: "Meenakshi M.",
            rating: 5,
            text: "The speech therapy program for my 4-year-old son has been fantastic. Mrs. Shwetha's play-based therapy got him talking and expressing himself beautifully.",
            textKn: "ನನ್ನ ೪ ವರ್ಷದ ಮಗನಿಗೆ ನೀಡಿದ ಮಾತು ಚಿಕಿತ್ಸೆ ಅದ್ಭುತವಾಗಿದೆ. ಶ್ರೀಮತಿ ಶ್ವೇತಾ ಅವರ ಆಟದ ಆಧಾರಿತ ಚಿಕಿತ್ಸೆಯಿಂದ ಮಗು ಈಗ ಸರಾಗವಾಗಿ ಮಾತನಾಡುತ್ತಿದೆ."
        }
    ],
    blogs: [
        {
            tag: "Mental Health",
            tagKn: "ಮಾನಸಿಕ ಆರೋಗ್ಯ",
            title: "Understanding Depression: Symptoms & When to Seek Help",
            titleKn: "ಖಿನ್ನತೆಯ ತಿಳುವಳಿಕೆ: ಲಕ್ಷಣಗಳು ಮತ್ತು ಯಾವಾಗ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಬೇಕು",
            excerpt: "Depression is more than just feeling sad. Learn how to recognize the clinical symptoms and the psychological therapies available.",
            excerptKn: "ಖಿನ್ನತೆ ಕೇವಲ ದುಃಖವಲ್ಲ. ಇದರ ಕ್ಲಿನಿಕಲ್ ಲಕ್ಷಣಗಳನ್ನು ಗುರುತಿಸುವುದು ಮತ್ತು ಲಭ್ಯವಿರುವ ಚಿಕಿತ್ಸೆಗಳ ಬಗ್ಗೆ ಇಲ್ಲಿ ತಿಳಿಯಿರಿ.",
            date: "May 24, 2026",
            icon: "🧠"
        },
        {
            tag: "Child Development",
            tagKn: "ಮಕ್ಕಳ ಬೆಳವಣಿಗೆ",
            title: "Spotting Early Milestones in Speech & Language Development",
            titleKn: "ಮಕ್ಕಳ ಮಾತು ಮತ್ತು ಭಾಷಾ ಬೆಳವಣಿಗೆಯ ಆರಂಭಿಕ ಹಂತಗಳನ್ನು ಗುರುತಿಸುವುದು",
            excerpt: "A simple guide for parents to monitor their child's language developmental milestones from ages 1 to 5.",
            excerptKn: "೧ ರಿಂದ ೫ ವರ್ಷದ ಮಕ್ಕಳ ಭಾಷಾ ಬೆಳವಣಿಗೆಯ ಮೈಲಿಗಲ್ಲುಗಳನ್ನು ಪೋಷಕರು ಸುಲಭವಾಗಿ ತಿಳಿಯಲು ಒಂದು ಸರಳ ಮಾರ್ಗದರ್ಶಿ.",
            date: "June 02, 2026",
            icon: "🧒"
        },
        {
            tag: "Pediatric Ortho",
            tagKn: "ಮಕ್ಕಳ ಮೂಳೆ ಚಿಕಿತ್ಸೆ",
            title: "What Parents Need to Know About Club Foot and Cerebral Palsy",
            titleKn: "ಮಕ್ಕಳ ಕ್ಲಬ್ ಫೂಟ್ ಮತ್ತು ಸೆರೆಬ್ರಲ್ ಪಾಲ್ಸಿ ಬಗ್ಗೆ ಪೋಷಕರು ತಿಳಿಯಬೇಕಾದ ವಿಷಯಗಳು",
            excerpt: "Early diagnosis and orthopedic therapy can ensure comfortable, independent movement for children with developmental walking difficulties.",
            excerptKn: "ಆರಂಭಿಕ ರೋಗನಿರ್ಣಯ ಮತ್ತು ಮೂಳೆ ಚಿಕಿತ್ಸೆಯು ನಡಿಗೆಯ ತೊಂದರೆ ಇರುವ ಮಕ್ಕಳಿಗೆ ಸ್ವತಂತ್ರವಾಗಿ ಚಲಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
            date: "June 08, 2026",
            icon: "🦴"
        }
    ]
};

// Initialize localStorage if keys don't exist
function initLocalStorage() {
    if (!localStorage.getItem('vkare_doctors')) {
        localStorage.setItem('vkare_doctors', JSON.stringify(SEED_DATA.doctors));
    }
    if (!localStorage.getItem('vkare_appointments')) {
        localStorage.setItem('vkare_appointments', JSON.stringify(SEED_DATA.appointments));
    }
    if (!localStorage.getItem('vkare_testimonials')) {
        localStorage.setItem('vkare_testimonials', JSON.stringify(SEED_DATA.testimonials));
    }
    if (!localStorage.getItem('vkare_blogs')) {
        localStorage.setItem('vkare_blogs', JSON.stringify(SEED_DATA.blogs));
    }
    if (!localStorage.getItem('vkare_visitors')) {
        localStorage.setItem('vkare_visitors', '124');
    }
    // Increment visitor count on load
    let visits = parseInt(localStorage.getItem('vkare_visitors')) || 124;
    localStorage.setItem('vkare_visitors', (visits + 1).toString());
}
initLocalStorage();

// State variables
let currentLanguage = 'en';
let activeDepartmentFilter = 'all';

// Fetching state data
function getDoctors() { 
    let docs = JSON.parse(localStorage.getItem('vkare_doctors')) || SEED_DATA.doctors;
    return docs.map(d => {
        const photo = d.photoUrl || d.photo_url || (d.id === 'doc1' ? 'images/doc_vinay.jpg' : (d.id === 'doc2' ? 'images/doc_anitha.jpg' : (d.id === 'doc3' ? 'images/doc_kiran.jpg' : (d.id === 'doc4' ? 'images/doc_shwetha.jpg' : null))));
        return { ...d, photoUrl: photo, photo_url: photo };
    });
}
function getAppointments() { return JSON.parse(localStorage.getItem('vkare_appointments')); }
function getTestimonials() { return JSON.parse(localStorage.getItem('vkare_testimonials')); }
function getBlogs() { return JSON.parse(localStorage.getItem('vkare_blogs')); }

// 2. BILINGUAL DICTIONARY (English & Kannada)
const TRANSLATIONS = {
    en: {
        navHome: "Home",
        navServices: "Services",
        navAbout: "About Us",
        navDoctors: "Specialists",
        navBlog: "Blog & Awareness",
        navContact: "Contact Us",
        navBook: "Book Appointment",
        navAdmin: "Admin Panel",

        heroTitle: "Expert Care for <span>Mind, Brain</span> & Child Development",
        heroSub: "Multidisciplinary Healthcare Services Under One Roof. V-KARE brings professional psychiatry, child orthopedics, audiology, and therapy support directly to Tumkur.",
        heroBook: "Book Appointment",
        heroCall: "Call Clinic",
        heroBadge1: "Multidisciplinary",
        heroBadge1Sub: "All specialties in one roof",
        heroBadge2: "Licensed Experts",
        heroBadge2Sub: "Compassionate treatment",
        modeOfflineTitle: "In-Clinic Care (Offline)",
        modeOfflineDesc: "Visit V-KARE Clinic in Tumkur for face-to-face diagnostics, physical rehabilitation, and consultations.",
        modeOnlineTitle: "Video Consultation (Online)",
        modeOnlineDesc: "Consult with our board-certified psychiatrists, clinical psychologists, and therapists from home.",
        btnBookOffline: "Book In-Clinic Slot",
        btnBookOnline: "Book Video Slot",

        whyTitle: "Why Choose V-KARE?",
        whySub: "We blend high-quality evidence-based clinical expertise with emotional and physical rehabilitation.",
        whyCard1Title: "Evidence-Based Care",
        whyCard1Text: "All psychiatric therapies, pediatric surgeries, and audiology services are backed by proven clinical standards.",
        whyCard2Title: "Holistic Multidisciplinary Team",
        whyCard2Text: "Psychiatrists, Pediatric Orthopedicians, Speech Therapists, and Psychologists collaborating under one roof.",
        whyCard3Title: "Confidential & Safe",
        whyCard3Text: "Your privacy is our priority. We maintain strict ethical standards for child and adult counselling.",
        whyCard4Title: "Accessible & Local",
        whyCard4Text: "Conveniently located in Siddaganga Extension, Tumkur, offering world-class care locally.",

        servicesTitle: "Our Services",
        servicesSub: "Explore our expert departments designed for mental wellness, physical healing, and communication skills.",
        tabPsych: "Psychiatry & Psychology",
        tabOrtho: "Pediatric Orthopedics",
        tabSpeech: "Audiology & Speech Therapy",

        psychDesc: "We provide comprehensive assessment and evidence-based clinical support for adults and children facing psychological, behavioural, and emotional challenges.",
        orthoDesc: "Specialized diagnostics and surgical solutions for congenital deformities, bone injuries, and neuromuscular motor conditions in children.",
        speechDesc: "Advanced evaluation of hearing capacity, speech correction, feeding difficulties, and specialized school-based therapy support.",

        doctorsTitle: "Doctors & Specialists",
        doctorsSub: "Consult with our team of board-certified, experienced clinicians dedicated to your holistic recovery.",
        bookDoc: "Book Session",
        hoursLabel: "Consultation Hours:",

        bookingTitle: "Online Appointment Booking",
        bookingSub: "Submit your preferred slot. Our desk will contact you via Phone/WhatsApp to confirm.",
        formName: "Patient Name",
        formPhone: "Mobile Number",
        formEmail: "Email Address",
        formDept: "Select Department",
        formDoc: "Select Doctor",
        formDate: "Preferred Date",
        formTime: "Preferred Time",
        formMsg: "Brief details of condition (optional)",
        formSubmit: "Book Appointment Now",
        formMode: "Consultation Mode",
        modeInPerson: "In-Person (Clinic Visit)",
        modeVideo: "Online (Video Consultation)",
        onlineAvailBadge: "💻 Online Consultation Available",
        selectDeptFirst: "Please select department first",
        deptPsych: "Psychiatry & Psychology",
        deptOrtho: "Pediatric Orthopedics",
        deptSpeech: "Audiology & Speech Therapy",

        testTitle: "Patient Reviews",
        testSub: "Read stories of recovery and hope from families who trusted our therapeutic care.",

        galleryTitle: "Clinic Gallery",
        gallerySub: "A glimpse into V-KARE's modern clinic environment, child-friendly therapy zones, and events.",
        gal1: "Modern Counseling Rooms",
        gal2: "Child Sensory Play Zone",
        gal3: "Audiology Check Cabin",
        gal4: "Mental Health Awareness Event",

        blogTitleSec: "Health Awareness Blog",
        blogSubSec: "Read articles written by our specialists to foster mental wellness and early child development.",
        readMore: "Read Full Article",

        contactTitleSec: "Contact & Location",
        contactSubSec: "Visit us at Tumkur or reach out directly for immediate support.",
        addressTitle: "Clinic Address",
        addressText: "3rd Cross, Jain Bhavana Road, Siddaganga Extension, Tumkur, Karnataka – 572102",
        phoneTitle: "Contact Numbers",
        phoneText: "9980999068",
        timingTitle: "Working Hours",
        timingText: "Mon - Sat: 9:30 AM - 8:30 PM (Sunday Holiday)",

        footerAbout: "V-KARE Mind & Brain Clinic is Tumkur's leading multidisciplinary healthcare clinic, providing dedicated services in Psychiatry, Child Orthopedics, Speech Pathology, and Counseling.",
        footerLinks: "Quick Links",
        footerServices: "Specialties",
        footerRights: "© 2026 V-KARE Mind & Brain Clinic. All rights reserved.",
        footerAdmin: "Authorized Admin Log-In",

        chatGreet: "Hello! I am V-KARE's virtual assistant. How can I help you today?",
        chatAskApt: "Book Appointment",
        chatAskDoc: "Our Doctors",
        chatAskLoc: "Location & Timings",
        chatInputPlace: "Type your query here...",
        chatBotStatus: "Online Support",

        confirmTitle: "Booking Successful!",
        confirmDesc: "Your appointment request has been recorded in our system. A clinic representative will call you shortly to confirm.",
        confirmClose: "Close & Back to Site",
        confirmWa: "Confirm via WhatsApp",

        loginTitle: "Clinic Admin Login",
        loginDesc: "Enter your secure credentials to manage appointments, doctor rosters, and view clinic analytics.",
        loginUser: "Username",
        loginPass: "Password",
        loginBtn: "Access Dashboard",
        loginErr: "Invalid username or password. Please try again.",
        adminNavDashboard: "Overview & Analytics",
        adminNavApts: "Appointments List",
        adminNavDocs: "Doctors Roster",
        adminBackSite: "View Website",
        adminLogout: "Log Out",

        adminTotalVisits: "Total Visitors",
        adminPendingApts: "Pending Bookings",
        adminApprovedApts: "Approved Slots",
        adminRejectedApts: "Rejected Slots",
        adminChartTitle: "Appointments by Department",
        adminFormDocTitle: "Add / Edit Doctor Profile",
        adminFormDocName: "Doctor Name",
        adminFormDocQual: "Qualifications (e.g. MD, MS)",
        adminFormDocSpec: "Specialization (e.g. Psychiatrist)",
        adminFormDocExp: "Experience Description",
        adminFormDocHours: "Consultation Hours & Days",
        adminFormDocSave: "Save Specialist Info"
    },
    kn: {
        navHome: "ಮುಖಪುಟ",
        navServices: "ಸೇವೆಗಳು",
        navAbout: "ನಮ್ಮ ಬಗ್ಗೆ",
        navDoctors: "ತಜ್ಞ ವೈದ್ಯರು",
        navBlog: "ಲೇಖನಗಳು",
        navContact: "ಸಂಪರ್ಕಿಸಿ",
        navBook: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕಿಂಗ್",
        navAdmin: "ಅಡ್ಮಿನ್ ಲಾಗಿನ್",

        heroTitle: "<span>ಮನಸ್ಸು, ಮೆದುಳು</span> ಮತ್ತು ಮಕ್ಕಳ ಬೆಳವಣಿಗೆಗೆ ವಿಶೇಷ ಕಾಳಜಿ",
        heroSub: "ಒಂದೇ ಸೂರಿನಡಿ ಬಹು-ವಿಷಯ ತಜ್ಞ ವೈದ್ಯಕೀಯ ಸೇವೆಗಳು. ವಿ-ಕೇರ್ ತುಮಕೂರಿನಲ್ಲೇ ಅತ್ಯುತ್ತಮ ಮನೋವೈದ್ಯಕೀಯ, ಮಕ್ಕಳ ಮೂಳೆ ಚಿಕಿತ್ಸೆ, ಮಾತು ಮತ್ತು ಶ್ರವಣ ಚಿಕಿತ್ಸೆಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.",
        heroBook: "ಬುಕಿಂಗ್ ಮಾಡಿ",
        heroCall: "ಕರೆ ಮಾಡಿ",
        heroBadge1: "ಬಹು-ವಿಷಯ ಸೇವೆಗಳು",
        heroBadge1Sub: "ಎಲ್ಲಾ ಚಿಕಿತ್ಸೆಗಳು ಒಂದೇ ಸೂರಿನಡಿ",
        heroBadge2: "ಪರವಾನಗಿ ಪಡೆದ ತಜ್ಞರು",
        heroBadge2Sub: "ಕಾಳಜಿಯುಕ್ತ ಉತ್ತಮ ಚಿಕಿತ್ಸೆ",
        modeOfflineTitle: "ಕ್ಲಿನಿಕ್‌ನಲ್ಲಿ ಚಿಕಿತ್ಸೆ (ಆಫ್‌ಲೈನ್)",
        modeOfflineDesc: "ಮುಖಾಮುಖಿ ಕ್ಲಿನಿಕಲ್ ಪರೀಕ್ಷೆಗಳು, ದೈಹಿಕ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಸಮಾಲೋಚನೆಗಾಗಿ ತುಮಕೂರಿನ ವಿ-ಕೇರ್ ಕ್ಲಿನಿಕ್‌ಗೆ ಭೇಟಿ ನೀಡಿ.",
        modeOnlineTitle: "ವಿಡಿಯೋ ಸಮಾಲೋಚನೆ (ಆನ್‌ಲೈನ್)",
        modeOnlineDesc: "ನಮ್ಮ ಅನುಭವಿ ಮನೋವೈದ್ಯರು, ಸೈಕಾಲಜಿಸ್ಟ್ ಮತ್ತು ಥೆರಪಿಸ್ಟ್‌ಗಳನ್ನು ಮನೆಯಿಂದಲೇ ಆನ್‌ಲೈನ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ.",
        btnBookOffline: "ಕ್ಲಿನಿಕ್ ಭೇಟಿ ಬುಕಿಂಗ್",
        btnBookOnline: "ವಿಡಿಯೋ ಸಮಾಲೋಚನೆ ಬುಕಿಂಗ್",

        whyTitle: "ಏಕೆ ವಿ-ಕೇರ್ ಆರಿಸಬೇಕು?",
        whySub: "ನಾವು ಉತ್ತಮ ವೈಜ್ಞಾನಿಕ ಪುರಾವೆ ಆಧಾರಿತ ಚಿಕಿತ್ಸೆಗಳನ್ನು ಮತ್ತು ಮಾನಸಿಕ ಹಾಗೂ ದೈಹಿಕ ಪುನರ್ವಸತಿ ನೆರವನ್ನು ನೀಡುತ್ತೇವೆ.",
        whyCard1Title: "ವೈಜ್ಞಾನಿಕ ಚಿಕಿತ್ಸೆ",
        whyCard1Text: "ಎಲ್ಲಾ ಮನೋವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆಗಳು, ಮಕ್ಕಳ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಗಳು ಮತ್ತು ಶ್ರವಣ ಸೇವೆಗಳು ಉತ್ತಮ ಕ್ಲಿನಿಕಲ್ ಮಾನದಂಡಗಳನ್ನು ಹೊಂದಿವೆ.",
        whyCard2Title: "ಸಮಗ್ರ ತಜ್ಞರ ತಂಡ",
        whyCard2Text: "ಮನೋವೈದ್ಯರು, ಮಕ್ಕಳ ಮೂಳೆ ತಜ್ಞರು, ಮಾತು ಚಿಕಿತ್ಸಕರು ಮತ್ತು ಮನೋವಿಜ್ಞಾನಿಗಳು ಒಟ್ಟಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಾರೆ.",
        whyCard3Title: "ಖಾಸಗಿತನ ಮತ್ತು ಸುರಕ್ಷತೆ",
        whyCard3Text: "ನಿಮ್ಮ ಖಾಸಗಿತನ ನಮ್ಮ ಆದ್ಯತೆ. ಮಕ್ಕಳು ಹಾಗೂ ಹಿರಿಯರ ಸಮಾಲೋಚನೆಯಲ್ಲಿ ಕಟ್ಟುನಿಟ್ಟಿನ ನೈತಿಕ ನಿಯಮಗಳನ್ನು ಪಾಲಿಸುತ್ತೇವೆ.",
        whyCard4Title: "ಸ್ಥಳೀಯ ಲಭ್ಯತೆ",
        whyCard4Text: "ತುಮಕೂರಿನ ಸಿದ್ದಗಂಗಾ ಬಡಾವಣೆಯಲ್ಲೇ ಸುಲಭವಾಗಿ ತಲುಪಬಹುದಾದ ಜಾಗದಲ್ಲಿದ್ದು, ಜಾಗತಿಕ ಗುಣಮಟ್ಟದ ಚಿಕಿತ್ಸೆ ನೀಡುತ್ತದೆ.",

        servicesTitle: "ನಮ್ಮ ಸೇವೆಗಳು",
        servicesSub: "ಮಾನಸಿಕ ಸ್ವಾಸ್ಥ್ಯ, ದೈಹಿಕ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಭಾಷಾ ಬೆಳವಣಿಗೆಗಾಗಿ ನಮ್ಮ ತಜ್ಞರ ವಿಭಾಗಗಳನ್ನು ತಿಳಿಯಿರಿ.",
        tabPsych: "ಮನೋವೈದ್ಯಶಾಸ್ತ್ರ ಮತ್ತು ಮನೋವಿಜ್ಞಾನ",
        tabOrtho: "ಮಕ್ಕಳ ಮೂಳೆ ಮತ್ತು ಕೀಲು ಚಿಕಿತ್ಸೆ",
        tabSpeech: "ಮಾತು ಮತ್ತು ಶ್ರವಣ ಚಿಕಿತ್ಸೆ",

        psychDesc: "ಮಾನಸಿಕ, ನಡವಳಿಕೆ ಮತ್ತು ಭಾವನಾತ್ಮಕ ಸವಾಲುಗಳನ್ನು ಎದುರಿಸುತ್ತಿರುವ ಮಕ್ಕಳು ಮತ್ತು ಹಿರಿಯರಿಗೆ ನಾವು ಸಮಗ್ರ ಮೌಲ್ಯಮಾಪನ ಹಾಗೂ ಸಾಕ್ಷ್ಯಾಧಾರಿತ ಚಿಕಿತ್ಸೆಗಳನ್ನು ನೀಡುತ್ತೇವೆ.",
        orthoDesc: "ಮಕ್ಕಳಲ್ಲಿ ಕಂಡುಬರುವ ಹುಟ್ಟಿನ ಮೂಳೆ ದೋಷಗಳು, ಮೂಳೆ ಮುರಿತಗಳು ಮತ್ತು ನರಸ್ನಾಯುಕ ನಡಿಗೆಯ ತೊಂದರೆಗಳಿಗೆ ವಿಶೇಷ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಹಾಗೂ ಚಿಕಿತ್ಸೆ ಒದಗಿಸಲಾಗುತ್ತದೆ.",
        speechDesc: "ಮಕ್ಕಳಲ್ಲಿ ಶ್ರವಣ ಶಕ್ತಿಯ ಪರೀಕ್ಷೆ, ಮಾತು ತಿದ್ದುಪಡಿ, ನುಂಗುವ ತೊಂದರೆಗಳು ಮತ್ತು ಶಾಲೆಗಳಿಗೆ ಪೂರಕವಾದ ವಿಶೇಷ ಥೆರಪಿ ಯೋಜನೆಗಳನ್ನು ರೂಪಿಸುತ್ತೇವೆ.",

        doctorsTitle: "ನಮ್ಮ ತಜ್ಞ ವೈದ್ಯರು",
        doctorsSub: "ನಿಮ್ಮ ಸಮಗ್ರ ಚಿಕಿತ್ಸೆಗಾಗಿ ಸದಾ ಸಿದ್ಧರಿರುವ ನಮ್ಮ ಅನುಭವಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
        bookDoc: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್",
        hoursLabel: "ಸಂಪರ್ಕ ಸಮಯ:",

        bookingTitle: "ಆನ್‌ಲೈನ್ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕಿಂಗ್",
        bookingSub: "ನಿಮಗೆ ಅನುಕೂಲಕರ ಸಮಯವನ್ನು ಆರಿಸಿ. ನಮ್ಮ ಕಚೇರಿಯಿಂದ ಕರೆ ಅಥವಾ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ದೃಢೀಕರಿಸಲಾಗುವುದು.",
        formName: "ರೋಗಿಯ ಹೆಸರು",
        formPhone: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
        formEmail: "ಇಮೇಲ್ ವಿಳಾಸ",
        formDept: "ವಿಭಾಗವನ್ನು ಆರಿಸಿ",
        formDoc: "ವೈದ್ಯರನ್ನು ಆರಿಸಿ",
        formDate: "ಅನುಕೂಲಕರ ದಿನಾಂಕ",
        formTime: "ಅನುಕೂಲಕರ ಸಮಯ",
        formMsg: "ಸಮಸ್ಯೆಯ ವಿವರ (ಐಚ್ಛಿಕ)",
        formSubmit: "ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಿ",
        formMode: "ಸಮಾಲೋಚನೆ ವಿಧಾನ",
        modeInPerson: "ನೇರ ಸಂಪರ್ಕ (ಕ್ಲಿನಿಕ್ ಭೇಟಿ)",
        modeVideo: "ಆನ್‌ಲೈನ್ (ವಿಡಿಯೋ ಸಮಾಲೋಚನೆ)",
        onlineAvailBadge: "💻 ಆನ್‌ಲೈನ್ ಸಮಾಲೋಚನೆ ಲಭ್ಯವಿದೆ",
        selectDeptFirst: "ದಯವಿಟ್ಟು ಮೊದಲು ವಿಭಾಗವನ್ನು ಆರಿಸಿ",
        deptPsych: "ಮನೋವೈದ್ಯಶಾಸ್ತ್ರ ಮತ್ತು ಮನೋವಿಜ್ಞಾನ",
        deptOrtho: "ಮಕ್ಕಳ ಮೂಳೆ ಮತ್ತು ಕೀಲು ಚಿಕಿತ್ಸೆ",
        deptSpeech: "ಮಾತು ಮತ್ತು ಶ್ರವಣ ಚಿಕಿತ್ಸೆ",

        testTitle: "ರೋಗಿಗಳ ಅಭಿಪ್ರಾಯಗಳು",
        testSub: "ನಮ್ಮ ಚಿಕಿತ್ಸೆಯಿಂದ ಗುಣಮುಖರಾದ ಮತ್ತು ಸಮಾಧಾನ ಹೊಂದಿದ ಕುಟುಂಬಗಳ ಅನಿಸಿಕೆಗಳು.",

        galleryTitle: "ಕ್ಲಿನಿಕ್ ಗ್ಯಾಲರಿ",
        gallerySub: "ವಿ-ಕೇರ್ ಕ್ಲಿನಿಕ್‌ನ ಸುಸಜ್ಜಿತ ಕೊಠಡಿಗಳು, ಮಕ್ಕಳ ಸ್ನೇಹಿ ಥೆರಪಿ ವಲಯಗಳು ಮತ್ತು ಕಾರ್ಯಕ್ರಮಗಳ ನೋಟ.",
        gal1: "ಆಪ್ತಸಮಾಲೋಚನಾ ಕೊಠಡಿ",
        gal2: "ಮಕ್ಕಳ ಥೆರಪಿ ವಲಯ",
        gal3: "ಶ್ರವಣ ಪರೀಕ್ಷಾ ಕೊಠಡಿ",
        gal4: "ಮಾನಸಿಕ ಆರೋಗ್ಯ ಜಾಗೃತಿ ಕಾರ್ಯಕ್ರಮ",

        blogTitleSec: "ಆರೋಗ್ಯ ಜಾಗೃತಿ ಲೇಖನಗಳು",
        blogSubSec: "ಮಾನಸಿಕ ಆರೋಗ್ಯ ಮತ್ತು ಮಕ್ಕಳ ಬೆಳವಣಿಗೆಯ ಸುಧಾರಣೆಗಾಗಿ ನಮ್ಮ ತಜ್ಞರು ಬರೆದ ಉಪಯುಕ್ತ ಲೇಖನಗಳು.",
        readMore: "ಪೂರ್ಣ ಲೇಖನ ಓದಿ",

        contactTitleSec: "ಸಂಪರ್ಕ ಮತ್ತು ವಿಳಾಸ",
        contactSubSec: "ತುಮಕೂರಿನ ಕ್ಲಿನಿಕ್‌ಗೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ ತಕ್ಷಣದ ನೆರವಿಗಾಗಿ ದೂರವಾಣಿ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ.",
        addressTitle: "ಕ್ಲಿನಿಕ್ ವಿಳಾಸ",
        addressText: "೩ನೇ ಕ್ರಾಸ್, ಜೈನ ಭವನ ರಸ್ತೆ, ಸಿದ್ದಗಂಗಾ ಬಡಾವಣೆ, ತುಮಕೂರು, ಕರ್ನಾಟಕ - ೫೭೨೧೦೨",
        phoneTitle: "ದೂರವಾಣಿ ಸಂಖ್ಯೆಗಳು",
        phoneText: "9980999068",
        timingTitle: "ಕೆಲಸದ ಸಮಯ",
        timingText: "ಸೋಮ - ಶನಿ: ಬೆಳಿಗ್ಗೆ ೯:೩೦ ರಿಂದ ರಾತ್ರಿ ೮:೩೦ ರವರೆಗೆ (ಭಾನುವಾರ ರಜೆ)",

        footerAbout: "ವಿ-ಕೇರ್ ಮೈಂಡ್ ಮತ್ತು ಬ್ರೈನ್ ಕ್ಲಿನಿಕ್ ತುಮಕೂರಿನ ಪ್ರಮುಖ ಬಹು-ವಿಷಯ ತಜ್ಞರ ಕೇಂದ್ರವಾಗಿದ್ದು, ಮನೋವೈದ್ಯಶಾಸ್ತ್ರ, ಮಕ್ಕಳ ಮೂಳೆ ಚಿಕಿತ್ಸೆ, ಮಾತು ಮತ್ತು ಶ್ರವಣ ಪುನರ್ವಸತಿ ಸೇವೆಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.",
        footerLinks: "ತ್ವರಿತ ಕೊಂಡಿಗಳು",
        footerServices: "ವಿಶೇಷ ವಿಭಾಗಗಳು",
        footerRights: "© ೨೦೨೬ ವಿ-ಕೇರ್ ಮೈಂಡ್ ಮತ್ತು ಬ್ರೈನ್ ಕ್ಲಿನಿಕ್. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
        footerAdmin: "ಅಧಿಕೃತ ಅಡ್ಮಿನ್ ಪ್ರವೇಶ",

        chatGreet: "ನಮಸ್ಕಾರ! ನಾನು ವಿ-ಕೇರ್ ವರ್ಚುವಲ್ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
        chatAskApt: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕಿಂಗ್",
        chatAskDoc: "ನಮ್ಮ ವೈದ್ಯರು",
        chatAskLoc: "ವಿಳಾಸ ಮತ್ತು ಸಮಯ",
        chatInputPlace: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...",
        chatBotStatus: "ಆನ್‌ಲೈನ್ ಸಹಾಯ",

        confirmTitle: "ಬುಕಿಂಗ್ ಯಶಸ್ವಿಯಾಗಿದೆ!",
        confirmDesc: "ನಿಮ್ಮ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ವಿನಂತಿಯನ್ನು ನೋಂದಾಯಿಸಲಾಗಿದೆ. ನಮ್ಮ ಕಚೇರಿಯಿಂದ ಕರೆ ಮಾಡಿ ಶೀಘ್ರದಲ್ಲೇ ದೃಢೀಕರಿಸಲಾಗುವುದು.",
        confirmClose: "ಮುಚ್ಚಿ ಮತ್ತು ಮುಂದುವರಿಯಿರಿ",
        confirmWa: "ವಾಟ್ಸಾಪ್ ಮೂಲಕ ದೃಢೀಕರಿಸಿ",

        loginTitle: "ಅಡ್ಮಿನ್ ಲಾಗಿನ್",
        loginDesc: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಮತ್ತು ವೈದ್ಯರ ಪಟ್ಟಿಯನ್ನು ನಿರ್ವಹಿಸಲು ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ದಾಖಲಿಸಿ.",
        loginUser: "ಬಳಕೆದಾರ ಹೆಸರು",
        loginPass: "ಪಾಸ್‌ವರ್ಡ್",
        loginBtn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶಿಸಿ",
        loginErr: "ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.",
        adminNavDashboard: "ಒಟ್ಟಾರೆ ನೋಟ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ",
        adminNavApts: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಪಟ್ಟಿ",
        adminNavDocs: "ವೈದ್ಯರ ಮಾಹಿತಿ",
        adminBackSite: "ವೆಬ್‌ಸೈಟ್‌ಗೆ ಹಿಂತಿರುಗಿ",
        adminLogout: "ನಿರ್ಗಮಿಸಿ",

        adminTotalVisits: "ಒಟ್ಟು ಭೇಟಿ ನೀಡಿದವರು",
        adminPendingApts: "ಬಾಕಿ ಇರುವ ಬುಕಿಂಗ್",
        adminApprovedApts: "ಖಚಿತಪಡಿಸಿದ ಬುಕಿಂಗ್",
        adminRejectedApts: "ತಿರಸ್ಕರಿಸಿದ ಬುಕಿಂಗ್",
        adminChartTitle: "ವಿಭಾಗವಾರು ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ವಿಶ್ಲೇಷಣೆ",
        adminFormDocTitle: "ವೈದ್ಯರ ಪ್ರೊಫೈಲ್ ಸೇರಿಸಿ / ಬದಲಾಯಿಸಿ",
        adminFormDocName: "ವೈದ್ಯರ ಹೆಸರು",
        adminFormDocQual: "ವಿದ್ಯಾರ್ಹತೆ (ಉದಾ. MD, MS)",
        adminFormDocSpec: "ವಿಶೇಷ ಪರಿಣತಿ",
        adminFormDocExp: "ಅನುಭವದ ವಿವರ",
        adminFormDocHours: "ಸಂಪರ್ಕ ಸಮಯ ಮತ್ತು ದಿನಗಳು",
        adminFormDocSave: "ಮಾಹಿತಿ ಉಳಿಸಿ"
    }
};

// 3. PAGE INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Set up elements
    const langSelect = document.getElementById('lang-select');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const servicesTabBtns = document.querySelectorAll('.tab-btn');
    
    // Setup Translation
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }

    // Toggle Mobile Navigation Menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // Navigation Active Link Highlighting
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const sections = document.querySelectorAll('section, header');
        const scrollPosition = window.scrollY + 120;

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = sec.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Services Tabs Switching
    servicesTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            servicesTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const targetId = btn.getAttribute('data-tab');
            const contents = document.querySelectorAll('.services-content');
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('id') === targetId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Render Dynamic Content
    renderDoctorsList();
    renderTestimonials();
    renderBlogs();

    // Hook Form Cascade select
    setupBookingFormCascade();

    // Chatbot Initialization
    initChatBot();

    // Set Saved or Default Language
    const savedLang = localStorage.getItem('vkare_lang') || 'en';
    setLanguage(savedLang);

    // Setup Admin Panel
    setupAdminPanel();
});

// Set current language and re-render texts
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('vkare_lang', lang);
    const dict = TRANSLATIONS[lang];
    if (!dict) return;

    // Find all elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (dict[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = dict[key];
            } else {
                el.innerHTML = dict[key];
            }
        }
    });

    // Toggle dropdown UI choice
    const langSelect = document.getElementById('lang-select');
    if (langSelect && langSelect.value !== lang) {
        langSelect.value = lang;
    }

    // Re-render components that rely on language keys dynamically
    renderDoctorsList();
    renderTestimonials();
    renderBlogs();
    setupBookingFormCascade();
}

// 4. RENDERING FUNCTIONS
let currentDocCategoryFilter = 'all';

function filterDoctorsByCategory(dept, evt) {
    currentDocCategoryFilter = dept;
    const btns = document.querySelectorAll('.doc-filter-btn');
    btns.forEach(b => b.classList.remove('active'));
    if (evt && evt.target) evt.target.classList.add('active');
    renderDoctorsList();
}

function renderDoctorsList() {
    let doctors = getDoctors();
    const docGrid = document.getElementById('doctors-grid');
    if (!docGrid) return;

    if (currentDocCategoryFilter !== 'all') {
        doctors = doctors.filter(d => {
            if (currentDocCategoryFilter === 'psychology') {
                return d.qual.toLowerCase().includes('psychology') || d.spec.toLowerCase().includes('psychologist');
            }
            return d.dept === currentDocCategoryFilter;
        });
    }

    docGrid.innerHTML = '';
    if (doctors.length === 0) {
        docGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; background:#fff; border-radius:12px; border:1px solid #e2e8f0; color:#64748b;"><i class="fa-solid fa-user-slash" style="font-size:2.5rem; margin-bottom:1rem; color:#cbd5e1;"></i><p>No specialists found under this category.</p></div>`;
        return;
    }

    doctors.forEach(doc => {
        const name = currentLanguage === 'en' ? doc.name : doc.nameKn;
        const spec = currentLanguage === 'en' ? doc.spec : doc.specKn;
        const exp = currentLanguage === 'en' ? doc.exp : doc.expKn;
        const hours = currentLanguage === 'en' ? doc.hours : doc.hoursKn;

        const onlineBadgeHtml = doc.onlineAvail 
            ? `<div class="doc-online-badge"><i class="fa-solid fa-video"></i> ${TRANSLATIONS[currentLanguage].onlineAvailBadge}</div>` 
            : `<div class="doc-online-badge in-person"><i class="fa-solid fa-hospital-user"></i> In-Clinic Only</div>`;

        const card = document.createElement('div');
        card.className = 'doctor-card';
        card.style.cssText = `
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        `;

        const photoPath = doc.photoUrl || doc.photo_url || (doc.id === 'doc1' ? 'images/doc_vinay.jpg' : (doc.id === 'doc2' ? 'images/doc_anitha.jpg' : (doc.id === 'doc3' ? 'images/doc_kiran.jpg' : (doc.id === 'doc4' ? 'images/doc_shwetha.jpg' : null))));
        
        const photoHtml = photoPath
            ? `<img src="${photoPath}" alt="${name}" style="width:100%; height:100%; object-fit:cover; object-position:top center; position:absolute; top:0; left:0; z-index:1;">`
            : `<span style="font-size: 3.5rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">${doc.avatar || '👨‍⚕️'}</span>`;

        card.innerHTML = `
            <div>
                <div class="doc-img-container" style="height:190px; background:linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden;">
                    ${photoHtml}
                    <span style="position:absolute; top:12px; right:12px; background:rgba(255,255,255,0.92); padding:4px 10px; border-radius:20px; font-size:0.75rem; font-weight:700; color:#1e40af; border:1px solid #bfdbfe; z-index:2; backdrop-filter:blur(4px);">
                        ${doc.licenseNo || 'Verified License'}
                    </span>
                </div>
                <div class="doc-info" style="padding: 1.5rem;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                        <h3 class="doc-name" style="font-size:1.25rem; font-weight:700; color:#0f172a; margin:0;">${name}</h3>
                        <span style="background:#fef3c7; color:#92400e; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:12px; white-space:nowrap;">
                            ⭐ ${doc.rating || 4.9} (${doc.reviewsCount || 100}+)
                        </span>
                    </div>
                    <span class="doc-qual" style="color:#0284c7; font-size:0.8rem; font-weight:700; display:block; margin-bottom:0.4rem;">${doc.qual}</span>
                    <p class="doc-spec" style="font-size:0.9rem; color:#475569; margin-bottom:0.6rem; font-weight:500;">${spec}</p>
                    <p class="doc-exp" style="font-size:0.8rem; color:#64748b; margin-bottom:0.8rem;"><i class="fa-solid fa-briefcase"></i> ${exp}</p>
                    ${onlineBadgeHtml}
                    <div class="doc-hours" style="font-size:0.78rem; color:#64748b; margin-top:0.8rem;">
                        <i class="far fa-clock"></i> ${hours}
                    </div>
                    <div style="margin-top:0.8rem; font-size:0.9rem; color:#0f172a; font-weight:700;">
                        Fee: <span style="color:#16a34a;">₹${doc.fee || 500}</span> / Session
                    </div>
                </div>
            </div>
            <div style="padding: 0 1.5rem 1.5rem 1.5rem; display:grid; grid-template-columns: 1fr 1fr; gap:0.6rem;">
                <button class="btn btn-secondary" onclick="viewDoctorProfile('${doc.id}')" style="font-size:0.8rem; padding:0.6rem 0.4rem; white-space:nowrap;">
                    <i class="fa-solid fa-circle-info"></i> Full Profile
                </button>
                <button class="btn btn-primary" onclick="scrollToBooking('${doc.dept}', '${doc.id}')" style="font-size:0.8rem; padding:0.6rem 0.4rem; white-space:nowrap;">
                    <i class="fa-solid fa-calendar-check"></i> Book Slot
                </button>
            </div>
        `;
        docGrid.appendChild(card);
    });
}

function renderTestimonials() {
    const testimonials = getTestimonials();
    const testGrid = document.getElementById('testimonials-grid');
    if (!testGrid) return;

    testGrid.innerHTML = '';
    testimonials.forEach(test => {
        const text = currentLanguage === 'en' ? test.text : test.textKn;
        const stars = '★'.repeat(test.rating) + '☆'.repeat(5 - test.rating);

        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <div class="stars">${stars}</div>
            <p class="test-text">"${text}"</p>
            <div class="test-author">
                <h4>${test.name}</h4>
                <p>Verified Patient</p>
            </div>
        `;
        testGrid.appendChild(card);
    });
}

function renderBlogs() {
    const blogs = getBlogs();
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;

    blogGrid.innerHTML = '';
    blogs.forEach(blog => {
        const tag = currentLanguage === 'en' ? blog.tag : blog.tagKn;
        const title = currentLanguage === 'en' ? blog.title : blog.titleKn;
        const excerpt = currentLanguage === 'en' ? blog.excerpt : blog.excerptKn;

        const card = document.createElement('div');
        card.className = 'blog-card';
        card.innerHTML = `
            <div class="blog-img-container">
                <span>${blog.icon}</span>
            </div>
            <div class="blog-body">
                <span class="blog-tag">${tag}</span>
                <h3 class="blog-title">${title}</h3>
                <p class="blog-excerpt">${excerpt}</p>
                <div class="blog-meta">
                    <span>${blog.date}</span>
                    <a href="#blog" class="read-more-link" onclick="alert('${title}')" data-translate="readMore">${TRANSLATIONS[currentLanguage].readMore} →</a>
                </div>
            </div>
        `;
        blogGrid.appendChild(card);
    });
}

// 5. APPOINTMENT BOOKING WORKFLOW
let selectedDoctorForBooking = null;

function setupBookingFormCascade() {
    const deptSelect = document.getElementById('booking-dept');
    const docSelect = document.getElementById('booking-doctor');
    if (!deptSelect || !docSelect) return;

    const selectedDocId = docSelect.value;
    docSelect.innerHTML = `<option value="" disabled selected>${TRANSLATIONS[currentLanguage].formDoc}</option>`;

    const selectedDept = deptSelect.value;
    if (!selectedDept) {
        docSelect.disabled = true;
        return;
    }

    docSelect.disabled = false;
    const doctors = getDoctors().filter(doc => doc.dept === selectedDept);
    doctors.forEach(doc => {
        const docName = currentLanguage === 'en' ? doc.name : doc.nameKn;
        const opt = document.createElement('option');
        opt.value = doc.id;
        opt.textContent = `${docName} (${doc.qual})`;
        if (doc.id === selectedDocId) {
            opt.selected = true;
        }
        docSelect.appendChild(opt);
    });
}

// Event handler for department change in form
window.onDeptChange = function() {
    setupBookingFormCascade();
};

// Scroll to booking section and preselect department/doctor
window.scrollToBooking = function(dept, docId) {
    const deptSelect = document.getElementById('booking-dept');
    const bookingSec = document.getElementById('booking');

    if (docId) selectedDoctorForBooking = docId;

    if (deptSelect && bookingSec) {
        deptSelect.value = dept;
        setupBookingFormCascade();
        bookingSec.scrollIntoView({ behavior: 'smooth' });
    }
};

// Scroll to booking section and preselect consultation mode (In-Person or Video)
window.scrollToBookingWithMode = function(mode) {
    const modeSelect = document.getElementById('booking-mode');
    const bookingSec = document.getElementById('booking');

    if (modeSelect && bookingSec) {
        modeSelect.value = mode;
        bookingSec.scrollIntoView({ behavior: 'smooth' });
    }
};

// Form submission handler
window.submitAppointmentForm = function(event) {
    event.preventDefault();
    const nameInput = document.getElementById('booking-name');
    const phoneInput = document.getElementById('booking-phone');
    const emailInput = document.getElementById('booking-email');
    const deptSelect = document.getElementById('booking-dept');
    const dateInput = document.getElementById('booking-date');
    const timeSelect = document.getElementById('booking-time');
    const modeSelect = document.getElementById('booking-mode');
    const msgInput = document.getElementById('booking-msg');

    if (!nameInput.value || !phoneInput.value || !deptSelect.value || !dateInput.value || !timeSelect.value) {
        alert("Please fill all mandatory fields.");
        return;
    }

    let targetDocId = selectedDoctorForBooking;
    if (!targetDocId) {
        const deptVal = deptSelect.value;
        if (deptVal === 'orthopedics') targetDocId = 'doc3';
        else if (deptVal === 'speech') targetDocId = 'doc4';
        else targetDocId = 'doc1';
    }

    const doctors = getDoctors();
    const selectedDoc = doctors.find(d => d.id === targetDocId) || doctors[0];
    const docName = selectedDoc ? selectedDoc.name : "V-KARE Specialist";

    const newApt = {
        id: "apt-" + Math.floor(Math.random() * 900000 + 100000),
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        dept: deptSelect.value,
        docId: targetDocId,
        docName: docName,
        date: dateInput.value,
        time: timeSelect.value,
        mode: modeSelect ? modeSelect.value : "in-person",
        msg: msgInput.value,
        status: "pending",
        timestamp: new Date().toISOString()
    };

    // Save to localStorage
    const apts = getAppointments();
    apts.push(newApt);
    localStorage.setItem('vkare_appointments', JSON.stringify(apts));

    // Show Confirmation Modal
    showBookingConfirmationModal(newApt);

    // Reset Form
    event.target.reset();
    setupBookingFormCascade();
};

let activeBookingForWhatsApp = null;

function showBookingConfirmationModal(apt) {
    activeBookingForWhatsApp = apt;
    const modal = document.getElementById('booking-modal-overlay');
    if (modal) {
        modal.classList.add('active');
    }
}

window.closeBookingModal = function() {
    const modal = document.getElementById('booking-modal-overlay');
    if (modal) {
        modal.classList.remove('active');
    }
    activeBookingForWhatsApp = null;
};

window.sendWhatsAppConfirmation = function() {
    if (!activeBookingForWhatsApp) return;
    const apt = activeBookingForWhatsApp;
    
    // Pre-filled WhatsApp details
    const clinicNumber = "919980999068";
    const deptLabel = apt.dept === 'psychiatry' ? 'Psychiatry & Psychology' : (apt.dept === 'orthopedics' ? 'Pediatric Orthopedics' : 'Speech & Audiology');
    const modeLabel = apt.mode === 'video' ? 'Online Video Consultation' : 'In-Person Clinic Visit';
    
    const text = `Hi V-KARE Clinic, I would like to confirm my appointment:
- *Patient Name:* ${apt.name}
- *Phone:* ${apt.phone}
- *Department:* ${deptLabel}
- *Doctor:* ${apt.docName}
- *Date:* ${apt.date}
- *Time:* ${apt.time}
- *Mode:* ${modeLabel}
- *Details:* ${apt.msg || 'None'}`;

    const url = `https://api.whatsapp.com/send?phone=${clinicNumber}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    closeBookingModal();
};

// 6. AI CHATBOT WIDGET
function initChatBot() {
    const toggle = document.getElementById('chat-toggle');
    const chatBox = document.getElementById('chat-box');
    const closeBtn = document.getElementById('chat-close');
    const sendBtn = document.getElementById('chat-send');
    const inputField = document.getElementById('chat-input');
    const msgsContainer = document.getElementById('chat-messages');

    if (!toggle || !chatBox) return;

    toggle.addEventListener('click', () => {
        chatBox.classList.toggle('open');
        // Clear unread badge
        const badge = toggle.querySelector('.unread-badge');
        if (badge) badge.style.display = 'none';
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            chatBox.classList.remove('open');
        });
    }

    if (sendBtn && inputField) {
        sendBtn.addEventListener('click', handleUserChatMessage);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserChatMessage();
        });
    }

    // Suggestions buttons
    window.askChatbot = function(topic) {
        let questionText = "";
        if (topic === 'appointment') {
            questionText = currentLanguage === 'en' ? "How can I book an appointment?" : "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕಿಂಗ್ ಮಾಡುವುದು ಹೇಗೆ?";
        } else if (topic === 'doctors') {
            questionText = currentLanguage === 'en' ? "Who are the specialists at V-KARE?" : "ವಿ-ಕೇರ್‌ನಲ್ಲಿರುವ ತಜ್ಞ ವೈದ್ಯರು ಯಾರು?";
        } else if (topic === 'location') {
            questionText = currentLanguage === 'en' ? "Where is the clinic located and what are the timings?" : "ಕ್ಲಿನಿಕ್ ಎಲ್ಲಿದೆ ಮತ್ತು ಕೆಲಸದ ಸಮಯ ತಿಳಿಸಿ?";
        }
        
        if (inputField) {
            inputField.value = questionText;
            handleUserChatMessage();
        }
    };
}

function handleUserChatMessage() {
    const inputField = document.getElementById('chat-input');
    const msgsContainer = document.getElementById('chat-messages');
    if (!inputField || !msgsContainer || !inputField.value.trim()) return;

    const query = inputField.value.trim();
    
    // Append user message
    appendChatMessage('user', query);
    inputField.value = '';

    // Simulate thinking and answer
    setTimeout(() => {
        const reply = generateBotReply(query);
        appendChatMessage('bot', reply);
    }, 600);
}

function appendChatMessage(sender, text) {
    const msgsContainer = document.getElementById('chat-messages');
    if (!msgsContainer) return;

    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    msg.innerHTML = text.replace(/\n/g, '<br>');
    msgsContainer.appendChild(msg);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
}

function generateBotReply(query) {
    const q = query.toLowerCase();
    
    // Check Language
    const isEn = currentLanguage === 'en';

    // Keywords matching
    if (q.includes('appointment') || q.includes('book') || q.includes('schedule') || q.includes('ಅಪಾಯಿಂಟ್ಮೆಂಟ್') || q.includes('ಬುಕ್')) {
        return isEn 
            ? "You can easily schedule a consultation! Click 'Book Appointment' on the navigation bar, fill out our secure booking form, or call us directly at 9980999068."
            : "ನೀವು ಸುಲಭವಾಗಿ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಬಹುದು! ಮೇಲಿರುವ 'ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕಿಂಗ್' ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಫಾರ್ಮ್ ಭರ್ತಿ ಮಾಡಿ ಅಥವಾ ನೇರವಾಗಿ 9980999068 ಗೆ ಕರೆ ಮಾಡಿ.";
    }
    
    if (q.includes('doctor') || q.includes('specialist') || q.includes('psychiatrist') || q.includes('ortho') || q.includes('therapist') || q.includes('ವೈದ್ಯರು') || q.includes('ಡಾಕ್ಟರ್') || q.includes('ತಜ್ಞ')) {
        const docList = getDoctors();
        let reply = isEn 
            ? "Here are our specialists at V-KARE:\n"
            : "ವಿ-ಕೇರ್ ಕ್ಲಿನಿಕ್‌ನ ತಜ್ಞ ವೈದ್ಯರು:\n";
            
        docList.forEach(d => {
            const name = isEn ? d.name : d.nameKn;
            const spec = isEn ? d.spec : d.specKn;
            reply += `• *${name}* (${d.qual}) - ${spec}\n`;
        });
        return reply;
    }

    if (q.includes('address') || q.includes('where') || q.includes('location') || q.includes('map') || q.includes('ವಿಳಾಸ') || q.includes('ಎಲ್ಲಿದೆ') || q.includes('ಸ್ಥಳ')) {
        return isEn
            ? "V-KARE Mind & Brain Clinic is located at:\n3rd Cross, Jain Bhavana Road, Siddaganga Extension, Tumkur - 572102.\nYou can find our exact location on the interactive Google Map at the bottom of the page."
            : "ವಿ-ಕೇರ್ ಮೈಂಡ್ ಮತ್ತು ಬ್ರೈನ್ ಕ್ಲಿನಿಕ್ ವಿಳಾಸ:\n೩ನೇ ಕ್ರಾಸ್, ಜೈನ ಭವನ ರಸ್ತೆ, ಸಿದ್ದಗಂಗಾ ಬಡಾವಣೆ, ತುಮಕೂರು - ೫೭೨೧೦೨.\nವೆಬ್‌ಸೈಟ್‌ ಕೆಳಭಾಗದಲ್ಲಿರುವ ಗೂಗಲ್ ಮ್ಯಾಪ್ ಮೂಲಕ ನಮ್ಮ ಕ್ಲಿನಿಕ್ ತಲುಪಬಹುದು.";
    }

    if (q.includes('timing') || q.includes('hours') || q.includes('time') || q.includes('open') || q.includes('ಸಮಯ') || q.includes('ಯಾವಾಗ')) {
        return isEn
            ? "Our clinic is open Monday through Saturday from 9:30 AM to 8:30 PM. We are closed on Sundays."
            : "ನಮ್ಮ ಕ್ಲಿನಿಕ್ ಸೋಮವಾರದಿಂದ ಶನಿವಾರದವರೆಗೆ ಬೆಳಿಗ್ಗೆ ೯:೩೦ ರಿಂದ ರಾತ್ರಿ ೮:೩೦ ರವರೆಗೆ ತೆರೆದಿರುತ್ತದೆ. ಭಾನುವಾರ ರಜೆ ಇರುತ್ತದೆ.";
    }

    if (q.includes('depress') || q.includes('anxiety') || q.includes('stress') || q.includes('mental') || q.includes('psychology') || q.includes('ಮನಸ್ಸು') || q.includes('ಆತಂಕ') || q.includes('ಬೇಸರ')) {
        return isEn
            ? "V-KARE offers expert psychiatric diagnostics, counseling, and CBT for anxiety, depression, sleep disorders, and ADHD led by Dr. Vinay Kumar and Dr. Anitha. Let us know if you'd like to book a therapy session."
            : "ವಿ-ಕೇರ್‌ನಲ್ಲಿ ಡಾ. ವಿನಯ್ ಕುಮಾರ್ ಮತ್ತು ಡಾ. ಅನಿತಾ ಅವರ ನೇತೃತ್ವದಲ್ಲಿ ಖಿನ್ನತೆ, ಆತಂಕ, ನಿದ್ರಾಹೀನತೆ ಮತ್ತು ಎಡಿಎಚ್‌ಡಿ ಸಮಸ್ಯೆಗಳಿಗೆ ಅತ್ಯುತ್ತಮ ಕೌನ್ಸೆಲಿಂಗ್ ಮತ್ತು ಚಿಕಿತ್ಸೆ ನೀಡಲಾಗುತ್ತದೆ. ನೀವು ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಪಡೆಯಲು ಬಯಸುವಿರಾ?";
    }

    if (q.includes('speech') || q.includes('hearing') || q.includes('swallow') || q.includes('deaf') || q.includes('ಮಾತು') || q.includes('ಕಿವಿ') || q.includes('ಕೇಳಿಸ')) {
        return isEn
            ? "Our Speech & Audiology department is led by Mrs. Shwetha G. We offer speech therapy, swallowing therapy, hearing evaluations, and hearing aid fittings. We also run school IEP support programs."
            : "ನಮ್ಮ ಮಾತು ಮತ್ತು ಶ್ರವಣ ವಿಭಾಗವು ಶ್ರೀಮತಿ ಶ್ವೇತಾ ಜಿ. ಅವರ ನೇತೃತ್ವದಲ್ಲಿ ನಡೆಯುತ್ತದೆ. ಇಲ್ಲಿ ಸ್ಪೀಚ್ ಥೆರಪಿ, ಶ್ರವಣ ಪರೀಕ್ಷೆ ಮತ್ತು ಹಿಯರಿಂಗ್ ಏಡ್ ಸೌಲಭ್ಯಗಳಿವೆ.";
    }

    if (q.includes('child') || q.includes('ortho') || q.includes('bone') || q.includes('club foot') || q.includes('palsy') || q.includes('ಮಕ್ಕಳ') || q.includes('ಮೂಳೆ') || q.includes('ನಡಿಗೆ')) {
        return isEn
            ? "Dr. Kiran R. S. specializes in Pediatric Orthopedics, offering treatments for Club Foot, Cerebral Palsy, limb deformities, and child bone trauma."
            : "ಡಾ. ಕಿರಣ್ ಆರ್. ಎಸ್. ಅವರು ಮಕ್ಕಳ ಮೂಳೆ ಚಿಕಿತ್ಸೆಯಲ್ಲಿ ಪರಿಣತಿ ಹೊಂದಿದ್ದು, ಮಕ್ಕಳ ಕ್ಲಬ್ ಫೂಟ್, ಸೆರೆಬ್ರಲ್ ಪಾಲ್ಸಿ ಮತ್ತು ಮೂಳೆ ದೋಷಗಳಿಗೆ ಸೂಕ್ತ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಮತ್ತು ಪರಿಹಾರ ನೀಡುತ್ತಾರೆ.";
    }

    return isEn
        ? "Thank you for contacting V-KARE. Feel free to ask about our doctors, clinic location, timings, or psychiatric/pediatric/speech therapies!"
        : "ವಿ-ಕೇರ್ ಸಂಪರ್ಕಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ನಮ್ಮ ವೈದ್ಯರು, ವಿಳಾಸ, ಕೆಲಸದ ಸಮಯ ಅಥವಾ ವಿವಿಧ ಚಿಕಿತ್ಸಾ ವಿಧಾನಗಳ ಬಗ್ಗೆ ಕೇಳಿ ತಿಳಿದುಕೊಳ್ಳಿ!";
}

// 7. ADMIN PANEL CODE
function setupAdminPanel() {
    const adminLink = document.getElementById('admin-link');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const closeLogin = document.getElementById('close-login');
    const loginForm = document.getElementById('admin-login-form') || document.getElementById('login-form');
    
    const backToSiteBtn = document.getElementById('admin-back-site');
    const logoutBtn = document.getElementById('admin-logout');

    const navBtns = document.querySelectorAll('.admin-nav-btn');
    const tabPanels = document.querySelectorAll('.admin-tab-panel');

    // Trigger Login Modal
    if (adminLink) {
        adminLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check if already logged in
            if (sessionStorage.getItem('vkare_admin_logged') === 'true') {
                enterAdminMode();
            } else {
                const modal = document.getElementById('admin-login-modal');
                if (modal) {
                    modal.style.display = 'flex';
                    modal.classList.add('active');
                } else if (typeof openModal === 'function') {
                    openModal('admin-login-modal');
                }
            }
        });
    }

    if (closeLogin) {
        closeLogin.addEventListener('click', () => {
            const modal = document.getElementById('admin-login-modal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('active');
            }
        });
    }

    // Submit Credentials
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('login-username');
            const passwordInput = document.getElementById('login-password');
            const errorMsg = document.getElementById('login-error');

            const uVal = usernameInput ? usernameInput.value.trim() : '';
            const pVal = passwordInput ? passwordInput.value.trim() : '';

            // Secure admin login verification
            if ((uVal === 'admin' || uVal === 'admin@vkare.com') && (pVal === 'vkareadmin123' || pVal === 'admin123')) {
                sessionStorage.setItem('vkare_admin_logged', 'true');
                const modal = document.getElementById('admin-login-modal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.classList.remove('active');
                }
                if (errorMsg) errorMsg.style.display = 'none';
                enterAdminMode();
            } else if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.textContent = 'Invalid Admin Username or Password';
            }
        });
    }

    // Back to Website
    if (backToSiteBtn) {
        backToSiteBtn.addEventListener('click', () => {
            sessionStorage.removeItem('vkare_admin_logged');
            document.body.classList.remove('admin-mode');
            const mainSite = document.getElementById('main-site');
            const adminSec = document.getElementById('admin-section');
            if (mainSite) mainSite.style.display = 'block';
            if (adminSec) adminSec.style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('vkare_admin_logged');
            document.body.classList.remove('admin-mode');
            const mainSite = document.getElementById('main-site');
            const adminSec = document.getElementById('admin-section');
            if (mainSite) mainSite.style.display = 'block';
            if (adminSec) adminSec.style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Dashboard tabs switcher
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetTab = btn.getAttribute('data-admin-tab');
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.getAttribute('id') === targetTab) {
                    panel.classList.add('active');
                }
            });

            // Re-render specifically if it's the doctors or overview tab
            if (targetTab === 'adm-overview') {
                renderAdminStats();
            } else if (targetTab === 'adm-docs') {
                renderAdminDoctorsTable();
            } else if (targetTab === 'adm-apts') {
                renderAdminAppointmentsTable();
            }
        });
    });

    // Handle Add/Edit Doctor form submit
    const docForm = document.getElementById('admin-doc-form');
    if (docForm) {
        docForm.addEventListener('submit', handleDocSubmit);
    }
}

function enterAdminMode() {
    document.body.classList.add('admin-mode');
    
    const mainSite = document.getElementById('main-site');
    const adminSec = document.getElementById('admin-section');
    const patDash = document.getElementById('patient-dashboard');
    const docDash = document.getElementById('doctor-dashboard');

    if (mainSite) mainSite.style.display = 'none';
    if (patDash) patDash.style.display = 'none';
    if (docDash) docDash.style.display = 'none';
    if (adminSec) adminSec.style.display = 'block';
    
    // Switch active admin panel to Overview
    const navBtns = document.querySelectorAll('.admin-nav-btn');
    const tabPanels = document.querySelectorAll('.admin-tab-panel');
    
    navBtns.forEach(b => b.classList.remove('active'));
    if (navBtns[0]) navBtns[0].classList.add('active');
    
    tabPanels.forEach(p => p.classList.remove('active'));
    if (tabPanels[0]) tabPanels[0].classList.add('active');

    renderAdminStats();
    renderAdminAppointmentsTable();
    renderAdminDoctorsTable();
}

function renderAdminStats() {
    const apts = getAppointments();
    const visitors = localStorage.getItem('vkare_visitors') || 124;

    const totalApts = apts.length;
    const pending = apts.filter(a => a.status === 'pending').length;
    const approved = apts.filter(a => a.status === 'approved').length;
    const rejected = apts.filter(a => a.status === 'rejected').length;

    // Set stats text
    document.getElementById('stat-visitors').textContent = visitors;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-approved').textContent = approved;
    document.getElementById('stat-rejected').textContent = rejected;

    // Render department distribution SVG graph
    const psychCount = apts.filter(a => a.dept === 'psychiatry').length;
    const orthoCount = apts.filter(a => a.dept === 'orthopedics').length;
    const speechCount = apts.filter(a => a.dept === 'speech').length;

    const maxCount = Math.max(psychCount, orthoCount, speechCount, 1);
    
    // Calculate heights for bar chart
    const psychH = (psychCount / maxCount) * 150;
    const orthoH = (orthoCount / maxCount) * 150;
    const speechH = (speechCount / maxCount) * 150;

    const chartSvg = document.getElementById('dept-chart-svg');
    if (chartSvg) {
        chartSvg.innerHTML = `
            <g transform="translate(40, 20)">
                <!-- Grid Lines -->
                <line x1="0" y1="0" x2="320" y2="0" stroke="#E2E8F0" stroke-dasharray="4" />
                <line x1="0" y1="50" x2="320" y2="50" stroke="#E2E8F0" stroke-dasharray="4" />
                <line x1="0" y1="100" x2="320" y2="100" stroke="#E2E8F0" stroke-dasharray="4" />
                <line x1="0" y1="150" x2="320" y2="150" stroke="#A0AEC0" stroke-width="2" />

                <!-- Bar 1 (Psychiatry) -->
                <rect x="30" y="${150 - psychH}" width="50" height="${psychH}" fill="#0A4ABF" rx="5" />
                <text x="55" y="${140 - psychH > 10 ? 140 - psychH : 10}" font-family="Outfit" font-size="12" font-weight="700" fill="#03256C" text-anchor="middle">${psychCount}</text>
                <text x="55" y="170" font-family="Outfit" font-size="11" font-weight="600" fill="#4A5568" text-anchor="middle">Psychiatry</text>

                <!-- Bar 2 (Orthopedics) -->
                <rect x="135" y="${150 - orthoH}" width="50" height="${orthoH}" fill="#00B4D8" rx="5" />
                <text x="160" y="${140 - orthoH > 10 ? 140 - orthoH : 10}" font-family="Outfit" font-size="12" font-weight="700" fill="#03256C" text-anchor="middle">${orthoCount}</text>
                <text x="160" y="170" font-family="Outfit" font-size="11" font-weight="600" fill="#4A5568" text-anchor="middle">Orthopedics</text>

                <!-- Bar 3 (Speech) -->
                <rect x="240" y="${150 - speechH}" width="50" height="${speechH}" fill="#00C897" rx="5" />
                <text x="265" y="${140 - speechH > 10 ? 140 - speechH : 10}" font-family="Outfit" font-size="12" font-weight="700" fill="#03256C" text-anchor="middle">${speechCount}</text>
                <text x="265" y="170" font-family="Outfit" font-size="11" font-weight="600" fill="#4A5568" text-anchor="middle">Speech/Aud</text>
            </g>
        `;
    }

    // Render Recent Appointments in Overview
    const recentAptsTable = document.getElementById('recent-apts-body');
    if (recentAptsTable) {
        recentAptsTable.innerHTML = '';
        const recent = apts.slice().sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
        
        recent.forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${a.name}</strong></td>
                <td>${a.docName}</td>
                <td>${a.date}</td>
                <td><span class="badge ${a.status}">${a.status}</span></td>
            `;
            recentAptsTable.appendChild(tr);
        });
    }
}

function renderAdminAppointmentsTable() {
    if (typeof loadAdminAppointmentsList === 'function') {
        loadAdminAppointmentsList();
        return;
    }
    const apts = getAppointments();
    const aptsBody = document.getElementById('admin-apts-body');
    if (!aptsBody) return;

    aptsBody.innerHTML = '';
    
    // Sort so pending comes first, then sorted by date
    const sortedApts = apts.slice().sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(a.date) - new Date(b.date);
    });

    sortedApts.forEach(a => {
        const tr = document.createElement('tr');
        const deptLabel = a.dept === 'psychiatry' ? 'Psychiatry' : (a.dept === 'orthopedics' ? 'Orthopedics' : 'Speech Therapy');
        const modeText = a.mode === 'video' ? 'Online' : 'In-Person';
        
        tr.innerHTML = `
            <td><strong>${a.name}</strong><br><small>${a.phone} | ${a.email || 'No email'}</small></td>
            <td><strong>${deptLabel}</strong><br><small>${a.docName}</small></td>
            <td><strong>${a.date}</strong><br><small>${a.time}</small></td>
            <td><span class="badge ${a.mode || 'in-person'}">${modeText}</span></td>
            <td><span class="badge ${a.status}">${a.status}</span></td>
            <td><span style="color:#166534; font-size:0.75rem;">Web/Email/WA Sent</span></td>
            <td class="action-btns">
                ${a.status === 'pending' ? `
                    <button class="action-btn approve" onclick="openAdminStatusModal('${a.id}', 'approved')" title="Approve">✓</button>
                    <button class="action-btn reject" onclick="openAdminStatusModal('${a.id}', 'rejected')" title="Reject">✗</button>
                ` : ''}
                <button class="action-btn delete" onclick="deleteAppointment('${a.id}')" title="Delete">🗑</button>
            </td>
        `;
        aptsBody.appendChild(tr);
    });
}

function renderAdminDoctorsTable() {
    const docs = getDoctors();
    const docsBody = document.getElementById('admin-docs-body');
    if (!docsBody) return;

    docsBody.innerHTML = '';
    docs.forEach(doc => {
        const tr = document.createElement('tr');
        const deptLabel = doc.dept === 'psychiatry' ? 'Psychiatry & Psych' : (doc.dept === 'orthopedics' ? 'Pediatric Ortho' : 'Speech & Audiology');
        const onlineBadge = doc.onlineAvail 
            ? '<br><span class="badge video" style="font-size:0.75rem; padding:0.1rem 0.4rem; margin-top:0.2rem; display:inline-block;">Online Available</span>' 
            : '<br><span class="badge in-person" style="font-size:0.75rem; padding:0.1rem 0.4rem; margin-top:0.2rem; display:inline-block;">In-Person Only</span>';
        
        tr.innerHTML = `
            <td><span style="font-size: 1.5rem;">${doc.avatar}</span></td>
            <td><strong>${doc.name}</strong><br><small>${doc.qual}</small></td>
            <td><strong>${deptLabel}</strong><br><small>${doc.spec}</small>${onlineBadge}</td>
            <td>${doc.hours}</td>
            <td class="action-btns">
                <button class="action-btn approve" onclick="editDoctor('${doc.id}')" title="Edit">✏️</button>
                <button class="action-btn reject" onclick="deleteDoctor('${doc.id}')" title="Delete">🗑</button>
            </td>
        `;
        docsBody.appendChild(tr);
    });
}

// Update appointment status (Approve/Reject)
window.updateAptStatus = function(aptId, status) {
    const apts = getAppointments();
    const apt = apts.find(a => a.id === aptId);
    if (apt) {
        apt.status = status;
        localStorage.setItem('vkare_appointments', JSON.stringify(apts));
        renderAdminAppointmentsTable();
        renderAdminStats();
    }
};

// Delete appointment
window.deleteAppointment = function(aptId) {
    if (!confirm("Are you sure you want to delete this appointment record?")) return;
    
    let apts = getAppointments();
    apts = apts.filter(a => a.id !== aptId);
    localStorage.setItem('vkare_appointments', JSON.stringify(apts));
    renderAdminAppointmentsTable();
    renderAdminStats();
};

// Delete Doctor
window.deleteDoctor = function(docId) {
    const docs = getDoctors();
    if (docs.length <= 1) {
        alert("Cannot delete all doctors. At least one doctor must be registered in the clinic roster.");
        return;
    }

    if (!confirm("Are you sure you want to remove this doctor from the roster?")) return;

    let updatedDocs = docs.filter(d => d.id !== docId);
    localStorage.setItem('vkare_doctors', JSON.stringify(updatedDocs));
    renderAdminDoctorsTable();
    renderDoctorsList();
    setupBookingFormCascade();
};

// Edit Doctor helper
let editingDoctorId = null;

window.editDoctor = function(docId) {
    const docs = getDoctors();
    const doc = docs.find(d => d.id === docId);
    if (!doc) return;

    editingDoctorId = docId;
    
    // Fill form fields
    document.getElementById('doc-form-name').value = doc.name;
    document.getElementById('doc-form-name-kn').value = doc.nameKn || doc.name;
    document.getElementById('doc-form-qual').value = doc.qual;
    document.getElementById('doc-form-dept').value = doc.dept;
    document.getElementById('doc-form-spec').value = doc.spec;
    document.getElementById('doc-form-spec-kn').value = doc.specKn || doc.spec;
    document.getElementById('doc-form-exp').value = doc.exp;
    document.getElementById('doc-form-exp-kn').value = doc.expKn || doc.exp;
    document.getElementById('doc-form-hours').value = doc.hours;
    document.getElementById('doc-form-hours-kn').value = doc.hoursKn || doc.hours;
    document.getElementById('doc-form-avatar').value = doc.avatar || "🧠";
    document.getElementById('doc-form-online').value = doc.onlineAvail ? 'yes' : 'no';

    // Scroll form into view
    document.getElementById('admin-doc-form').scrollIntoView({ behavior: 'smooth' });
};

// Handle Doctor Form Submit (Add or Edit)
function handleDocSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('doc-form-name').value;
    const nameKn = document.getElementById('doc-form-name-kn').value;
    const qual = document.getElementById('doc-form-qual').value;
    const dept = document.getElementById('doc-form-dept').value;
    const spec = document.getElementById('doc-form-spec').value;
    const specKn = document.getElementById('doc-form-spec-kn').value;
    const exp = document.getElementById('doc-form-exp').value;
    const expKn = document.getElementById('doc-form-exp-kn').value;
    const hours = document.getElementById('doc-form-hours').value;
    const hoursKn = document.getElementById('doc-form-hours-kn').value;
    const avatar = document.getElementById('doc-form-avatar').value;
    const onlineAvail = document.getElementById('doc-form-online').value === 'yes';

    if (!name || !qual || !dept || !spec || !hours) {
        alert("Please fill all doctor mandatory fields.");
        return;
    }

    const docs = getDoctors();

    if (editingDoctorId) {
        // Edit existing doctor
        const docIndex = docs.findIndex(d => d.id === editingDoctorId);
        if (docIndex !== -1) {
            docs[docIndex] = {
                id: editingDoctorId,
                name, nameKn, qual, dept, spec, specKn, exp, expKn, hours, hoursKn, avatar, onlineAvail
            };
        }
        editingDoctorId = null;
    } else {
        // Add new doctor
        const newDoc = {
            id: "doc" + Math.floor(Math.random() * 900000 + 100000),
            name, nameKn, qual, dept, spec, specKn, exp, expKn, hours, hoursKn, avatar, onlineAvail
        };
        docs.push(newDoc);
    }

    localStorage.setItem('vkare_doctors', JSON.stringify(docs));
    e.target.reset();

    renderAdminDoctorsTable();
    renderDoctorsList();
    setupBookingFormCascade();
    alert("Doctor roster updated successfully!");
}
