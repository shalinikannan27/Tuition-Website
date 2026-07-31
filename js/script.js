// Shankar's Tuition Academy — Interaction Layer
// Progressive enhancement: site works fully without JS.

(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("nav a:not(.nav-cta)"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ========================================
     Header: shadow + shrink on scroll
     ======================================== */
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  /* ========================================
     Active nav link highlighting
     ======================================== */
  function updateActiveNav() {
    if (!sections.length) return;

    var scrollPos = window.scrollY + 140;
    var currentId = "";

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;
      var target = href.replace("#", "");
      if (target === currentId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  function onScroll() {
    updateHeader();
    updateActiveNav();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ========================================
     Smooth scroll for anchor links
     ======================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#" || targetId.length < 2) return;

      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      var headerH = header ? header.offsetHeight + 20 : 0;
      var top = targetEl.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ========================================
     Scroll Reveal with stagger
     ======================================== */
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    // Instantly show everything
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  } else {
    // Assign stagger delays to cards within grids
    document.querySelectorAll(".card-grid, .timings-grid, .testimonials-grid").forEach(function (grid) {
      Array.prototype.slice.call(grid.children).forEach(function (child, i) {
        if (child.classList.contains("reveal")) {
          child.style.transitionDelay = (i * 0.08) + "s";
        }
      });
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

})();
