<template>
  <div class="das-footer-space" aria-hidden="true"></div>
  <nav class="das-footer" :aria-label="$t('das.dmk.primaryNavigation')">
    <button
      v-for="menu in menus"
      :key="menu.url"
      class="das-footer__item"
      :class="{ active: isActive(menu.url), center: menu.url === '/starting' }"
      type="button"
      @click="safeReplace(router, menu.url)"
    >
      <template v-if="menu.url === '/starting'">
        <span class="das-footer__mark"
          ><img src="@/static/das/wordmark-cream.png" alt=""
        /></span>
      </template>
      <template v-else
        ><img class="das-footer__badge" :src="badge(menu.url)" alt=""
      /></template>
      <span>{{ $t(menu.title) }}</span>
    </button>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import homeActive from "@/static/das/tab-home-badge-active.png";
import homeInactive from "@/static/das/tab-home-badge-inactive.png";
import recordsActive from "@/static/das/tab-records-badge-active.png";
import recordsInactive from "@/static/das/tab-records-badge-inactive.png";
import { safeReplace } from "@/utils/navigation";
const router = useRouter();
const route = useRoute();
const props = defineProps({ name: String });
const menus = [
  { title: "das.nav.home", url: "/" },
  { title: "das.nav.getStarted", url: "/starting" },
  { title: "das.nav.records", url: "/records" },
];
const isActive = (url) => (props.name || route.path) === url;
const badge = (url) =>
  url === "/"
    ? isActive(url)
      ? homeActive
      : homeInactive
    : isActive(url)
      ? recordsActive
      : recordsInactive;
</script>

<style scoped>
.das-footer-space {
  height: 96px;
}
.das-footer {
  position: fixed;
  z-index: 80;
  bottom: 0;
  left: 50%;
  width: min(100%, var(--das-app-max-width, 100%));
  height: 92px;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: end;
  padding: 7px 10px max(9px, env(safe-area-inset-bottom));
  background: #14392c;
  box-shadow: 0 -10px 30px rgba(20, 57, 44, 0.12);
}
.das-footer__item {
  position: relative;
  height: 77px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  border: 0;
  background: transparent;
  color: rgba(247, 245, 236, 0.52);
  font-size: 11px;
}
.das-footer__item.active {
  color: #fff;
  font-weight: 700;
}
.das-footer__badge {
  width: 48px;
  height: 52px;
  object-fit: contain;
}
.das-footer__mark {
  position: absolute;
  bottom: 28px;
  width: 68px;
  height: 68px;
  padding: 8px 17px;
  display: grid;
  place-items: center;
  border-radius: 50% 50% 12px 12px;
  background: #14392c;
}
.das-footer__mark img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
