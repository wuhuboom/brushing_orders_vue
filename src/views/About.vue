<template>
  <main class="about-page">
    <div class="about-titlebar">
      <div class="about-container about-titlebar__inner">
        <router-link to="/" class="back-button" aria-label="Back to home"><SiteIcon name="back" /></router-link>
        <h1>About Us</h1>
      </div>
    </div>

    <div class="contact-content">
      <div class="contact-heading">
        <nav class="about-breadcrumb" aria-label="Breadcrumb"><router-link to="/">Home</router-link><span>/</span><span aria-current="page">About Us</span></nav>
        <p>CONNECT WITH OUR TEAM</p>
      </div>

      <section class="contact-intro" aria-labelledby="about-heading">
        <div class="contact-intro__copy">
          <h2 id="about-heading">About World of Good</h2>
          <p>We’re a digital marketing and creative agency based in California City.</p>
          <p>Get in touch with our team directly via phone or official email.</p>
        </div>
        <img src="worldofgood/about-office.webp" alt="The World of Good team in a bright, collaborative office" width="530" height="225" />
      </section>

      <section class="contact-cards" aria-label="Contact our team">
        <article class="contact-card">
          <div class="contact-card__heading"><span class="contact-symbol"><SiteIcon name="phone" /></span><p>DIRECT LINE / TOLL-FREE</p></div>
          <div class="contact-card__details">
            <h3>OFFICIAL CORPORATE PHONE</h3>
            <a class="contact-value" href="tel:+18004928820">{{ phone }}</a>
          </div>
          <p class="contact-note"><SiteIcon name="clock" /><span>Mon – Fri, 8:00 AM – 6:00 PM PST</span></p>
          <div class="contact-actions">
            <a class="contact-action contact-action--primary" href="tel:+18004928820">Call Now <SiteIcon name="arrow" /></a>
            <button class="contact-action" type="button" @click="copyContact(phone, 'phone')"><SiteIcon name="copy" />{{ copied === 'phone' ? 'Copied' : 'Copy Number' }}</button>
          </div>
        </article>

        <article class="contact-card">
          <div class="contact-card__heading"><span class="contact-symbol"><SiteIcon name="mail" /></span><p>GENERAL &amp; ENTERPRISE</p></div>
          <div class="contact-card__details">
            <h3>CORPORATE EMAIL ADDRESS</h3>
            <a class="contact-value" :href="'mailto:' + email">{{ email }}</a>
          </div>
          <p class="contact-note"><SiteIcon name="bolt" /><span>Typical response time within 2–4 business hours</span></p>
          <div class="contact-actions">
            <a class="contact-action contact-action--primary" :href="'mailto:' + email">Send Email <SiteIcon name="mail" /></a>
            <button class="contact-action" type="button" @click="copyContact(email, 'email')"><SiteIcon name="copy" />{{ copied === 'email' ? 'Copied' : 'Copy Email' }}</button>
          </div>
        </article>
      </section>
      <p v-if="copyError" class="copy-error" role="alert">{{ copyError }}</p>
      <p class="sr-only" role="status" aria-live="polite">{{ copied ? 'Copied to clipboard' : '' }}</p>
    </div>
  </main>
</template>

<script>
import SiteIcon from "@/components/SiteIcon.vue";

export default {
  name: "About",
  components: { SiteIcon },
  data: () => ({
    phone: "+1 (800) 492-8820",
    email: "contact@worldofgood.agency",
    copied: "",
    copyError: "",
    copyTimer: null,
  }),
  beforeDestroy() {
    clearTimeout(this.copyTimer);
  },
  methods: {
    async copyContact(value, type) {
      let success = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(value);
          success = true;
        } catch {
          success = false;
        }
      }
      if (!success) {
        const field = document.createElement("textarea");
        const focused = document.activeElement;
        field.value = value;
        field.readOnly = true;
        field.style.cssText = "position:fixed;opacity:0;pointer-events:none";
        document.body.appendChild(field);
        field.select();
        try {
          success = document.execCommand("copy");
        } catch {
          success = false;
        } finally {
          field.remove();
          if (focused) focused.focus();
        }
      }
      this.copyError = success ? "" : "Please select and copy the contact details manually.";
      if (success) {
        this.copied = type;
        clearTimeout(this.copyTimer);
        this.copyTimer = setTimeout(() => { this.copied = ""; }, 2000);
      }
    },
  },
};
</script>
