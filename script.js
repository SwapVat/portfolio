/**
 * Swapnil Vats Portfolio - Interactive JavaScript
 * Features:
 * - Theme toggle (Dark / Light) with localStorage & system preference
 * - Sticky navigation blur on scroll
 * - Active section highlighting on scroll (IntersectionObserver / scroll calculation)
 * - Mobile navigation menu drawer
 * - Smooth scroll for anchor links
 */

(function () {
  'use strict';

  // 1. Theme Management
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve stored theme or default to 'dark'
  const storedTheme = localStorage.getItem('portfolio-theme');
  if (storedTheme) {
    htmlElement.setAttribute('data-theme', storedTheme);
  } else {
    // Default requested is dark
    htmlElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('portfolio-theme', targetTheme);
    });
  }

  // 2. Sticky Header Styling on Scroll
  const header = document.getElementById('header');
  function handleHeaderScroll() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('nav-open');
      mobileMenuBtn.classList.toggle('open', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking on any nav link
    const allNavAnchors = navLinks.querySelectorAll('.nav-link');
    allNavAnchors.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (
        !header.contains(event.target) &&
        navLinks.classList.contains('nav-open')
      ) {
        navLinks.classList.remove('nav-open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 4. Active Section Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const navHeight = header ? header.offsetHeight : 72;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - (navHeight + 100);
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // If near top of page, ensure home is active
    if (scrollY < 120) {
      navItems.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#home') {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // 5. Accessible Keyboard Trap / Escape handling for Mobile Nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('nav-open')) {
      navLinks.classList.remove('nav-open');
      mobileMenuBtn.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.focus();
    }
  });

  // 6. Alert user gracefully when clicking placeholder links
  const placeholderLinks = document.querySelectorAll('a[href="#"]');
  placeholderLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Don't intercept back to top or specific anchor links
      const href = link.getAttribute('href');
      if (href === '#') {
        const aria = link.getAttribute('aria-label') || link.textContent.trim();
        console.info(`Placeholder link clicked: ${aria}. Ready to be updated with production URL.`);
      }
    });
  });

})();
