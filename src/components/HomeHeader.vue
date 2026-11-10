<template>
  <div>
    <a href="#main" class="skip-link" data-local-action @click.prevent="skipToContent">Skip to content</a>
    <header id="site-header" class="Header-module__lnUIdW__header Header-module__lnUIdW__dark" :class="{ 'Header-module__lnUIdW__stuck': stuck, 'Header-module__lnUIdW__hidden': scrollingDown && !servicesOpen && !mobileOpen }">
      <div class="Header-module__lnUIdW__inner">
        <a class="Header-module__lnUIdW__logo" aria-label="500 Designs — home" href="#">
          <img class="Header-module__lnUIdW__logoDark" src="design500/assets/500D-Logo-Black.svg" alt="500 Designs" width="135" height="51" />
          <img class="Header-module__lnUIdW__logoLight" src="design500/assets/500D-Logo-White-3.png" alt="500 Designs" width="135" height="50" />
        </a>
        <nav class="Header-module__lnUIdW__nav" aria-label="Main">
          <ul>
            <li><a href="#">Work</a></li>
            <li ref="services" class="Header-module__lnUIdW__hasMenu" @pointerenter="enterServices" @pointerleave="leaveServices">
              <a href="#" role="button" :aria-expanded="String(servicesOpen)" aria-controls="services-menu" data-local-action @click.prevent="toggleServices" @keydown.space.prevent="toggleServices">Services</a>
              <button type="button" class="Header-module__lnUIdW__menuToggle" :aria-expanded="String(servicesOpen)" aria-controls="services-menu" aria-label="Show services" @click="toggleServices">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </button>
              <div id="services-menu" class="Header-module__lnUIdW__dropdown" :data-open="servicesOpen ? '' : null">
                <div class="Header-module__lnUIdW__dropdownInner">
                  <div v-for="group in serviceGroups" :key="group.title" class="Header-module__lnUIdW__dropdownCol">
                    <a class="Header-module__lnUIdW__dropdownGroup" href="#">{{ group.title }}</a>
                    <ul><li v-for="item in group.items" :key="item"><a href="#">{{ item }}</a></li></ul>
                  </div>
                </div>
              </div>
            </li>
            <li v-for="item in companyLinks" :key="item"><a href="#">{{ item }}</a></li>
          </ul>
        </nav>
        <a class="Header-module__lnUIdW__cta" href="#">Get in touch</a>
        <button ref="burger" type="button" class="Header-module__lnUIdW__burger" aria-label="Open menu" :aria-expanded="String(mobileOpen)" aria-controls="mobile-menu" @click="openMobileMenu">
          <img class="Header-module__lnUIdW__burgerDark" src="design500/assets/Hamburger_menu.png" alt="" role="presentation" width="18" height="21" />
          <img class="Header-module__lnUIdW__burgerLight" src="design500/assets/Hamburger_menu-light.png" alt="" role="presentation" width="18" height="21" />
        </button>
      </div>
    </header>
    <div class="Header-module__lnUIdW__spacer Header-module__lnUIdW__spacerDark" aria-hidden="true"></div>
    <div v-if="mobileOpen" id="mobile-menu" class="MobileMenu-module__dvw3PW__root" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="MobileMenu-module__dvw3PW__overlay" @click="closeMobileMenu"></div>
      <div class="MobileMenu-module__dvw3PW__panel">
        <div class="MobileMenu-module__dvw3PW__top">
          <a href="#" aria-label="500 Designs — home"><img class="MobileMenu-module__dvw3PW__logo" src="design500/assets/500D-Logo-White.png" alt="500 Designs" width="91" height="34" /></a>
          <button ref="closeButton" type="button" class="MobileMenu-module__dvw3PW__close" aria-label="Close menu" @click="closeMobileMenu"><img src="design500/assets/Hamburger_menu-close-white.png" alt="" role="presentation" width="18" height="21" /></button>
        </div>
        <nav class="MobileMenu-module__dvw3PW__body" aria-label="Mobile">
          <ul class="MobileMenu-module__dvw3PW__list">
            <li><span class="MobileMenu-module__dvw3PW__row"><a href="#">Work</a></span></li>
            <li>
              <span class="MobileMenu-module__dvw3PW__row">
                <a href="#" role="button" :aria-expanded="String(mobileServicesOpen)" aria-controls="mobile-services" data-local-action @click.prevent="mobileServicesOpen = !mobileServicesOpen" @keydown.space.prevent="mobileServicesOpen = !mobileServicesOpen">Services</a>
                <button type="button" class="MobileMenu-module__dvw3PW__toggle" :aria-expanded="String(mobileServicesOpen)" aria-controls="mobile-services" aria-label="Show services" @click="mobileServicesOpen = !mobileServicesOpen">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </button>
              </span>
              <div id="mobile-services" class="MobileMenu-module__dvw3PW__sub" :hidden="!mobileServicesOpen">
                <div v-for="group in serviceGroups" :key="group.title" class="MobileMenu-module__dvw3PW__subGroup">
                  <a class="MobileMenu-module__dvw3PW__subTitle" href="#">{{ group.title }}</a>
                  <ul><li v-for="item in group.items" :key="item"><a href="#">{{ item }}</a></li></ul>
                </div>
              </div>
            </li>
            <li v-for="item in companyLinks" :key="item"><span class="MobileMenu-module__dvw3PW__row"><a href="#">{{ item }}</a></span></li>
          </ul>
          <a href="#" class="MobileMenu-module__dvw3PW__cta">Get in touch</a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import serviceGroups from "@/content/services";

