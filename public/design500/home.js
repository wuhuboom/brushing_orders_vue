(function () {
  "use strict";

  // Keep the original reveal threshold and CSS animation timing.
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        reveals.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -5% 0px", threshold: 0 });

  document.querySelectorAll("[data-reveal]:not([data-load])").forEach(function (element) {
    if (reducedMotion) element.classList.add("is-revealed");
    else reveals.observe(element);
  });

  var header = document.getElementById("site-header");
  var menu = document.getElementById("services-menu");
  var menuTriggers = document.querySelectorAll('[aria-controls="services-menu"]');
  var menuParent = menu.parentElement;
  var menuTimeout;
  var previousScroll = 0;
  var scrollPending = false;
  var scrollingDown = false;
  var mobileMenu = null;

  function renderHeader() {
    header.classList.toggle("Header-module__lnUIdW__hidden", scrollingDown && !menu.hasAttribute("data-open") && !mobileMenu);
  }

  function updateHeader() {
    var scroll = window.scrollY;
    header.classList.toggle("Header-module__lnUIdW__stuck", scroll > 100);
    scrollingDown = scroll > 50 && previousScroll > 50 && scroll > previousScroll;
    renderHeader();
    previousScroll = scroll;
    scrollPending = false;
  }

  updateHeader();
  window.addEventListener("scroll", function () {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(updateHeader);
    }
  }, { passive: true });

  function showMenu(open) {
    menu.toggleAttribute("data-open", open);
    menuTriggers.forEach(function (trigger) { trigger.setAttribute("aria-expanded", String(open)); });
    renderHeader();
  }

  menuTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      clearTimeout(menuTimeout);
      showMenu(!menu.hasAttribute("data-open"));
    });
    if (trigger.tagName === "A") trigger.addEventListener("keydown", function (event) {
      if (event.key === " ") { event.preventDefault(); trigger.click(); }
    });
  });

  menuParent.addEventListener("pointerenter", function (event) {
    if (event.pointerType !== "mouse") return;
    clearTimeout(menuTimeout);
    showMenu(true);
  });
  menuParent.addEventListener("pointerleave", function (event) {
    if (event.pointerType !== "mouse") return;
    clearTimeout(menuTimeout);
    menuTimeout = setTimeout(function () { showMenu(false); }, 150);
  });
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") showMenu(false);
  });
  window.addEventListener("pointerdown", function (event) {
    if (!menuParent.contains(event.target)) showMenu(false);
  });

  var burger = document.querySelector('[aria-controls="mobile-menu"]');
  var previousOverflow;

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.remove();
    mobileMenu = null;
    document.body.style.overflow = previousOverflow;
    burger.setAttribute("aria-expanded", "false");
    burger.focus();
    renderHeader();
  }

  burger.addEventListener("click", function () {
    if (mobileMenu) return;
    mobileMenu = document.getElementById("mobile-menu-template").content.firstElementChild.cloneNode(true);
    var list = mobileMenu.querySelector("ul");
    document.querySelectorAll(".Header-module__lnUIdW__nav > ul > li").forEach(function (item) {
      var li = document.createElement("li");
      var row = document.createElement("span");
      row.className = "MobileMenu-module__dvw3PW__row";
      var link = item.querySelector("a").cloneNode(true);
      row.appendChild(link);
      li.appendChild(row);
      if (item === menuParent) {
        var toggle = item.querySelector("button").cloneNode(true);
        toggle.className = "MobileMenu-module__dvw3PW__toggle";
        toggle.setAttribute("aria-controls", "mobile-services");
        toggle.setAttribute("aria-expanded", "false");
        link.setAttribute("aria-controls", "mobile-services");
        link.setAttribute("aria-expanded", "false");
        row.appendChild(toggle);
        var sub = document.createElement("div");
        sub.id = "mobile-services";
        sub.className = "MobileMenu-module__dvw3PW__sub";
        sub.hidden = true;
        menu.querySelectorAll(".Header-module__lnUIdW__dropdownCol").forEach(function (column) {
          var group = column.cloneNode(true);
          group.className = "MobileMenu-module__dvw3PW__subGroup";
          group.querySelector("a").className = "MobileMenu-module__dvw3PW__subTitle";
          sub.appendChild(group);
        });
        li.appendChild(sub);
        [link, toggle].forEach(function (control) {
          control.addEventListener("click", function (event) {
            event.preventDefault();
            sub.hidden = !sub.hidden;
            link.setAttribute("aria-expanded", String(!sub.hidden));
            toggle.setAttribute("aria-expanded", String(!sub.hidden));
          });
        });
      }
      list.appendChild(li);
    });
    mobileMenu.querySelectorAll("[data-close-menu]").forEach(function (control) {
      control.addEventListener("click", closeMobileMenu);
    });
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.appendChild(mobileMenu);
    burger.setAttribute("aria-expanded", "true");
    mobileMenu.querySelector("button[data-close-menu]").focus();
    renderHeader();
  });
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMobileMenu();
  });

  var track = document.querySelector(".Testimonials-module__X7R5sW__track");
  var slides = track.querySelectorAll("figure");
  var previous = document.querySelector('[aria-label="Previous testimonial"]');
  var next = document.querySelector('[aria-label="Next testimonial"]');
  var slideIndex = 0;

  function showTestimonial(index) {
    slideIndex = Math.max(0, Math.min(slides.length - 1, index));
    track.style.transform = "translateX(-" + (100 * slideIndex) + "%)";
    slides.forEach(function (slide, i) { slide.setAttribute("aria-hidden", String(i !== slideIndex)); });
    previous.disabled = slideIndex === 0;
    next.disabled = slideIndex === slides.length - 1;
  }
  previous.addEventListener("click", function () { showTestimonial(slideIndex - 1); });
  next.addEventListener("click", function () { showTestimonial(slideIndex + 1); });

  document.querySelector("[data-cookie-preferences]").addEventListener("click", function () {
    if (typeof window.revisitCkyConsent === "function") window.revisitCkyConsent();
    else {
      var revisit = document.querySelector(".cky-btn-revisit");
      if (revisit) revisit.click();
    }
  });

  // The original showreel starts muted 250 ms after page load.
  var hero = document.querySelector('[aria-label="500 Designs showreel"]');
  function playHero() {
    if (navigator.connection && navigator.connection.saveData) return;
    setTimeout(function () {
      hero.muted = true;
      hero.play().catch(function () {});
    }, 250);
  }
  if (document.readyState === "complete") playHero();
  else window.addEventListener("load", playHero, { once: true });

  document.querySelectorAll(".HoverVideo-module__0J-oWW__wrap").forEach(function (wrap) {
    var video = wrap.querySelector("video");
    video.muted = true;
    wrap.addEventListener("mouseenter", function () {
      video.play().catch(function () {});
    });
    video.addEventListener("playing", function () { wrap.dataset.playing = "true"; });
    wrap.addEventListener("mouseleave", function () {
      video.pause();
      video.currentTime = 0;
      delete wrap.dataset.playing;
    });
  });
})();
