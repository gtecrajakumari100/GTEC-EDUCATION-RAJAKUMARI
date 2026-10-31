/**
 * G-TEC EDUCATION RAJAKUMARI - ANIMATIONS ENGINE
 * Scroll Reveal via Intersection Observer
 */

document.addEventListener("DOMContentLoaded", function () {
  initScrollReveals();
});

function initScrollReveals() {
  const revealElements = document.querySelectorAll(".reveal-up, .reveal-scale");

  if (!("IntersectionObserver" in window)) {
    // Fallback for legacy browsers
    revealElements.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.05,
    rootMargin: "0px 0px 50px 0px"
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
    // Immediate check for elements in top viewport fold
    const rect = el.getBoundingClientRect();
    if (rect.top < (window.innerHeight || document.documentElement.clientHeight)) {
      el.classList.add("is-visible");
    }
  });
}
