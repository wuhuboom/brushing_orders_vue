<template>
  <footer class="poetic-footer">
    <img src="/westermedia/logo.png" alt="WesterMedia" /><slot />
    <p>{{ $t(name === '/starting' ? 'das.design.cloudCertified' : 'das.common.copyright') }}</p>
  </footer>
</template>
<script setup>
defineProps({ name: String });
</script>
