<template>
  <img
    class="reference-eye"
    src="/design500/eye-input.png"
    :class="{ 'is-hidden': !visible }"
    alt=""
    aria-hidden="true"
    draggable="false"
  />
</template>
<script setup>
defineProps({ visible: Boolean });
</script>
