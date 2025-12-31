/*
 * Global JavaScript for AI Writer Hub
 *
 * Implements simple scroll‑reveal animations and a promotional popup
 * encouraging visitors to try WriteSonic. The popup appears once
 * per session after a short delay and can be dismissed. Reveal
 * animations use the IntersectionObserver API for efficiency.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Scroll‑reveal animation
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // Promotional popup
  const popup = document.getElementById('promo-popup');
  if (popup) {
    // Delay before showing the popup (in milliseconds)
    const popupDelay = 8000;
    // Only show once per session
    if (!sessionStorage.getItem('popupShown')) {
      setTimeout(() => {
        popup.classList.add('show');
      }, popupDelay);
    }
    // Close button handler
    const closeBtn = popup.querySelector('.popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        popup.classList.remove('show');
        sessionStorage.setItem('popupShown', 'true');
      });
    }
  }
});