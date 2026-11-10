<template>
<footer class="Footer-module__3hUVsW__footer">
<div class="Footer-module__3hUVsW__inner">
<div class="Footer-module__3hUVsW__main">
<a class="Footer-module__3hUVsW__logo" aria-label="500 Designs — home" href="#">
<img src="design500/assets/500D-Logo-White-3.png" alt="500 Designs" width="211" height="79" loading="lazy">
</a>
<div class="Footer-module__3hUVsW__pitch">
<p class="Footer-module__3hUVsW__lead">Transformative experiences by design</p>
<p class="Footer-module__3hUVsW__lead2">Let’s work together.</p>
<p class="Footer-module__3hUVsW__emailWrap">
<a class="Footer-module__3hUVsW__email" href="#" data-contact="email">{{ contact.email }}</a>
</p>
<p class="Footer-module__3hUVsW__phoneWrap">
<a class="Footer-module__3hUVsW__phone" href="#" data-contact="phone">{{ contact.phone }}</a>
</p>
<ul class="Footer-module__3hUVsW__social" aria-label="500 Designs on social media">
<li>
<a href="#" target="_blank" rel="noopener noreferrer" aria-label="500 Designs on LinkedIn">
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" fill="currentColor">
</path>
</svg>
</a>
</li>
<li>
<a href="#" target="_blank" rel="noopener noreferrer" aria-label="500 Designs on Instagram">
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2">
<rect x="2" y="2" width="20" height="20" rx="5.5">
</rect>
<circle cx="12" cy="12" r="4.5">
</circle>
<circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none">
</circle>
</svg>
</a>
</li>
<li>
<a href="#" target="_blank" rel="noopener noreferrer" aria-label="500 Designs on Clutch">
<span class="Footer-module__3hUVsW__maskIcon" style="-webkit-mask-image:url(design500/assets/clutch-icon.png);mask-image:url(design500/assets/clutch-icon.png)" aria-hidden="true">
</span>
</a>
</li>
</ul>
</div>
<nav class="Footer-module__3hUVsW__services" aria-label="Footer">
<div class="Footer-module__3hUVsW__serviceCol">
<p class="Footer-module__3hUVsW__colHead">Company</p>
<ul><li v-for="item in companyLinks" :key="item"><a href="#">{{ item }}</a></li></ul>
</div>
<div v-for="group in serviceGroups" :key="group.title" class="Footer-module__3hUVsW__serviceCol">
<a class="Footer-module__3hUVsW__serviceGroup" href="#">{{ group.title }}</a>
<ul><li v-for="item in group.items" :key="item"><a href="#">{{ item }}</a></li></ul>
</div>
</nav>
<div class="Footer-module__3hUVsW__locations">
<p class="Footer-module__3hUVsW__locLabel">Locations</p>
<div>
<ul class="Footer-module__3hUVsW__locList" data-contact-locations>
<template v-for="(location, index) in contact.locations">
<li v-if="index > 0" :key="'separator-' + index" aria-hidden="true" class="Footer-module__3hUVsW__dot">•</li>
<li :key="'location-' + index"><a href="#">{{ location }}</a></li>
</template>
</ul>
<address class="Footer-module__3hUVsW__address" data-contact="address">{{ contact.address }}</address>
</div>
</div>
</div>
<div class="Footer-module__3hUVsW__bottom">
<hr class="Footer-module__3hUVsW__rule">
<div class="Footer-module__3hUVsW__legal">
<p class="Footer-module__3hUVsW__copy">© 2026 500 Designs LLC. All rights reserved.</p>
<ul class="Footer-module__3hUVsW__legalNav">
<li>
<a href="#">Privacy Policy</a>
</li>
<li>
<a href="#">Terms</a>
</li>
<li>
<a href="#">Cookies Policy</a>
</li>
<li>
<button type="button" data-cookie-preferences @click="cookiePreferences">Cookie Preferences</button>
</li>
<li>
<a href="#">Sitemap</a>
</li>
</ul>
</div>
</div>
</div>
</footer>
</template>

<script>
import serviceGroups from "@/content/services";

export default {
  name: "HomeFooter",
  data: () => ({
    serviceGroups,
    companyLinks: ["Home", "Work", "About", "Careers", "Insights", "Contact Us"],
    contact: (window.APP_CONFIG && window.APP_CONFIG.contact) || {},
  }),
  methods: {
    cookiePreferences() {
      if (typeof window.revisitCkyConsent === "function") window.revisitCkyConsent();
      else {
        const revisit = document.querySelector(".cky-btn-revisit");
        if (revisit) revisit.click();
      }
    },
  },
};
</script>
