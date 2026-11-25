import { defineStore } from "pinia";
import { normalizeLocale } from "@/config/lang";
// import { reqGetSystemConfig, reqGetClientVersion } from '../../api/apis';

export const useCommonStore = defineStore("common", {
  // 启用持久化
  persist: true,
  state: () => ({
    clientLang: "en",
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
      this.clientLang = normalizeLocale(newLang);
    },
    setPath(path) {
      this.path = path;
    },
  },
});
