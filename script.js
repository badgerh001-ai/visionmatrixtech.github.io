/* ============================================
   VISIONMATRIX TECH — SCRIPT.JS
   ============================================ */

// ─── NAV SCROLL ───
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── HAMBURGER ───
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('active');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

window.closeMobileMenu = function() {
  mobileMenu.classList.remove('active');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
};

// Close on outside click
document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    closeMobileMenu();
  }
});

// ─── HERO WORD CYCLE ───
const words = ['Websites', 'Chatbots', 'Mobile Apps', 'Automations', 'Growth'];
let wordIdx = 0;
const wordEl = document.getElementById('wordCycle');

function cycleWord() {
  wordEl.classList.add('fade');
  setTimeout(() => {
    wordIdx = (wordIdx + 1) % words.length;
    wordEl.textContent = words[wordIdx];
    wordEl.classList.remove('fade');
  }, 320);
}

setInterval(cycleWord, 2600);

// ─── INTERSECTION OBSERVER ───
const revealEls = document.querySelectorAll('.reveal, .process-step');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// ─── TILT EFFECT (service cards) ───
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  });
});

// ─── PAGE LOAD ANIMATION ───
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
