<template>
  <div ref="root" class="auth-language" @keydown.esc.stop="close">
    <button
      class="language-button"
      type="button"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="open = !open"
    >
      <span class="language-globe"><img src="/poetic/globe.png" alt="" /></span>
      <span>{{ language.toUpperCase() }}</span>
      <span class="language-chevron" aria-hidden="true"></span>
    </button>
    <div
      v-if="open"
      class="language-menu"
      role="listbox"
      :aria-label="$t('das.page.language')"
    >
      <button
        v-for="item in LANGS"
        :key="item.code"
        type="button"
        role="option"
        :aria-selected="language === item.code"
        :class="{ active: language === item.code }"
        @click="changeLanguage(item.code)"
      >
        <span>{{ item.name }}</span>
      </button>
    </div>
  </div>
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { LANGS } from "@/config/lang";
import { useCommonStore } from "@/store/modules/common";
import { useLocale } from "@/util/useLocale";

const commonStore = useCommonStore();
const { locale } = useI18n();
const { setLocale } = useLocale();
const root = ref(null);
const open = ref(false);
const language = computed(() => commonStore.clientLang || "en");
const close = () => (open.value = false);
const closeOutside = (event) => {
  if (!root.value?.contains(event.target)) close();
};
const changeLanguage = (code) => {
  commonStore.updateLang(code);
  locale.value = code;
  setLocale(code);
  close();
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
