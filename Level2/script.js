/* ============================================================
   NexaFlow — script.js
   Level 2: Dark Mode Toggle + Navbar Scroll Effect
   ============================================================ */

(function () {
  'use strict';

  /* ---- 1. DARK MODE TOGGLE ---- */
  const toggle = document.getElementById('darkToggle');
  const body   = document.body;

  // Persist preference across page loads
  const savedTheme = localStorage.getItem('nexaflow-theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    toggle.textContent = '☀️';
  }

  toggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    toggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('nexaflow-theme', isDark ? 'dark' : 'light');
  });


  /* ---- 2. NAVBAR SCROLL EFFECT ---- */
  // Adds a subtle shadow + slight blur when user scrolls down
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.style.backdropFilter = 'blur(12px)';
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
    } else {
      navbar.style.backdropFilter = 'none';
      navbar.style.boxShadow = 'none';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ---- 3. SMOOTH CARD ENTRANCE (Intersection Observer) ---- */
  // Cards fade + slide up as they enter viewport
  const cards = document.querySelectorAll('.card');

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay based on card index
          const delay = Array.from(cards).indexOf(entry.target) * 80;
          setTimeout(() => {
            entry.target.classList.add('card--visible');
          }, delay);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  // Start all cards as invisible
  cards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
  });

  // When .card--visible is added, animate in
  // (We use inline style toggling so no extra CSS class needed)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const el = mutation.target;
        if (el.classList.contains('card--visible')) {
          el.style.opacity  = '1';
          el.style.transform = 'translateY(0)';
        }
      }
    });
  });

  cards.forEach((card) => {
    observer.observe(card, { attributes: true });
  });


  /* ---- 4. ACTIVE NAV LINK HIGHLIGHT ---- */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => {
            a.style.color = '';
            a.style.fontWeight = '';
          });
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) {
            active.style.color = 'var(--accent)';
            active.style.fontWeight = '600';
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

})();