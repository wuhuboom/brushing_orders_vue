<template>
  <main class="pc-public-shell">
    <PcPublicHeader :menu-open="menuOpen" @toggle-menu="menuOpen = !menuOpen" />
    <PcProfileMenu v-if="menuOpen" @close="menuOpen = false" />
    <slot />
    <div v-if="ticker" class="pc-public-shell__ticker" aria-hidden="true">
      <div>GET A FREE STRATEGY + AUDIT&nbsp;&nbsp;&nbsp; GET A FREE STRATEGY + AUDIT&nbsp;&nbsp;&nbsp;</div>
    </div>
    <button class="pc-public-shell__support" type="button" aria-label="Customer support" @click="support">
      <img src="@/static/pc/about/support.svg" alt="" />
    </button>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { safePush } from "@/utils/navigation";
import PcPublicHeader from "./PcPublicHeader.vue";
import PcProfileMenu from "./PcProfileMenu.vue";

defineProps({ ticker: { type: Boolean, default: false } });
const router = useRouter();
const menuOpen = ref(false);
const support = () => safePush(router, "/contact");
</script>

<style scoped>
.pc-public-shell {
  position: relative;
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  background: #000;
  color: #fff;
  font-family: -apple-system, system-ui, "Helvetica Neue", Helvetica, "Segoe UI", Arial, Roboto, "PingFang SC", miui, "Hiragino Sans GB", "Microsoft Yahei", sans-serif;
}
.pc-public-shell__ticker {
  position: fixed;
  z-index: 25;
  left: 0;
  bottom: 28px;
  width: 408px;
  overflow: hidden;
  transform: rotate(-3deg);
  background: #d2ff4f;
  color: #050505;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 800;
  line-height: 34px;
  letter-spacing: 0.04em;
}
.pc-public-shell__ticker div {
  width: max-content;
  animation: pc-ticker 8s linear infinite;
}
.pc-public-shell__support {
  position: fixed;
  z-index: 45;
  right: 28px;
  bottom: 28px;
  width: 80px;
  height: 80px;
  padding: 8px;
  border: 0;
  border-radius: 50%;
  background: #555;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.34);
}
.pc-public-shell__support img { width: 64px; height: 64px; display: block; }
@keyframes pc-ticker { to { transform: translateX(-50%); } }
</style>
