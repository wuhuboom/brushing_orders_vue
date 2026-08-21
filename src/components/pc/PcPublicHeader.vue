<template>
  <header class="pc-header">
    <button class="pc-header__brand" type="button" @click="go('/account/login')">
      <img src="@/static/pc/dmk-logo.png" alt="DMK" />
    </button>
    <nav class="pc-header__nav" aria-label="Primary navigation">
      <button type="button" @click="go('/about')">About</button>
      <button
        class="pc-header__profile"
        type="button"
        :aria-expanded="menuOpen"
        @click="$emit('toggle-menu')"
      >
        Profile <span :class="{ 'is-open': menuOpen }">⌄</span>
      </button>
      <button class="pc-header__login" type="button" @click="go('/account/login')">
        Login
      </button>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { safePush } from "@/utils/navigation";

defineProps({ menuOpen: Boolean });
defineEmits(["toggle-menu"]);

const router = useRouter();
const go = (path) => safePush(router, path);
</script>

<style scoped>
.pc-header {
  position: relative;
  z-index: 40;
  width: min(100%, 1200px);
  height: 76px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}
.pc-header__brand,
.pc-header__nav button {
  border: 0;
  background: transparent;
  color: inherit;
}
.pc-header__brand {
  padding: 0;
}
.pc-header__brand img {
  width: 80px;
  height: auto;
  display: block;
}
.pc-header__nav {
  display: flex;
  align-items: center;
  gap: 32px;
}
.pc-header__nav button {
  padding: 10px 0;
  font-size: 18px;
}
.pc-header__profile {
  min-width: 84px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.pc-header__profile span {
  display: inline-block;
  transition: transform 0.2s ease;
}
.pc-header__profile span.is-open {
  transform: rotate(180deg);
}
.pc-header__nav .pc-header__login {
  width: 144px;
  height: 44px;
  padding: 0;
  border-radius: 999px;
  background: #46444c;
}
</style>
