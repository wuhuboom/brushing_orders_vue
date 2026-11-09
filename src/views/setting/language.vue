<template>
  <main class="das-page language-page">
    <DasPageHeader title-key="das.page.language" />
    <section class="language-body">
      <header class="language-list-heading">
        <h2>{{ $t("das.common.allLanguages") }}</h2>
        <span>{{
          $t("das.common.supportedLanguages", { count: LANGS.length })
        }}</span>
      </header>
      <TransitionGroup
        name="poetic-language"
        tag="div"
        class="poetic-language-list"
      >
        <button
          v-for="item in LANGS"
          :key="item.code"
          :class="{ active: (selectedCode || currentCode) === item.code }"
          :aria-pressed="(selectedCode || currentCode) === item.code"
          @click="selectLanguage(item.code)"
        >
          <span class="poetic-language-code">{{
            item.code.toUpperCase()
          }}</span>
          <span class="language-option">
            <b>{{ item.name }}</b>
            <small>{{ languageDescriptions[item.code] }}</small>
          </span>
          <span class="poetic-language-check" aria-hidden="true">
            <img
              v-if="(selectedCode || currentCode) === item.code"
              src="/design500/check-selected.png"
              alt=""
            />
          </span>
        </button>
      </TransitionGroup>
    </section>
    <p class="das-page-copyright">{{ $t("das.common.copyright") }}</p>
  </main>
</template>

<script setup>
import { onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { LANGS } from "@/config/lang";
import { useCommonStore } from "@/store/modules/common";
import { useLocale } from "@/util/useLocale";
import DasPageHeader from "@/components/DasPageHeader.vue";
const commonStore = useCommonStore(),
  { locale } = useI18n(),
  { setLocale } = useLocale(),
  currentCode = ref(commonStore.clientLang || "en"),
  selectedCode = ref(""),
  selectLanguage = (code) => {
    clearTimeout(selectionTimer);
    selectedCode.value = code;
    commonStore.updateLang(code);
    locale.value = code;
    setLocale(code);
    selectionTimer = setTimeout(() => {
      currentCode.value = code;
      selectedCode.value = "";
    }, 280);
  };
const languageDescriptions = {
  en: "US / English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  ko: "Korean",
  ja: "Japanese",
  id: "Indonesian",
};
let selectionTimer;
onBeforeUnmount(() => clearTimeout(selectionTimer));
</script>
