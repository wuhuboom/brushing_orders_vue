<template>
  <main class="das-page language-page">
    <DasPageHeader title-key="das.page.language" />
    <section class="language-body">
      <button
        v-for="item in visibleLanguages"
        :key="item.code"
        :class="{ active: selected === item.code }"
        @click="selected = item.code"
      >
        <span class="language-option">
          <span class="language-flag" aria-hidden="true">{{ item.flag }}</span>
          <span>{{ item.name }}</span>
        </span></button
      ><button class="confirm" @click="confirm">
        {{ $t("das.common.confirm") }}
      </button>
    </section>
    <p class="das-page-copyright">{{ $t("das.common.copyright") }}</p>
  </main>
</template>
<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { LANGS } from "@/config/lang";
import { useCommonStore } from "@/store/modules/common";
import { useLocale } from "@/util/useLocale";
import DasPageHeader from "@/components/DasPageHeader.vue";
import { safeBack } from "@/utils/navigation";
const commonStore = useCommonStore(),
  router = useRouter(),
  { locale } = useI18n(),
  { setLocale } = useLocale(),
  selected = ref(commonStore.clientLang || "en"),
  visibleLanguages = LANGS,
  confirm = () => {
    commonStore.updateLang(selected.value);
    locale.value = selected.value;
    setLocale(selected.value);
    safeBack(router, "/my");
  };
</script>
<style scoped>
.language-page {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.language-body {
  max-width: 760px;
  margin: auto;
  padding: 22px 30px 36px;
}
.language-body button {
  width: 100%;
  height: 58px;
  margin-bottom: 13px;
  border: 1px solid #d8dad4;
  border-radius: 16px;
  background: #fff;
  color: #17382d;
  font-weight: 800;
}
.language-option {
  display: inline-flex;
  align-items: center;
  gap: 11px;
}
.language-flag {
  font-size: 21px;
  line-height: 1;
}
.language-body button.active,
.language-body .confirm {
  border-color: #14392c;
  background: #14392c;
  color: #fff;
}
.language-body .confirm {
  margin-top: 13px;
  border-radius: 999px;
}
</style>
