<template>
  <footer class="poetic-footer">
    <img src="/westermedia/logo.png" alt="WesterMedia" /><slot />
    <p>{{ $t("das.common.copyright") }}</p>
  </footer>
</template>
<script setup>
defineProps({ name: String });
</script>
