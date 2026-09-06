<template>
  <div id="router-view" class="hide-scroll overflow-y-auto">
    <router-view />
  </div>
  <DmkSupport class="dmk-h5-only" />
  <DmkCustomerServiceDialog v-model:show="showCustomerService" />
  <WebsiteSplashAd />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import WebsiteSplashAd from "@/components/WebsiteSplashAd.vue";
import DmkSupport from "@/components/dmk/DmkSupport.vue";
import DmkCustomerServiceDialog from "@/components/dmk/DmkCustomerServiceDialog.vue";
import { CUSTOMER_SERVICE_DIALOG_EVENT } from "@/utils/customerServiceDialog";
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";
import { useLocale } from "@/util/useLocale";
import BigNumber from "bignumber.js";
const configuredWidth = window.g?.APP_MAX_WIDTH || "100%";
const showCustomerService = ref(false);
const handleCustomerServiceOpen = () => {
  showCustomerService.value = true;
};
onMounted(() => {
  window.addEventListener(
    CUSTOMER_SERVICE_DIALOG_EVENT,
    handleCustomerServiceOpen,
  );
});
onBeforeUnmount(() => {
  window.removeEventListener(
    CUSTOMER_SERVICE_DIALOG_EVENT,
    handleCustomerServiceOpen,
  );
});
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
const { setLocale } = useLocale();
if (userStore.token) {
  userStore.getUserInfo();
}
userStore.getZone();
const initialLocale = setLocale(commonStore.lang || "en");
if (initialLocale !== commonStore.lang) commonStore.updateLang(initialLocale);
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
