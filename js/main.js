/* ===== PARTICLE CANVAS ===== */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      setTimeout(() => { preloader.style.display = 'none'; }, 600);
    }
    initAnimations();
  }, 2200);
});

/* ===== CURSOR GLOW ===== */
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow) {
  document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

/* ===== NAVBAR SCROLL ===== */
const navbar = document.querySelector('.navbar');
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
});

/* ===== MOBILE MENU ===== */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });
}

/* ===== TYPEWRITER ===== */
const typewriterEl = document.getElementById('typewriter');
if (typewriterEl) {
  const phrases = [
    'Full Stack Developer',
    'React Specialist',
    'MERN Stack Developer',
    'Problem Solver',
    'CS & AI Undergrad'
  ];
  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      typewriterEl.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 500); return; }
      setTimeout(type, 40);
    } else {
      typewriterEl.textContent = current.substring(0, charIdx++);
      if (charIdx > current.length) { isDeleting = true; setTimeout(type, 2000); return; }
      setTimeout(type, 80);
    }
  }
  type();
}

/* ===== COUNT UP ===== */
function animateCountUp(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ===== PROJECT FILTER ===== */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        card.style.animation = 'fadeUp 0.5s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Message sent successfully! 🎉');
    contactForm.reset();
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ===== GSAP ANIMATIONS ===== */
function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.from('.hero-greeting', { opacity: 0, y: 30, duration: 0.8, delay: 0.2 });
  gsap.from('.hero-name', { opacity: 0, y: 40, duration: 0.8, delay: 0.4 });
  gsap.from('.hero-tagline', { opacity: 0, y: 30, duration: 0.8, delay: 0.6 });
  gsap.from('.hero-desc', { opacity: 0, y: 30, duration: 0.8, delay: 0.8 });
  gsap.from('.hero-ctas', { opacity: 0, y: 30, duration: 0.8, delay: 1.0 });
  gsap.from('.hero-socials', { opacity: 0, y: 30, duration: 0.8, delay: 1.2 });
  gsap.from('.hero-image-wrap', { opacity: 0, x: 60, scale: 0.9, duration: 1.2, delay: 0.5, ease: 'power3.out' });

  // Section reveal
  document.querySelectorAll('section').forEach(sec => {
    gsap.from(sec.querySelectorAll('.section-label, .section-title, .section-subtitle'), {
      scrollTrigger: { trigger: sec, start: 'top 80%' },
      opacity: 0, y: 40, duration: 0.8, stagger: 0.15
    });
  });

  // About
  gsap.from('.about-image-wrap', {
    scrollTrigger: { trigger: '#about', start: 'top 75%' },
    opacity: 0, scale: 0.8, duration: 1
  });
  gsap.from('.about-tag', {
    scrollTrigger: { trigger: '#about', start: 'top 70%' },
    opacity: 0, y: 20, duration: 0.5, stagger: 0.1
  });

  // Stat count-up
  document.querySelectorAll('.stat-number').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => animateCountUp(el)
    });
  });

  // Skills bars
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      once: true,
      onEnter: () => { bar.style.width = bar.dataset.width; }
    });
  });

  // Skill categories
  gsap.from('.skill-category', {
    scrollTrigger: { trigger: '#skills', start: 'top 75%' },
    opacity: 0, y: 40, duration: 0.6, stagger: 0.15
  });

  // Project cards
  gsap.from('.project-card', {
    scrollTrigger: { trigger: '#projects', start: 'top 75%' },
    opacity: 0, y: 50, duration: 0.6, stagger: 0.12
  });

  // Timeline
  gsap.from('.timeline-item', {
    scrollTrigger: { trigger: '#experience', start: 'top 75%' },
    opacity: 0, x: -40, duration: 0.6, stagger: 0.2
  });

  // Education
  gsap.from('.edu-card', {
    scrollTrigger: { trigger: '#education', start: 'top 75%' },
    opacity: 0, y: 40, duration: 0.6, stagger: 0.15
  });

  // Contact
  gsap.from('.contact-info-item', {
    scrollTrigger: { trigger: '#contact', start: 'top 75%' },
    opacity: 0, x: -30, duration: 0.5, stagger: 0.12
  });
  gsap.from('.contact-form', {
    scrollTrigger: { trigger: '#contact', start: 'top 75%' },
    opacity: 0, x: 30, duration: 0.8
  });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
