<template>
  <router-view class="hide-scroll overflow-y-auto" id="router-view" />
</template>

<script setup>
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";
import { useI18n } from "vue-i18n";
import { useLocale } from "@/util/useLocale";
import BigNumber from "bignumber.js";
const configuredWidth = window.g?.APP_MAX_WIDTH || "960px";
document.documentElement.style.setProperty(
  "--das-app-max-width",
  /^\d+$/.test(String(configuredWidth))
    ? `${configuredWidth}px`
    : configuredWidth,
);
// 在文件顶部添加BigNumber全局配置
BigNumber.config({
  DECIMAL_PLACES: 10, // 全局设置保留10位小数
  ROUNDING_MODE: BigNumber.ROUND_DOWN, // 设置舍入模式为向下取整
  ERRORS: false, // 禁用错误提示
});
// import webSocket from '@/common/webSocket'; // socket启动
const userStore = useUserStore();
const commonStore = useCommonStore();
// commonStore.getSystemConfig();
const { locale } = useI18n();
const { setLocale } = useLocale();
if (userStore.token) {
  userStore.getUserInfo();
}
userStore.getZone();
if (commonStore.lang) {
  locale.value = commonStore.lang;
  setLocale(commonStore.lang);
}
</script>

<style>
.el-divider {
  margin: 0 !important;
}

:deep(.el-input__wrapper) {
  background-color: #ececec !important;
  box-shadow: none !important;
  font-size: 16px;
}

:deep(.el-input__wrapper:focus-visible) {
  outline: none !important;
}

:deep(.is-focus) {
  box-shadow: none !important;
}

.container {
  /* max-width: 1440px; */
}

/* .text-black {
  color: #303133 !important;
} */

.el-drawer {
  border-top-left-radius: 20px !important;
  border-top-right-radius: 20px !important;
}

.el-drawer__body {
  color: #303133 !important;
}

.el-drawer__header {
  color: #303133 !important;
}

.button-bg {
  background-image: url(@/static/images/block-bg.png);
  background-size: 100% auto;
  background-repeat: no-repeat;
}

.box-shadow {
  box-shadow: 0px 3px 8px 0 rgba(0, 0, 0, 0.16);
}

.hide-scroll::-webkit-scrollbar {
  display: none;
}
</style>
