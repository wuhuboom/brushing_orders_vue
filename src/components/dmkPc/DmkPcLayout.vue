<template>
  <div
    v-if="isDesktop"
    class="dmk-pc-only dmk-pc-page w-full min-h-[100vh] bg-[#000]"
  >
    <div class="w-full min-h-[100vh] dmk-site-scope">
      <DmkPcHeader :authenticated="authenticated" />
      <slot />
      <DmkFooter v-if="footer" />
    </div>
    <DmkSupport v-if="support" />
  </div>
</template>
<script setup>
import { onBeforeUnmount, ref } from "vue";
import DmkPcHeader from "./DmkPcHeader.vue";
import DmkFooter from "@/components/dmk/DmkFooter.vue";
import DmkSupport from "@/components/dmk/DmkSupport.vue";
import { getPcBreakpoint } from "@/responsiveMode";
defineProps({
  authenticated: { type: Boolean, default: undefined },
  footer: { type: Boolean, default: true },
  support: { type: Boolean, default: true },
});

const desktopQuery = window.matchMedia(`(min-width: ${getPcBreakpoint()}px)`);
const isDesktop = ref(desktopQuery.matches);
const syncDesktop = (event) => {
  isDesktop.value = event.matches;
};
desktopQuery.addEventListener?.("change", syncDesktop);
onBeforeUnmount(() =>
  desktopQuery.removeEventListener?.("change", syncDesktop),
);
</script>
