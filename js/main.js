/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const coursesParent = document.querySelector(".nav-item-has-dropdown");

  if (!toggleBtn || !navMenu) return;

  // Open / close mobile navigation
  toggleBtn.addEventListener("click", function () {
    const isExpanded = navMenu.classList.toggle("active");

    toggleBtn.setAttribute("aria-expanded", isExpanded);
    toggleBtn.innerHTML = isExpanded ? "&times;" : "&#9776;";

    document.body.style.overflow = isExpanded ? "hidden" : "";
  });

  // Main navigation links
  const navLinks = navMenu.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {

      /*
       * MOBILE COURSES NAVIGATION
       *
       * First tap  → Open Courses dropdown
       * Second tap → Open courses.html
       */
      if (
        window.innerWidth <= 768 &&
        coursesParent &&
        coursesParent.contains(link)
      ) {
        const isDropdownOpen =
          coursesParent.classList.contains("dropdown-open");

        // First tap → open dropdown
        if (!isDropdownOpen) {
          event.preventDefault();
          coursesParent.classList.add("dropdown-open");
          return;
        }

        // Second tap → allow courses.html navigation
        coursesParent.classList.remove("dropdown-open");
      }

      // Close mobile menu after navigation
      navMenu.classList.remove("active");

      if (coursesParent) {
        coursesParent.classList.remove("dropdown-open");
      }

      toggleBtn.innerHTML = "&#9776;";
      toggleBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Dropdown item clicks
  navMenu.querySelectorAll(".dropdown-link").forEach((link) => {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active");

      if (coursesParent) {
        coursesParent.classList.remove("dropdown-open");
      }

      toggleBtn.innerHTML = "&#9776;";
      toggleBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}
