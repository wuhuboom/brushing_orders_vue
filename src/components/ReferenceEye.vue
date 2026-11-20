<template>
  <img
    class="reference-eye"
    src="/westermedia/eye.png"
    :class="{ 'is-hidden': !visible }"
    alt=""
    aria-hidden="true"
    draggable="false"
  />
</template>
<script setup>
defineProps({ visible: Boolean });
</script>
