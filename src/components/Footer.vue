<template>
  <footer class="poetic-footer">
    <img src="/poetic/footer-mark.png" alt="Poetic" /><slot />
    <p>{{ $t("das.common.copyright") }}</p>
  </footer>
</template>
<script setup>
defineProps({ name: String });
</script>
