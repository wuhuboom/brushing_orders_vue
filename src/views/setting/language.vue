<template>
  <main class="das-page language-page">
    <DasPageHeader title-key="das.page.language" />
    <section class="poetic-language-current">
      <h2>{{ $t("das.vip.current") }}</h2>
      <div class="poetic-language-current__card">
        <span class="poetic-language-code">{{ currentCode.toUpperCase() }}</span
        ><strong>{{
          LANGS.find((item) => item.code === currentCode)?.name
        }}</strong
        ><i aria-hidden="true">✓</i>
      </div>
    </section>
    <section class="language-body">
      <h2>{{ $t("das.page.language") }}</h2>
      <TransitionGroup
        name="poetic-language"
        tag="div"
        class="poetic-language-list"
      >
        <button
          v-for="item in visibleLanguages"
          :key="item.code"
          :class="{ active: selectedCode === item.code }"
          :aria-pressed="selectedCode === item.code"
          @click="selectLanguage(item.code)"
        >
          <span class="poetic-language-code">{{ item.code.toUpperCase() }}</span
          ><span class="language-option"
            ><b>{{ item.name }}</b
            ><small>{{ item.code.toUpperCase() }}</small></span
          ><span class="poetic-language-check" aria-hidden="true">{{
            selectedCode === item.code ? "✓" : ""
          }}</span>
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
  visibleLanguages = computed(() =>
    LANGS.filter((item) => item.code !== currentCode.value),
  ),
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
let selectionTimer;
onBeforeUnmount(() => clearTimeout(selectionTimer));
</script>
