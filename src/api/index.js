// api.js
import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";
import { showConfirmDialog, showToast } from "vant";
import pinia from "@/store/index.js";
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";
import { errorMessages } from "./errorCodeMap";
import i18n from "../i18n/index.js"; // 引入全局 i18n 实例

let api = null; // 延迟创建 axios 实例
let loading = null;

// 获取 BASEURL，确保 window.g 已加载
export function getBaseURL() {
  return window.g?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL;
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
        config.headers = {
          ...config.headers,
          authorization: userStore.token || "",
          lang: useCommonStore().clientLang,
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
        const config = response.config;
        if (config.loading === true && loading) {
          loading.close();
          loading = null;
        }

        if (response.status === 200) {
          const result = response.data;
          if (result.code === 200 || result.code === 201) {
            return result;
          } else if (result.code === 401) {
            useUserStore().logout();
            return Promise.reject(result);
          } else {
            if (config.showMsg) showToast(i18n.global.t(errorMessages[result.code]) || result.msg);
            return Promise.reject(result);
          }
        } else if (response.status === 401) {
          useUserStore().logout();
          return Promise.reject(response);
        } else {
          if (config.showMsg) showToast(response.status);
          return Promise.reject(response);
        }
      },
      (error) => {
        const config = error.config || {};
        if (config.loading === true && loading) {
          loading.close();
          loading = null;
        }
        if (error.status) useUserStore().logout();
        if (config.showMsg) showToast(error.message);
        return Promise.reject(error);
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
