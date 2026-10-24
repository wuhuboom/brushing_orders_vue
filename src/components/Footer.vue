<template>
  <div class="das-footer-space" aria-hidden="true"></div>
  <nav class="das-footer tab-bar-layout__bar" aria-label="Primary navigation">
    <button
      v-for="menu in menus"
      :key="menu.url"
      class="das-footer__item tab-bar-layout__item"
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
          <img
            :src="
              isActive(menu.url)
                ? '/psybir/started-active.png'
                : '/psybir/started-inactive.png'
            "
            alt=""
          />
        </span>
      </template>
      <template v-else>
        <img
          class="das-footer__line-icon"
          :src="
            menu.url === '/'
              ? isActive(menu.url)
                ? '/psybir/home-active.png'
                : '/psybir/home-inactive.png'
              : isActive(menu.url)
                ? '/psybir/records-active.png'
                : '/psybir/records-inactive.png'
          "
          alt=""
        />
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
