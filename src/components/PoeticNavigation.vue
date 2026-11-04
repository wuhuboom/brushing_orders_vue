<template>
  <div
    ref="root"
    class="poetic-navigation"
    :data-open="expanded || null"
    @keydown.esc.stop="close"
  >
    <button
      class="poetic-navigation-toggle"
      type="button"
      aria-label="Menu"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    ></button>
    <Transition name="poetic-menu">
      <nav v-if="expanded" class="das-footer" aria-label="Primary navigation">
        <button
          v-for="menu in menus"
          :key="menu.url"
          class="das-footer__item"
          :class="{ 'das-footer__item--active': route.path === menu.url }"
          type="button"
          :aria-current="route.path === menu.url ? 'page' : undefined"
          @click="
            close();
            safeReplace(router, menu.url);
          "
        >
          {{ $t(menu.title) }}
        </button>
      </nav>
    </Transition>
  </div>
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { safeReplace } from "@/utils/navigation";
const router = useRouter(),
  route = useRoute();
const menus = [
  { title: "das.nav.home", url: "/" },
  { title: "das.nav.getStarted", url: "/starting" },
  { title: "das.nav.records", url: "/records" },
];
const root = ref(null);
const expanded = ref(false);
const close = () => {
  expanded.value = false;
};
const closeOutside = (event) => {
  if (!root.value?.contains(event.target)) close();
};
onMounted(() => {
  document.addEventListener("pointerdown", closeOutside, true);
  window.addEventListener("blur", close);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", closeOutside, true);
  window.removeEventListener("blur", close);
});
</script>
