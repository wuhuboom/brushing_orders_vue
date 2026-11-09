<template>
  <main class="das-page bp-home-page psy-html-home">
    <HeaderTop />
    <iframe
      class="psy-home-document"
      :src="`${baseUrl}design500/home.html`"
      title="500 Designs homepage"
    ></iframe>
  </main>
</template>

<script setup>
import HeaderTop from "@/components/HeaderTop.vue";

const baseUrl = import.meta.env.BASE_URL;
</script>

<style scoped>
#app #router-view.psy-html-home {
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
}
</style>
