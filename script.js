/*
 * Global JavaScript for AI Writer Hub
 * Adds scroll reveal animations, a session-based promotional popup, a sticky CTA,
 * and subtle header effects to reinforce the flash-inspired UI.
 */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Scroll‑reveal animation
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // Nav active state
  const navLinks = document.querySelectorAll('.navbar nav a');
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const pathTail = pathParts.pop() || 'index.html';
  const currentPath = pathTail.includes('.') ? pathTail : 'index.html';

  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const normalized = href.split('/').filter(Boolean).pop();
    if (normalized === currentPath) {
      link.classList.add('active');
    }
  });

  // Sticky CTA button (auto-injected on every page)
  if (!document.querySelector('.sticky-cta')) {
    const stickyCta = document.createElement('a');
    stickyCta.href = 'https://writesonic.com/botsonic?fpr=frank67';
    stickyCta.target = '_blank';
    stickyCta.rel = 'noopener';
    stickyCta.className = 'sticky-cta';
    stickyCta.setAttribute('aria-label', 'Start your free Writesonic trial');
    stickyCta.textContent = 'Start Free Trial';
    body.appendChild(stickyCta);
  }

  // Header shadow on scroll
  const header = document.querySelector('.navbar');
  const toggleHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 10) {
      header.classList.add('navbar-scrolled');
    } else {
      header.classList.remove('navbar-scrolled');
    }
  };
  window.addEventListener('scroll', toggleHeaderState);
  toggleHeaderState();

  // Subtle parallax for hero imagery
  const heroImages = document.querySelectorAll('.hero-image img');
  let ticking = false;
  const parallax = () => {
    heroImages.forEach((img) => {
      const offset = Math.min(window.scrollY * 0.04, 30);
      img.style.transform = `translateY(${offset}px) scale(1.02)`;
      img.style.boxShadow = '0 20px 65px rgba(0, 0, 0, 0.6)';
    });
    ticking = false;
  };

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(parallax);
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll);
  parallax();

  // Promotional popup
  const popup = document.getElementById('promo-popup');
  if (popup) {
    const popupDelay = 6500; // milliseconds
    const closePopup = () => {
      popup.classList.remove('show');
      sessionStorage.setItem('popupShown', 'true');
    };

    if (!sessionStorage.getItem('popupShown')) {
      setTimeout(() => {
        popup.classList.add('show');
      }, popupDelay);
    }

    const closeBtn = popup.querySelector('.popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closePopup);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePopup();
      }
    });
  }
});
