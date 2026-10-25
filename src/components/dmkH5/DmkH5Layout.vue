<template>
  <div class="dmk-h5-only w-full min-h-[100vh] bg-[#000] text-white">
    <DmkH5Header
      v-if="header"
      :authenticated="authenticated"
      :menu-initially-open="menuInitiallyOpen"
      :profile-initially-open="profileInitiallyOpen"
    />
    <slot />
    <DmkFooter v-if="footer" />
  </div>
</template>
<script setup>
import DmkH5Header from "./DmkH5Header.vue";
import DmkFooter from "@/components/dmk/DmkFooter.vue";
defineProps({
  authenticated: { type: Boolean, default: undefined },
  header: { type: Boolean, default: true },
  footer: { type: Boolean, default: true },
  menuInitiallyOpen: { type: Boolean, default: false },
  profileInitiallyOpen: { type: Boolean, default: false },
});
</script>
