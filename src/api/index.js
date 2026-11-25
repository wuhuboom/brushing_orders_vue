import axios from "axios";
import { ElMessage } from "element-plus";
import pinia from "@/store/index.js";
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";
import { errorMessages } from "./errorCodeMap";
import i18n from "@/i18n/index.js";
import { normalizeHttpError } from "@/utils/apiError";
import { normalizeLocale } from "@/config/lang";

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
  mx: "mx",
  cl: "cl",
  co: "co",
  sv: "sv_SE",
  no: "no_NO",
  ru: "ru_RU",
  hu: "hu_HU",
  pl: "pl_PL",
  sl: "sk_SK",
};

api.interceptors.request.use((config) => {
  const userStore = useUserStore(pinia);
  const commonStore = useCommonStore(pinia);
  config.headers = config.headers || {};
  if (userStore.token) config.headers.Authorization = userStore.token;
  const code = normalizeLocale(commonStore.clientLang);
  const apiLanguage = languageMap[code];
  const isRegionalSpanish = ["mx", "cl", "co"].includes(code);
  config.headers.lang = apiLanguage;
  config.headers["Accept-Language"] = isRegionalSpanish
    ? `es-${code.toUpperCase()}`
    : apiLanguage.replace("_", "-");

  if (isRegionalSpanish || config.method?.toLowerCase() === "get") {
    config.params = { ...config.params, lang: apiLanguage };
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
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
    const normalizedError = normalizeHttpError(error);
    if (error.response?.status === 401) useUserStore(pinia).logout(false);
    if (error.config?.showMsg) {
      const key = errorMessages[normalizedError?.code];
      ElMessage.error(
        (key && i18n.global.t(key)) ||
          normalizedError?.msg ||
          normalizedError?.message ||
          error.message ||
          i18n.global.t("das.common.requestFailed"),
      );
    }
    return Promise.reject(normalizedError);
  },
);

export default api;
