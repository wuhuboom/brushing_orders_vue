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

const requestLoadingSvg = `
<defs>
  <linearGradient id="appWaveLoadingGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#8af3ff"/>
    <stop offset="34%" stop-color="#4b97ff"/>
    <stop offset="68%" stop-color="#2f7bff"/>
    <stop offset="100%" stop-color="#3543ec"/>
  </linearGradient>
  <filter id="appWaveLoadingShadow" x="-40%" y="-40%" width="180%" height="200%">
    <feDropShadow dx="0" dy="9" stdDeviation="6" flood-color="#2f7bff" flood-opacity="0.22"/>
  </filter>
</defs>
<ellipse cx="59" cy="63" rx="42" ry="7" fill="#2f7bff" fill-opacity="0.08"/>
<g filter="url(#appWaveLoadingShadow)">
  <rect x="17" y="35" width="6" height="14" rx="3" fill="url(#appWaveLoadingGradient)"/>
  <rect x="28" y="31" width="6" height="22" rx="3" fill="url(#appWaveLoadingGradient)"/>
  <rect x="39" y="24" width="6" height="32" rx="3" fill="url(#appWaveLoadingGradient)"/>
  <rect x="50" y="16" width="7" height="42" rx="3.5" fill="url(#appWaveLoadingGradient)"/>
  <rect x="62" y="10" width="7" height="52" rx="3.5" fill="url(#appWaveLoadingGradient)"/>
  <rect x="74" y="16" width="7" height="42" rx="3.5" fill="url(#appWaveLoadingGradient)"/>
  <rect x="85" y="24" width="6" height="32" rx="3" fill="url(#appWaveLoadingGradient)"/>
  <rect x="96" y="31" width="6" height="22" rx="3" fill="url(#appWaveLoadingGradient)"/>
  <rect x="107" y="35" width="6" height="14" rx="3" fill="url(#appWaveLoadingGradient)"/>
</g>`;

const requestLoadingHtml = `
<div class="app-request-loading__wave" aria-hidden="true">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>`;

function renderRequestLoadingWave() {
  if (typeof document === "undefined") return;
  window.requestAnimationFrame(() => {
    const spinner = document.querySelector(
      ".app-wave-loading-mask .el-loading-spinner",
    );
    if (spinner) {
      spinner.innerHTML = requestLoadingHtml;
    }
  });
}

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

function shouldSkipUnauthorizedRedirect(config = {}) {
  return config.skipUnauthorizedRedirect === true;
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
          loading = ElLoading.service({
            fullscreen: true,
            background: "#ffffff",
            customClass: "app-wave-loading-mask",
            svg: requestLoadingSvg,
            svgViewBox: "0 0 118 76",
          });
          renderRequestLoadingWave();
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
          if (!shouldSkipUnauthorizedRedirect(config)) {
            handleUnauthorized();
          }
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
          if (!shouldSkipUnauthorizedRedirect(config)) {
            handleUnauthorized();
          }
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
