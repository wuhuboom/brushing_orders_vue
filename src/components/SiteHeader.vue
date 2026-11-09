<template>
  <header class="site-header" :class="{ 'site-header--about': $route.name === 'about' }">
    <div class="site-header__inner">
      <router-link class="brand" to="/" aria-label="World of Good home">
        <img src="worldofgood/logo.png" alt="World of Good Agency" width="169" height="45" />
      </router-link>
      <nav class="site-nav" aria-label="Main navigation">
        <router-link to="/" exact active-class="is-active">Home</router-link>
        <router-link to="/about" active-class="is-active">About Us</router-link>
      </nav>
      <div class="header-actions">
        <button class="contact-button" type="button" :disabled="!redirectUrl" @click="goToConfiguredUrl">
          Contact Us <SiteIcon name="arrow" />
        </button>
        <button class="account-button" type="button" aria-label="Account" :disabled="!redirectUrl" @click="goToConfiguredUrl">
          <SiteIcon name="user" />
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import SiteIcon from "./SiteIcon.vue";

export default {
  name: "SiteHeader",
  components: { SiteIcon },
  computed: {
    redirectUrl() {
      return ((window.APP_CONFIG && window.APP_CONFIG.redirectUrl) || "").trim();
    },
  },
  methods: {
    goToConfiguredUrl() {
      if (this.redirectUrl) window.location.assign(this.redirectUrl);
    },
  },
};
</script>
