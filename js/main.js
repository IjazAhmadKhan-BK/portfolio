document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                themeToggle.innerHTML = '☀️';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                themeToggle.innerHTML = '🌙';
            }
        });
    }

    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const cursorTrail = document.querySelector('.cursor-trail');
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    
    if (cursor && cursorTrail && !isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Trail effect delay
            setTimeout(() => {
                cursorTrail.style.left = e.clientX + 'px';
                cursorTrail.style.top = e.clientY + 'px';
            }, 50);
        });

        // Hover effects on interactables
        const interactables = document.querySelectorAll('a, button, .glass-card, .skill-tag');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
            });
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                mobileMenuBtn.innerHTML = '✕';
                mobileMenuBtn.style.transform = 'rotate(180deg)';
            } else {
                mobileMenuBtn.innerHTML = '☰';
                mobileMenuBtn.style.transform = 'rotate(0deg)';
            }
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '☰';
                mobileMenuBtn.style.transform = 'rotate(0deg)';
            });
        });
    }

    // Sticky Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Advanced Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100); 
                    });
                }
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animClasses = ['.anim-scale-up', '.anim-slide-up', '.anim-slide-left', '.anim-slide-right', '.anim-pop', '.section-title', '.stagger-children'];
    animClasses.forEach(cls => {
        document.querySelectorAll(cls).forEach(el => {
            observer.observe(el);
        });
    });

    // 3D Tilt Effect for Glass Cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return; // Disable tilt on mobile
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg tilt
            const rotateY = ((x - centerX) / centerX) * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            // Wait for transition to finish then remove inline transform
            setTimeout(() => {
                if(!card.matches(':hover')) card.style.transform = '';
            }, 300);
        });
    });

    // Heavy Canvas Particles Background
    const canvas = document.getElementById('heavy-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];
        // Reduce particles heavily on mobile for performance
        const numParticles = window.innerWidth < 768 ? 50 : 250;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 3 + 1;
                // Get theme color variables
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                const colorVal = isLight ? '29, 78, 216' : '37, 99, 235'; // rgb representation of primary
                this.color = `rgba(${colorVal}, ${Math.random() * 0.5 + 0.1})`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                const dx = parseFloat(cursor.style.left || 0) - this.x;
                const dy = parseFloat(cursor.style.top || 0) - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    this.x -= dx * 0.05;
                    this.y -= dy * 0.05;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                
                // Update color based on theme
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                const colorVal = isLight ? '29, 78, 216' : '37, 99, 235';
                ctx.fillStyle = `rgba(${colorVal}, ${Math.random() * 0.5 + 0.1})`;
                
                ctx.fill();
            }
        }

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            // Check theme for background clear
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            ctx.fillStyle = isLight ? 'rgba(248, 250, 252, 0.1)' : 'rgba(5, 5, 5, 0.1)';
            ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        const opacity = 1 - (dist / 100);
                        const colorVal = isLight ? '29, 78, 216' : '37, 99, 235';
                        ctx.strokeStyle = `rgba(${colorVal}, ${opacity * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }
});
