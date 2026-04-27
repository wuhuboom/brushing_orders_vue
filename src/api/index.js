// api.js
import axios from "axios";
import { ElLoading } from "element-plus";
import { showToast } from "@/util/message";
import pinia from "@/store/index.js";
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";
import router from "@/router/index.js";
import { errorMessages } from "./errorCodeMap";
import i18n from "../i18n/index.js"; // 引入全局 i18n 实例

let api = null; // 延迟创建 axios 实例
let loading = null;
let isHandlingUnauthorized = false;

// 获取 BASEURL，确保 window.g 已加载
export function getBaseURL() {
  return window.g?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL;
}

function closeRequestLoading(config = {}) {
  if (config.loading === true && loading) {
    loading.close();
    loading = null;
  }
}

function getResponseCode(data) {
  return data?.code ?? data?.status ?? data?.statusCode;
}

function isUnauthorizedResponse(data, status) {
  return Number(status) === 401 || Number(getResponseCode(data)) === 401;
}

function getResponseMessage(data, fallback = "") {
  return data?.message || data?.msg || fallback;
}

function getTranslatedMessage(data, fallback = "") {
  const code = getResponseCode(data);
  const key = errorMessages[code];
  return (key && i18n.global.t(key)) || getResponseMessage(data, fallback);
}

function clearLoginState() {
  const userStore = useUserStore(pinia);
  userStore.token = "";
  userStore.userInfo = {};
  userStore.allWallet = [];
  userStore.userWallerType = {};
}

function handleUnauthorized() {
  clearLoginState();

  if (isHandlingUnauthorized) return;
  isHandlingUnauthorized = true;

  Promise.resolve()
    .then(() => {
      if (router.currentRoute.value.path === "/account/login") return;
      return router.replace({ path: "/account/login" }).catch(() => {});
    })
    .finally(() => {
      isHandlingUnauthorized = false;
    });
}

// 初始化 axios 实例（在 main.js 等待 config.js 加载后调用）
export function initAPI() {
  if (!api) {
    api = axios.create({
      baseURL: getBaseURL(),
      timeout: 20000,
    });

    // 请求拦截器
    api.interceptors.request.use(
      (config) => {
        if (config.loading === true) {
          if (loading) {
            loading.close();
            loading = null;
          }
          loading = ElLoading.service({ fullscreen: true });
        }

        const userStore = useUserStore(pinia);
        const commonStore = useCommonStore(pinia);

        config.headers = {
          ...config.headers,
          authorization: userStore.token || "",
          lang: commonStore.clientLang,
        };

        // 添加请求参数
        if (config.method === "get") {
          config.params = {
            ...config.params,
          };
        } else {
          config.data = {
            ...config.data,
          };
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    api.interceptors.response.use(
      (response) => {
        const config = response.config || {};
        closeRequestLoading(config);

        const result = response.data;
        const status = response.status;

        if (isUnauthorizedResponse(result, status)) {
          handleUnauthorized();
          return Promise.reject(result || response);
        }

        if (status >= 200 && status < 300) {
          const code = getResponseCode(result);
          if (Number(code) === 200 || Number(code) === 201) {
            return result;
          }

          if (config.showMsg) showToast(getTranslatedMessage(result));
          return Promise.reject(result);
        }

        if (config.showMsg) showToast(status);
        return Promise.reject(response);
      },
      (error) => {
        const config = error.config || {};
        closeRequestLoading(config);

        const response = error.response || {};
        const result = response.data || error.data;
        const status = response.status ?? error.status;

        if (isUnauthorizedResponse(result, status)) {
          handleUnauthorized();
          return Promise.reject(result || error);
        }

        if (config.showMsg) showToast(getResponseMessage(result, error.message));
        return Promise.reject(result || error);
      }
    );
  }

  return api;
}

// 调试 window.g
export function debugConfig() {
  console.log("window.g:", window.g);
}

export default api; // 注意：在 main.js 调用 initAPI() 后再使用 api
