<template>
  <footer class="poetic-footer">
    <img src="/design500/logo-white.png" alt="500 Designs" /><slot />
    <p>{{ $t("das.common.copyright") }}</p>
  </footer>
</template>
<script setup>
defineProps({ name: String });
</script>
