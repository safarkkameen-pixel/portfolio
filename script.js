/* ═══════════════════════════════════════════════
   SAFAR AMEEN — PORTFOLIO JAVASCRIPT
   Particles · Typing · Scroll Reveal · Cursor
═══════════════════════════════════════════════ */

// ── 1. CUSTOM CURSOR ────────────────────────────
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Enlarge ring on hoverable elements
document.querySelectorAll('a, button, .skill-card, .proj-card, .btn-glow').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
});


// ── 2. SCROLL PROGRESS BAR ──────────────────────
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  const scrollTop    = document.documentElement.scrollTop;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPct    = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrollPct + '%';
});


// ── 3. NAVBAR: transparent → solid on scroll ────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// ── 4. HAMBURGER MENU (mobile) ──────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


// ── 5. PARTICLE CANVAS (hero background) ────────
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');

let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.size  = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    // Pick a neon color
    const colors = ['rgba(124,58,237,', 'rgba(37,99,235,', 'rgba(6,182,212,', 'rgba(236,72,153,'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    // Wrap around edges
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.fill();
  }
}

// Create particles
function initParticles(count = 80) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
initParticles();

// Draw connecting lines between nearby particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth   = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();


// ── 6. TYPING ANIMATION (hero) ──────────────────
const roles = [
  'Data Analyst',
  'Power BI Developer',
  'ML Enthusiast',
  'Python Programmer',
  'Data Storyteller',
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
const typedEl  = document.getElementById('typedText');

function typeWriter() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    // Typing forward
    typedEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentRole.length) {
      // Pause at end before deleting
      setTimeout(() => { isDeleting = true; typeWriter(); }, 1800);
      return;
    }
    setTimeout(typeWriter, 80);

  } else {
    // Deleting
    typedEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting  = false;
      roleIndex   = (roleIndex + 1) % roles.length;
      setTimeout(typeWriter, 300);
      return;
    }
    setTimeout(typeWriter, 40);
  }
}

// Start typing after hero fade-in
setTimeout(typeWriter, 1000);


// ── 7. SCROLL REVEAL ────────────────────────────
// Uses IntersectionObserver for performance
const revealEls = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right, .reveal-zoom'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Unobserve after reveal (one-shot)
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));


// ── 8. SKILL BAR ANIMATION ──────────────────────
// Animate bars when they scroll into view
const skillBars = document.querySelectorAll('.skill-bar');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const pct = bar.getAttribute('data-pct');
      // Small delay for visual effect
      setTimeout(() => {
        bar.style.width = pct + '%';
      }, 200);
      barObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));


// ── 9. HERO FADE-IN ─────────────────────────────
// Hero content already handled by CSS reveal-up class
// Trigger hero reveals immediately (no scroll needed)
document.querySelectorAll('#hero .reveal-up').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 200 + i * 150);
});


// ── 10. PARALLAX EFFECT (hero orbs) ─────────────
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');

  if (orb1) orb1.style.transform = `translateY(${scrollY * 0.15}px)`;
  if (orb2) orb2.style.transform = `translateY(${-scrollY * 0.1}px)`;
  if (orb3) orb3.style.transform = `translateY(${scrollY * 0.08}px)`;
});


// ── 11. SMOOTH SCROLL for nav links ─────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href   = this.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height offset
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ── 12. CONTACT FORM ────────────────────────────
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    formNote.style.color = '#f87171';
    formNote.textContent = 'Please fill in all fields.';
    return;
  }

  // Simulate send (replace with actual backend/emailjs)
  const btn = contactForm.querySelector('.form-submit span:first-child');
  btn.textContent = 'Sending...';

  setTimeout(() => {
    btn.textContent = 'Send Message';
    formNote.style.color = '#4ade80';
    formNote.textContent = '✓ Message sent! Safar will get back to you soon.';
    contactForm.reset();
    setTimeout(() => { formNote.textContent = ''; }, 4000);
  }, 1200);
});


// ── 13. FOOTER FADE-IN ──────────────────────────
const footer = document.getElementById('footer');
const footerObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      footer.style.opacity    = '1';
      footer.style.transform  = 'translateY(0)';
    }
  });
}, { threshold: 0.2 });

footer.style.opacity   = '0';
footer.style.transform = 'translateY(20px)';
footer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
footerObs.observe(footer);


// ── 14. ACTIVE NAV LINK ON SCROLL ───────────────
const sections  = document.querySelectorAll('section[id], footer[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + id) {
          link.style.color = '#fff';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
