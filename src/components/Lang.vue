<template>
  <van-popup
    v-model:show="show"
    round
    closeable
    position="bottom"
    class="language-popup"
    ><div class="language-inner">
      <h2>{{ $t("das.page.language") }}</h2>
      <button
        v-for="item in LANGS"
        :key="item.code"
        :class="{ active: commonStore.clientLang === item.code }"
        @click="change(item.code)"
      >
        <span>{{ item.name }}</span
        ><b>{{ commonStore.clientLang === item.code ? "✓" : "" }}</b>
      </button>
    </div></van-popup
  >
</template>
<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { LANGS } from "@/config/lang";
import { useCommonStore } from "@/store/modules/common";
import { useLocale } from "@/util/useLocale";
const show = ref(false),
  commonStore = useCommonStore(),
  { locale } = useI18n(),
  { setLocale } = useLocale();
const open = () => (show.value = true),
  close = () => (show.value = false);
const change = (code) => {
  commonStore.updateLang(code);
  locale.value = code;
  setLocale(code);
  close();
};
defineExpose({ open, close });
</script>
<style scoped>
.language-popup {
  width: min(100%, var(--das-app-max-width));
  left: 50%;
  transform: translateX(-50%);
  background: #f7f5ec;
}
.language-inner {
  padding: 38px 28px max(30px, env(safe-area-inset-bottom));
  color: #17382d;
}
.language-inner h2 {
  margin: 0 0 22px;
  text-align: center;
  font-size: 26px;
}
.language-inner button {
  width: 100%;
  height: 54px;
  padding: 0 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0;
  border-bottom: 1px solid #ddd;
  background: transparent;
  color: #17382d;
  font-size: 15px;
}
.language-inner button.active {
  font-weight: 800;
}
.language-inner b {
  color: #d88472;
}
</style>
