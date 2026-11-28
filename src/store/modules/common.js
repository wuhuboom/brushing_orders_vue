import { defineStore } from "pinia";
// import { reqGetSystemConfig, reqGetClientVersion } from '../../api/apis';

export const useCommonStore = defineStore("common", {
  // 启用持久化
  persist: {
    afterRestore: ({ store }) => {
      // 旧版默认英语缓存改用墨西哥语言，之后保留用户的手动选择。
      if (!store.hasSelectedLanguage && store.clientLang === "en") {
        store.clientLang = "mx";
        store.$persist();
      }
    },
  },
  state: () => ({
    clientLang: "mx",
    hasSelectedLanguage: false,
    clientVersion: null,
    path: "",
    shareList: [10, 50, 100, 500],
    setting: {},
  }),
  getters: {
    lang: (state) => state.clientLang,
  },
  actions: {
    updateLang(newLang) {
      this.clientLang = newLang;
      this.hasSelectedLanguage = true;
    },
    setPath(path) {
      this.path = path;
    },
  },
});
