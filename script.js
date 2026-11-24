document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function closeMobileMenu() {
    if (!navToggle || !siteNav) return;
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.textContent = 'Menü';
  }

  function toggleMobileMenu() {
    if (!navToggle || !siteNav) return;
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.textContent = isOpen ? 'Kapat' : 'Menü';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (!siteNav || !navToggle) return;
    if (!siteNav.classList.contains('is-open')) return;
    if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) {
      closeMobileMenu();
    }
  });

  function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      closeMobileMenu();

      const headerOffset = header ? header.getBoundingClientRect().height : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
      });

      if (target.id) {
        setActiveLink(target.id);
        history.replaceState(null, '', `#${target.id}`);
      }
    });
  });

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0 && visible[0].target.id) {
          setActiveLink(visible[0].target.id);
        }
      },
      {
        rootMargin: '-35% 0px -50% 0px',
        threshold: [0.15, 0.4, 0.7],
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
});
