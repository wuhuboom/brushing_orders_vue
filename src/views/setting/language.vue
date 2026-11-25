<template>
  <main class="das-page language-page">
    <DasPageHeader title-key="das.page.language" />
    <section class="language-body">
      <div class="language-region-tabs" role="tablist" :aria-label="$t('das.page.language')">
        <button
          v-for="region in regions"
          :key="region.code"
          type="button"
          role="tab"
          :aria-selected="activeRegion === region.code"
          :class="{ active: activeRegion === region.code }"
          @click="activeRegion = region.code"
        >{{ $t(region.label) }}<template v-if="region.code === 'all'"> ({{ LANGS.length }})</template></button>
      </div>
      <TransitionGroup
        name="poetic-language"
        tag="div"
        class="poetic-language-list"
      >
        <button
          v-for="item in filteredLanguages"
          :key="item.code"
          :class="{ active: (selectedCode || currentCode) === item.code }"
          :aria-pressed="(selectedCode || currentCode) === item.code"
          @click="selectLanguage(item.code)"
        >
          <span class="poetic-language-code">{{
            item.code.toUpperCase()
          }}</span>
          <span class="language-option">
            <b>{{ item.name }} <small v-if="item.code === 'en'" class="language-default">{{ $t('das.form.default') }}</small></b>
            <small>{{ languageDescriptions[item.code] }}</small>
          </span>
          <span class="poetic-language-check" aria-hidden="true">
            <img
              v-if="(selectedCode || currentCode) === item.code"
              src="/westermedia/tick.png"
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
import { computed, onBeforeUnmount, ref } from "vue";
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
const activeRegion = ref("all");
const regions = [
  { code: "all", label: "das.common.allLanguages" },
  { code: "americasEurope", label: "das.design.languageAmericasEurope" },
  { code: "asiaPacific", label: "das.design.languageAsiaPacific" },
];
const asiaPacificCodes = new Set(["ja", "ko", "id"]);
const filteredLanguages = computed(() => {
  if (activeRegion.value === "all") return LANGS;
  return LANGS.filter((item) => asiaPacificCodes.has(item.code) === (activeRegion.value === "asiaPacific"));
});
const languageDescriptions = {
  en: "US / English",
  es: "Spanish",
  mx: "Spanish / Mexico",
  cl: "Spanish / Chile",
  co: "Spanish / Colombia",
  fr: "French",
  de: "German",
  it: "Italian",
  ko: "Korean",
  ja: "Japanese",
  id: "Indonesian",
  zh: "Simplified Chinese",
  sv: "Swedish",
  no: "Norwegian",
  ru: "Russian",
  hu: "Hungarian",
  pl: "Polish",
  sl: "Slovak",
};
let selectionTimer;
onBeforeUnmount(() => clearTimeout(selectionTimer));
</script>
