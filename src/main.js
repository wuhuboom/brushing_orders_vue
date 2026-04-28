
import { createApp } from "vue";

import "./style.css";
import "./styles/theme.css";
import App from "./App.vue";
import PageTopBar from "@/components/PageTopBar.vue";
import "./index.css";
import pinia from "./store"; // 导入 Pinia
import router from "./router"; // 导入 Vue Router
import i18n from "./i18n/index";
import { initAPI, debugConfig } from "@/api";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import {
  Calendar,
  CountDown,
  NoticeBar,
  NavBar,
  Image as VanImage,
  List,
  Tab,
  Tabs,
  Button,
  Dialog,
  Sticky,
  Icon,
  Uploader,
  Field,
  Cell,
  CellGroup,
  Progress,
  Popup,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  Collapse,
  CollapseItem,
  PullRefresh,
  Tag,
  Toast,
  Loading,
  Picker,
  Swipe, SwipeItem,PasswordInput,NumberKeyboard 
} from "vant";
// 2. 引入组件样式
import "vant/lib/index.css";
import { Locale } from "vant";
import enUS from "vant/es/locale/lang/en-US";
import frFR from "vant/es/locale/lang/fr-FR";
import deDE from "vant/es/locale/lang/de-DE";
import itIT from "vant/es/locale/lang/it-IT";
import koKR from "vant/es/locale/lang/ko-KR";
import idID from "vant/es/locale/lang/id-ID";

const bootSplashStartedAt = Date.now();

function hideBootSplash() {
  const splash = document.getElementById("boot-splash");
  if (!splash) return;
  const elapsed = Date.now() - bootSplashStartedAt;
  const delay = Math.max(0, 900 - elapsed);
  window.setTimeout(() => {
    splash.classList.add("is-hidden");
    window.setTimeout(() => {
      splash.remove();
    }, 220);
  }, delay);
}

function applyRuntimeLayoutConfig() {
  const pcMaxWidth = window.g?.VITE_PC_MAX_WIDTH || "375px";
  document.documentElement.style.setProperty("--app-pc-max-width", pcMaxWidth);
}

async function loadConfig() {
  if (!window.g) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/config.js?t=" + Date.now();
      script.onload = resolve;
      script.onerror = () => reject("config.js 加载失败");
      document.head.appendChild(script);
    });
  }
}

async function bootstrap() {
  try {
    await loadConfig();
  } catch (error) {
    console.error("config.js load failed:", error);
  }
  applyRuntimeLayoutConfig();
  document.title = window.g?.VITE_TITLE || "";

  const app = createApp(App);
  app.component("PageTopBar", PageTopBar);
  // / 初始化全局 axios 实例
  const api = initAPI();
  app.config.globalProperties.$api = api; // Vue组件中可以 this.$api 使用
  debugConfig();
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  Locale.use("fr-FR", frFR);
  Locale.use("de-DE", deDE);
  Locale.use("it-IT", itIT);
  Locale.use("ko-KR", koKR);
  Locale.use("id-ID", idID);
  Locale.use("en-US", enUS);
  // setting一个全局的图片上传路径import.meta.env.VITE_UPLOAD_URL
  app.config.globalProperties.$uploadUrl = import.meta.env.VITE_UPLOAD_URL;
  app.use(i18n); // 使用 Vue I18n
  app.use(pinia); // 使用 Pinia
  app.use(router); // 使用 Vue Router
  app.use(Calendar);
  app.use(CountDown);
  app.use(NoticeBar);
  app.use(NavBar);
  app.use(VanImage);
  app.use(List);
  app.use(Tab);
  app.use(Tabs);
  app.use(Button);
  app.use(Dialog);
  app.use(Sticky);
  app.use(Icon);
  app.use(Uploader);
  app.use(Field);
  app.use(Cell);
  app.use(CellGroup);
  app.use(Progress);
  app.use(Popup);
  app.use(Radio);
  app.use(RadioGroup);
  app.use(Checkbox);
  app.use(CheckboxGroup);
  app.use(Collapse);
  app.use(CollapseItem);
  app.use(PullRefresh);
  app.use(Tag);
  app.use(Toast);
  app.use(Loading);
  app.use(Swipe);
  app.use(SwipeItem);
  app.use(PasswordInput);
  app.use(NumberKeyboard);
  app.use(Picker);
  // app.use(ElementPlus) // 使用 Element Plus
  await router.isReady();
  app.mount("#app");
  hideBootSplash();
}

bootstrap().catch((error) => {
  console.error("bootstrap failed:", error);
  hideBootSplash();
});
