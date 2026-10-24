<template>
  <img
    class="reference-eye"
    :src="visible ? '/psybir/eye-visible.png' : '/psybir/eye-hidden.png'"
    alt=""
    aria-hidden="true"
    draggable="false"
  />
</template>
<script setup>
defineProps({ visible: Boolean });
</script>
