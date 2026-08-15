import axios from "axios";
import { ElLoading, ElMessage } from "element-plus";
import pinia from "@/store/index.js";
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";
import { errorMessages } from "./errorCodeMap";
import i18n from "@/i18n/index.js";

const runtimeConfig = window.g || {};
const api = axios.create({
  baseURL: runtimeConfig.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
});
const languageMap = {
  en: "en_US",
  es: "es_ES",
  zh: "zh_CN",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
  ko: "ko_KR",
  ja: "ja_JP",
  id: "id_ID",
};

let loading;
const closeLoading = () => {
  loading?.close();
  loading = null;
};

api.interceptors.request.use((config) => {
  if (config.loading) {
    closeLoading();
    loading = ElLoading.service({ fullscreen: true });
  }

  const userStore = useUserStore(pinia);
  const commonStore = useCommonStore(pinia);
  config.headers = config.headers || {};
  if (userStore.token) config.headers.Authorization = userStore.token;
  const apiLanguage =
    languageMap[commonStore.clientLang] || commonStore.clientLang || "en_US";
  config.headers.lang = apiLanguage;
  config.headers["Accept-Language"] = apiLanguage.replace("_", "-");

  if (config.method?.toLowerCase() === "get") {
    config.params = { lang: apiLanguage, ...(config.params || {}) };
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.config?.loading) closeLoading();
    if (response.status === 204) return { code: 200, msg: "", data: null };

    const result = response.data;
    if (!result || typeof result !== "object" || result.code === undefined)
      return result;
    if ([200, 201].includes(Number(result.code))) return result;

    if (Number(result.code) === 401) useUserStore(pinia).logout(false);
    if (response.config?.showMsg) {
      const key = errorMessages[result.code];
      ElMessage.error(
        (key && i18n.global.t(key)) ||
          result.msg ||
          result.message ||
          i18n.global.t("das.common.requestFailed"),
      );
    }
    return Promise.reject(result);
  },
  (error) => {
    if (error.config?.loading) closeLoading();
    if (error.response?.status === 401) useUserStore(pinia).logout(false);
    if (error.config?.showMsg) {
      ElMessage.error(
        error.response?.data?.msg ||
          error.response?.data?.message ||
          error.message ||
          i18n.global.t("das.common.requestFailed"),
      );
    }
    return Promise.reject(error);
  },
);

export default api;
