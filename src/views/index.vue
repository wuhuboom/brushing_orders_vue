<template>
  <main class="das-page bp-home-page psy-html-home">
    <HeaderTop />
    <iframe
      class="psy-home-document"
      src="/psybir/home/index.html"
      title="Local SEO"
      allow="autoplay"
    ></iframe>
    <Footer />
  </main>
</template>

<script setup>
import HeaderTop from "@/components/HeaderTop.vue";
import Footer from "@/components/Footer.vue";
</script>

<style scoped>
#router-view.psy-html-home {
  display: flex !important;
  flex-direction: column;
}

.psy-html-home > :deep(.das-header) {
  flex-shrink: 0;
}

.psy-home-document {
  display: block;
  flex: 1;
  width: 100%;
  min-height: 0;
  border: 0;
  background: #000;
}
</style>
