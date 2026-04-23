/* ============================================================
   NexaFlow — script.js  (Level 2)
   Features:
   1. Hamburger menu toggle (with X animation)
   2. Close menu on nav link click
   3. Close menu on outside click
   4. Dark mode toggle (synced desktop + mobile button)
   5. Navbar scroll shadow
   6. Active nav link highlight on scroll
   7. Card entrance animation (IntersectionObserver)
============================================================ */

(function () {
  'use strict';

  /* ============================================================
     1. ELEMENT REFS
  ============================================================ */
  const hamburger       = document.getElementById('hamburger');
  const mobileMenu      = document.getElementById('mobileMenu');
  const mobileLinks     = document.querySelectorAll('.mobile-link');
  const darkToggle      = document.getElementById('darkToggle');
  const darkToggleMob   = document.getElementById('darkToggleMobile');
  const toggleIcon      = document.getElementById('toggleIcon');
  const toggleIconMob   = document.getElementById('toggleIconMobile');
  const navbar          = document.getElementById('navbar');
  const body            = document.body;
  const navLinks        = document.querySelectorAll('.nav-link');
  const sections        = document.querySelectorAll('section[id]');
  const cards           = document.querySelectorAll('.card');


  /* ============================================================
     2. HAMBURGER MENU
  ============================================================ */
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    // Make links focusable
    mobileLinks.forEach(link => link.setAttribute('tabindex', '0'));
  }

  function closeMenu() {
    menuOpen = false;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileLinks.forEach(link => link.setAttribute('tabindex', '-1'));
  }

  hamburger.addEventListener('click', () => {
    menuOpen ? closeMenu() : openMenu();
  });

  // Close menu when a mobile link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside navbar
  document.addEventListener('click', (e) => {
    if (menuOpen && !navbar.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640 && menuOpen) {
      closeMenu();
    }
  });


  /* ============================================================
     3. DARK MODE TOGGLE
     - Syncs both desktop and mobile toggle buttons
     - Saves preference to localStorage
     - Respects OS preference on first load
  ============================================================ */
  function applyTheme(theme) {
    if (theme === 'dark') {
      body.classList.add('dark');
      toggleIcon.textContent    = '☀️';
      toggleIconMob.textContent = '☀️';
    } else {
      body.classList.remove('dark');
      toggleIcon.textContent    = '🌙';
      toggleIconMob.textContent = '🌙';
    }
    localStorage.setItem('nexaflow-theme', theme);
  }

  function toggleTheme() {
    const isDark = body.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  }

  // Initial theme: saved preference → OS preference → light
  const savedTheme = localStorage.getItem('nexaflow-theme');
  const osPrefers  = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(savedTheme || osPrefers);

  darkToggle.addEventListener('click',    toggleTheme);
  darkToggleMob.addEventListener('click', toggleTheme);


  /* ============================================================
     4. NAVBAR SCROLL EFFECT
     Adds .scrolled class → backdrop blur + shadow via CSS
  ============================================================ */
  function handleScroll() {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load


  /* ============================================================
     5. ACTIVE NAV LINK HIGHLIGHT
     Highlights the nav link whose section is in viewport
  ============================================================ */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          const id     = entry.target.getAttribute('id');
          const active = document.querySelector(`.nav-link[href="#${id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    {
      threshold: 0.4,
      rootMargin: '-60px 0px 0px 0px'
    }
  );

  sections.forEach(s => sectionObserver.observe(s));


  /* ============================================================
     6. CARD ENTRANCE ANIMATION (Scroll-triggered)
     Cards start hidden (opacity:0, translateY) in CSS.
     IntersectionObserver adds .visible class → CSS transitions in.
     Staggered delay based on card index within its row.
  ============================================================ */
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Find sibling index for stagger delay
          const siblings = Array.from(
            entry.target.closest('.cards-grid')?.querySelectorAll('.card') || []
          );
          const idx = siblings.indexOf(entry.target);
          const delay = idx * 100; // 100ms stagger

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  cards.forEach(card => cardObserver.observe(card));


  /* ============================================================
     7. SMOOTH SCROLL for all anchor links
     (enhances native scroll-behavior: smooth with offset for navbar)
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const top       = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
