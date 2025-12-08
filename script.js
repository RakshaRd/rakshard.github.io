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


// contact 

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const statusEl = document.getElementById("contactStatus");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const payload = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value,
        };

        try {
            statusEl.style.display = "block";
            statusEl.style.color = "#00FFA3";
            statusEl.textContent = "Sending...";

            const res = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                statusEl.textContent = "Message sent successfully!";
                form.reset();
            } else {
                statusEl.style.color = "tomato";
                statusEl.textContent = data.error || "Failed to send message.";
            }
        } catch (err) {
            console.error(err);
            statusEl.style.display = "block";
            statusEl.style.color = "tomato";
            statusEl.textContent = "Something went wrong. Please try again.";
        }
    });
});






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