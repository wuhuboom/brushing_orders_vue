<template>
  <img
    class="reference-eye"
    :src="visible ? '/westermedia/eye.png' : '/westermedia/eye-hidden.png'"
    :class="{ 'is-hidden': !visible }"
    alt=""
    aria-hidden="true"
    draggable="false"
  />
</template>
<script setup>
defineProps({ visible: Boolean });
</script>
