document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Set current year in footer
       ========================================================================== */
    const yearSpan = document.getElementById('year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();

    /* ==========================================================================
       Navigation and Mobile Menu
       ========================================================================== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when link is clicked
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    /* ==========================================================================
       Smooth Scrolling & Active Link highlighting
       ========================================================================== */
    const sections = document.querySelectorAll('section');

    function setActiveLink() {
        let index = sections.length;
        
        while(--index && window.scrollY + 100 < sections[index].offsetTop) {}
        
        navLinksItems.forEach((link) => link.classList.remove('active'));
        if(index >= 0) {
            const activeLink = document.querySelector(`.nav-link[href="#${sections[index].id}"]`);
            if(activeLink) activeLink.classList.add('active');
        }
    }

    setActiveLink();
    window.addEventListener('scroll', setActiveLink);

    /* ==========================================================================
       Scroll Animations (Intersection Observer)
       ========================================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));

    /* ==========================================================================
       Contact Form Helper
       ========================================================================== */
    const contactForm = document.querySelector('.contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const statusText = contactForm.querySelector('.form-status');
            const originalText = btn.textContent;
            const formData = new FormData(contactForm);

            btn.textContent = "Sending...";
            btn.style.opacity = '0.7';
            btn.disabled = true;
            if (statusText) {
                statusText.textContent = "";
                statusText.classList.remove('error');
            }

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: formData,
                    headers: { "Accept": "application/json" }
                });

                if (!response.ok) {
                    throw new Error("Message failed");
                }

                contactForm.reset();
                btn.textContent = "Message Sent!";
                btn.style.backgroundColor = "var(--neon-blue)";
                btn.style.color = "var(--bg-color)";
                if (statusText) {
                    statusText.textContent = "Thanks! Your message was sent successfully.";
                }
            } catch (error) {
                btn.textContent = "Try Again";
                if (statusText) {
                    statusText.textContent = "Sorry, message failed. Please try again in a moment.";
                    statusText.classList.add('error');
                }
            } finally {
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = "";
                    btn.style.color = "";
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 3000);
            }
        });
    }

    /* ==========================================================================
       Particles Canvas Background
       ========================================================================== */
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let hw = canvas.width = window.innerWidth;
    let hh = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        hw = canvas.width = window.innerWidth;
        hh = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * hw;
            this.y = Math.random() * hh;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            // Neon colors: Blue, Purple, Pink
            const colors = ['#00f3ff', '#bc13fe', '#ff0055'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > hw) this.x = 0;
            else if (this.x < 0) this.x = hw;
            
            if (this.y > hh) this.y = 0;
            else if (this.y < 0) this.y = hh;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.min((hw * hh) / 10000, 100); 
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, hw, hh);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
});
