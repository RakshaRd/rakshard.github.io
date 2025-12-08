// Typed Text
document.addEventListener('DOMContentLoaded', () => {
    const typed = new Typed('.typing-text', {
        strings: ['Frontend Developer', 'Backend Developer', 'Web Developer'],
        typeSpeed: 70,
        backSpeed: 70,
        backDelay: 1000,
        loop: true,
    });
});

// About fade-in animation
document.addEventListener("DOMContentLoaded", function () {
    const aboutSection = document.querySelector(".about");
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("fade-in");
                }
            });
        },
        { threshold: 0.5 }
    );
    observer.observe(aboutSection);
});

// Animate progress bars
const progressBars = document.querySelectorAll('.progress-done');

progressBars.forEach(bar => {
    setTimeout(() => {
        bar.style.width = bar.getAttribute('data-done') + '%';
        bar.style.opacity = 1;
    }, 500);
});

// Animate circular skills
const circles = document.querySelectorAll('.circle');

circles.forEach(circle => {
    let percent = circle.getAttribute('data-percent');
    circle.style.setProperty('--percent', percent);
});

// Show success message after form submit using FormSubmit redirect URL
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("success")) {
        const statusEl = document.getElementById("contactStatus");
        statusEl.style.display = "block";
        statusEl.style.color = "#00FFA3";
        statusEl.textContent = "Message sent successfully!";
    }
});

// Mobile nav
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');
const menuIconInner = menuIcon.querySelector('i');

menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('show');

    // toggle icon
    if (menuIconInner.classList.contains('fa-bars')) {
        menuIconInner.classList.remove('fa-bars');
        menuIconInner.classList.add('fa-xmark');
    } else {
        menuIconInner.classList.remove('fa-xmark');
        menuIconInner.classList.add('fa-bars');
    }
});
