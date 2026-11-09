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
  key: "/design500/key.png",
  pin: "/design500/pin.png",
  shield: "/design500/shield.png",
  user: "/design500/user.png",
  camera: "/design500/camera.png",
  chevron: "/design500/chevron.png",
  arrow: "/design500/arrow.png",
  incoming: "/design500/withdraw.png",
  history: "/design500/history.png",
  copy: "/design500/copy.png",
  eye: "/design500/eye.png",
  support: "/design500/support.png",
  exit: "/design500/logout-dialog.png",
};
</script>
