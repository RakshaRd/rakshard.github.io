document.addEventListener("DOMContentLoaded", function () {
// ================= Typing Animation =================
const typingText = document.querySelector('.typing-text');
const phrases = ['Frontend Developer', 'Backend Developer', 'Web Developer'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    typingText.textContent = isDeleting
        ? currentPhrase.substring(0, charIndex--)
        : currentPhrase.substring(0, ++charIndex);

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        return setTimeout(typeEffect, 2000);
    }

    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    setTimeout(typeEffect, isDeleting ? 50 : 100);
}
setTimeout(typeEffect, 1000);

// ================= Navigation =================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

navLinks.forEach(link =>
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    })
);

// ================= Active Nav =================
const sections = document.querySelectorAll('section[id]');
function updateActiveLink() {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY > top && scrollY <= top + height) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}
window.addEventListener('scroll', updateActiveLink);

// ================= Theme Toggle =================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-theme');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeToggle.innerHTML = isLight
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
});

// ================= Scroll Animations =================
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// ================= Skill Bars =================
document.querySelectorAll('.skill-progress').forEach(bar => {
    bar.style.width = bar.getAttribute('data-progress') + '%';
});

// ================= Project Filtering =================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn =>
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
            const show = filter === 'all' || card.dataset.category.includes(filter);
            card.style.display = show ? 'block' : 'none';
        });
    })
);

// ================= Contact Form (EmailJS) =================
const contactForm = document.getElementById('contactForm');
const formGroups = document.querySelectorAll('.form-group');

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
    const group = input.parentElement;
    group.classList.add('error');
    group.querySelector('.error-message').textContent = message;
}

function clearError(input) {
    const group = input.parentElement;
    group.classList.remove('error');
    group.querySelector('.error-message').textContent = '';
}

// Live validation
formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    input.addEventListener('input', () => clearError(input));
});

// ===== EMAILJS SUBMISSION =====
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(contactForm));
    let valid = true;

    Object.keys(data).forEach(key => {
        const input = contactForm.querySelector(`[name="${key}"]`);
        if (!data[key].trim()) {
            showError(input, 'This field is required');
            valid = false;
        } else if (key === 'email' && !validateEmail(data[key])) {
            showError(input, 'Invalid email');
            valid = false;
        }
    });

    if (!valid) return;

    const submitBtn = contactForm.querySelector('.btn');
    const formStatus = contactForm.querySelector('.form-status');

    submitBtn.classList.add('loading');
    formStatus.style.display = 'none';

   emailjs.send(
    "service_o4ucdz1",
    "hbzyp48",
    {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        time: new Date().toLocaleString()
    }
)
.then(() => {
        submitBtn.classList.remove('loading');
        formStatus.className = 'form-status success';
        formStatus.textContent = '✅ Message sent successfully!';
        formStatus.style.display = 'block';
        contactForm.reset();
    }).catch(() => {
        submitBtn.classList.remove('loading');
        formStatus.className = 'form-status error';
        formStatus.textContent = '❌ Failed to send message.';
        formStatus.style.display = 'block';
    });
});

// ================= Smooth Scroll =================
document.querySelectorAll('a[href^="#"]').forEach(anchor =>
    anchor.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href'))
            ?.scrollIntoView({ behavior: 'smooth' });
    })
);

console.log('Portfolio loaded successfully 🚀');
});
