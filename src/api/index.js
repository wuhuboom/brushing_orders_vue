// api.js
import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";
import pinia from "@/store/index.js";
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
});

let loading = null;

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
    // config.headers["authorization"] = userStore.token || "";
    // config.headers["lang"] = useCommonStore().clientLang;
    config.headers = {
      ...config.headers, // 先保留已有的 headers
      authorization: userStore.token || "",
      lang: useCommonStore().clientLang
    };

    // 添加accountType到请求参数
    console.log(config.url);
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

api.interceptors.response.use(
  (response) => {
    console.log(response.status);
    const config = response.config;
    if (config.loading === true && loading) {
      loading.close();
      loading = null;
    }
    if (response.status == 200) {
      let result = response.data;
      if (result.code == 200) {
        return result;
      } else if(result.code == 201) {
        return result;
      }else if (result.code == 401) {
        useUserStore().logout();
        return Promise.reject(result);
      } else {
        console.log(config.showMsg)
        if (config.showMsg) ElMessage({ message: result.msg, type: "error" });
        return Promise.reject(result);
      }
    }
    else if (response.status == 401) {
      useUserStore().logout();
      return Promise.reject(result);
    } else {
      if (config.showMsg)
        ElMessage({ message: response.status, type: "error" });
      return Promise.reject(response);
    }
  },
  (error) => {
    const config = error.config;
    if (config.loading === true && loading) {
      loading.close();
      loading = null;
    }
    if (error.status) {
      useUserStore().logout();
    }
    if (config.showMsg) ElMessage({ message: error.message, type: "error" });
    return Promise.reject(error);
  }
);

export default api;
