<template>
  <img
    class="poetic-glyph"
    :src="icons[name] || icons.chevron"
    alt=""
    aria-hidden="true"
    draggable="false"
  />
</template>
<script setup>
defineProps({ name: String });
const icons = {
  lock: "/design500/security.png",
  key: "/westermedia/key.png",
  pin: "/westermedia/fund-password.png",
  shield: "/design500/shield.png",
  user: "/westermedia/account.png",
  camera: "/westermedia/camera.png",
  chevron: "/westermedia/chevron.png",
  arrow: "/design500/arrow.png",
  incoming: "/westermedia/withdraw.png",
  history: "/westermedia/history.png",
  copy: "/westermedia/copy-order.png",
  eye: "/westermedia/balance-eye.png",
  support: "/design500/support.png",
  exit: "/westermedia/logout-dialog.png",
};
</script>