export default {
  name: "HomeHeader",
  data: () => ({ serviceGroups, companyLinks: ["About", "Careers", "Insights"], servicesOpen: false, mobileOpen: false, mobileServicesOpen: false, stuck: false, scrollingDown: false }),
  mounted() {
    this.previousScroll = window.scrollY;
    this.updateHeader();
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("pointerdown", this.onPointerDown);
  },
  beforeDestroy() {
    clearTimeout(this.menuTimeout);
    cancelAnimationFrame(this.scrollFrame);
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("pointerdown", this.onPointerDown);
    if (this.mobileOpen) document.body.style.overflow = this.previousOverflow;
  },
  methods: {
    skipToContent() {
      const main = document.getElementById("main");
      main.focus({ preventScroll: true });
      main.scrollIntoView();
    },
    updateHeader() {
      const scroll = window.scrollY;
      this.stuck = scroll > 100;
      this.scrollingDown = scroll > 50 && this.previousScroll > 50 && scroll > this.previousScroll;
      this.previousScroll = scroll;
      this.scrollFrame = null;
    },
    onScroll() {
      if (!this.scrollFrame) this.scrollFrame = requestAnimationFrame(this.updateHeader);
    },
    toggleServices() {
      clearTimeout(this.menuTimeout);
      this.servicesOpen = !this.servicesOpen;
    },
    enterServices(event) {
      if (event.pointerType !== "mouse") return;
      clearTimeout(this.menuTimeout);
      this.servicesOpen = true;
    },
    leaveServices(event) {
      if (event.pointerType !== "mouse") return;
      clearTimeout(this.menuTimeout);
      this.menuTimeout = setTimeout(() => { this.servicesOpen = false; }, 150);
    },
    onPointerDown(event) {
      if (!this.$refs.services.contains(event.target)) this.servicesOpen = false;
    },
    onKeyDown(event) {
      if (event.key !== "Escape") return;
      this.servicesOpen = false;
      this.closeMobileMenu();
    },
    openMobileMenu() {
      this.previousOverflow = document.body.style.overflow;
      this.mobileServicesOpen = false;
      this.mobileOpen = true;
      document.body.style.overflow = "hidden";
      this.$nextTick(() => this.$refs.closeButton.focus());
    },
    closeMobileMenu() {
      if (!this.mobileOpen) return;
      this.mobileOpen = false;
      document.body.style.overflow = this.previousOverflow;
      this.$refs.burger.focus();
    },
  },
};
</script>
