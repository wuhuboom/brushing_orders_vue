<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <router-link to="/" class="footer-brand" aria-label="World of Good home">
        <img src="worldofgood/logo-white.png" alt="World of Good Agency" width="136" height="36" />
      </router-link>
      <p>© 2026 worldofgood, Inc., All right reserved</p>
      <nav aria-label="Footer navigation">
        <router-link to="/" exact active-class="is-active">Home</router-link>
        <router-link to="/about" active-class="is-active">About Us</router-link>
      </nav>
    </div>
  </footer>
</template>

<script>
export default { name: "SiteFooter" };
</script>
