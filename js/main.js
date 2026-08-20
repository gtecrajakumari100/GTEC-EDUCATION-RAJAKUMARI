/**
 * G-TEC EDUCATION RAJAKUMARI - MAIN JAVASCRIPT ENGINE (TWO-TIER EDITION)
 * Handles Navbar scroll transformation, mobile menu drawer, courses dropdown, active neon line & lightbox.
 */

document.addEventListener("DOMContentLoaded", function () {
  initNavbarScroll();
  initMobileMenu();
  initCoursesDropdown();
  initGalleryLightbox();
  initHiddenAdminAccess();
  setActiveNavLink();
  initKeyboardEvents();
});

/**
 * Navbar Scroll-Shrinking & Glassmorphism Transition (Stays Royal Blue)
 */
function initNavbarScroll() {
  const navbar = document.querySelector(".site-navbar");
  if (!navbar) return;

  const scrollThreshold = 40;

  function onScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/**
 * Invisible administrator access trigger on the existing home-page address card.
 * Pointer events cover both desktop clicks and mobile taps without altering the card UI.
 */
function initHiddenAdminAccess() {
  const addressCard = document.querySelector("[data-admin-access-trigger]");
  if (!addressCard) return;

  const requiredTaps = 8;
  const inactivityMs = 2000;
  let taps = 0;
  let resetTimer;

  addressCard.addEventListener("pointerup", function (event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    taps += 1;
    window.clearTimeout(resetTimer);

    if (taps === requiredTaps) {
      window.location.assign("admin-login.html");
      return;
    }

    resetTimer = window.setTimeout(function () {
      taps = 0;
    }, inactivityMs);
  });
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const coursesParent = document.querySelector(".nav-item-has-dropdown");

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener("click", function () {
    const isExpanded = navMenu.classList.toggle("active");
    toggleBtn.setAttribute("aria-expanded", isExpanded);
    toggleBtn.innerHTML = isExpanded ? "&times;" : "&#9776;";

    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  const navLinks = navMenu.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (window.innerWidth <= 768 && coursesParent && coursesParent.contains(link)) {
        event.preventDefault();
        coursesParent.classList.toggle("dropdown-open");
        return;
      }

      navMenu.classList.remove("active");
      if (coursesParent) coursesParent.classList.remove("dropdown-open");
      toggleBtn.innerHTML = "&#9776;";
      toggleBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  navMenu.querySelectorAll(".dropdown-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      if (coursesParent) coursesParent.classList.remove("dropdown-open");
      toggleBtn.innerHTML = "&#9776;";
      toggleBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

/**
 * Courses Header Dropdown Handler
 */
function initCoursesDropdown() {
  const coursesParent = document.querySelector(".nav-item-has-dropdown");
  if (!coursesParent) return;

  coursesParent.addEventListener("mouseenter", function () {
    const menu = this.querySelector(".dropdown-menu");
    if (menu) menu.classList.add("show");
  });

  coursesParent.addEventListener("mouseleave", function () {
    const menu = this.querySelector(".dropdown-menu");
    if (menu) menu.classList.remove("show");
  });
}

/**
 * Set Active Nav Link & Neon Line Underline
 */
function setActiveNavLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");
  const courseSubpages = ["software.html", "accounting.html", "multimedia.html", "sap.html", "courses.html"];

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const hrefBase = href ? href.split("#")[0] : "";

    if (
      hrefBase === currentPath ||
      (currentPath === "" && hrefBase === "index.html") ||
      (courseSubpages.includes(currentPath) && hrefBase === "courses.html")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/**
 * Interactive Gallery Lightbox Modal
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll(".gallery-item img");
  if (galleryItems.length === 0) return;

  const lightboxHTML = `
    <div id="gallery-lightbox" class="modal-overlay">
      <div class="lightbox-content" style="position: relative; max-width: 90vw; max-height: 90vh;">
        <button class="modal-close-btn" onclick="closeLightbox()">&times;</button>
        <img id="lightbox-img" src="" alt="Gallery Preview" style="width: 100%; height: auto; max-height: 85vh; object-fit: contain; border-radius: 12px; border: 2px solid #D4AF37; box-shadow: 0 0 30px rgba(0, 217, 255, 0.4);" />
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", lightboxHTML);

  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  galleryItems.forEach((img) => {
    img.addEventListener("click", function () {
      lightboxImg.src = this.src;
      lightboxImg.alt = this.alt;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

function closeLightbox() {
  const lightbox = document.getElementById("gallery-lightbox");
  if (lightbox) {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }
}

/**
 * Keyboard Event Listeners (ESC key closes modals)
 */
function initKeyboardEvents() {
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (typeof closeCourseModal === "function") closeCourseModal();
      closeLightbox();
    }
  });
}
