<template>
  <div class="das-footer-space" aria-hidden="true"></div>
  <nav class="das-footer" aria-label="Primary navigation">
    <button
      v-for="menu in menus"
      :key="menu.url"
      class="das-footer__item"
      :class="{
        'das-footer__item--active': isActive(menu.url),
        'das-footer__item--center': menu.url === '/starting',
      }"
      type="button"
      :aria-current="isActive(menu.url) ? 'page' : undefined"
      @click="safeReplace(router, menu.url)"
    >
      <template v-if="menu.url === '/starting'">
        <span class="das-footer__brain">
          <img :src="footerIcon(menu.url)" alt="" />
        </span>
      </template>
      <template v-else>
        <img class="das-footer__line-icon" :src="footerIcon(menu.url)" alt="" />
      </template>
      <span>{{ $t(menu.title) }}</span>
    </button>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { safeReplace } from "@/utils/navigation";
import homeActive from "@/static/brain/footer-home-active.png";
import homeInactive from "@/static/brain/footer-home-inactive.png";
import brainActive from "@/static/brain/footer-brain-active.png";
import brainInactive from "@/static/brain/footer-brain-inactive.png";
import recordsActive from "@/static/brain/footer-records-active.png";
import recordsInactive from "@/static/brain/footer-records-inactive.png";
const router = useRouter();
const route = useRoute();
const props = defineProps({ name: String });
const menus = [
  { title: "das.nav.home", url: "/" },
  { title: "das.nav.getStarted", url: "/starting" },
  { title: "das.nav.records", url: "/records" },
];
const isActive = (url) => (props.name || route.path) === url;
const footerIcon = (url) => {
  const active = isActive(url);
  if (url === "/") return active ? homeActive : homeInactive;
  if (url === "/starting") return active ? brainActive : brainInactive;
  return active ? recordsActive : recordsInactive;
};
</script>

<style scoped>
.das-footer-space {
  height: calc(94px + env(safe-area-inset-bottom));
}
.das-footer {
  position: fixed;
  z-index: 80;
  bottom: 0;
  left: 50%;
  width: min(100%, var(--das-app-max-width, 960px));
  height: calc(94px + env(safe-area-inset-bottom));
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: end;
  padding: 9px 10px max(15px, env(safe-area-inset-bottom));
  border: 1px solid #173a70;
  border-bottom: 0;
  border-radius: 24px 24px 0 0;
  background: #081123;
  box-shadow:
    0 -12px 34px rgba(0, 0, 0, 0.32),
    inset 0 1px 12px rgba(9, 83, 196, 0.08);
  font-family: "SF Pro Display", Arial, sans-serif;
}
.das-footer > .das-footer__item {
  position: relative;
  min-width: 0;
  height: 69px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 7px;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: #63a9ff;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  cursor: pointer;
  appearance: none;
}
.das-footer > .das-footer__item--active {
  color: #086cff;
}
.das-footer__line-icon {
  width: 32px;
  height: 32px;
  display: block;
  flex: 0 0 28px;
  margin-bottom: 5px;
  object-fit: contain;
}
.das-footer > .das-footer__item--center {
  text-transform: uppercase;
}
.das-footer__brain {
  position: absolute;
  left: 50%;
  bottom: 20px;
  width: 90px;
  height: 90px;
  padding: 0;
  display: grid;
  place-items: center;
  transform: translateX(-50%);
  border: 0;
  border-radius: 50%;
  background: transparent;
  box-shadow: none;
}
.das-footer__brain img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

</style>
