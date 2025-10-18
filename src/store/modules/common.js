import { ko } from 'element-plus/es/locales.mjs';
import { defineStore } from 'pinia';
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
    kvPairs: [
      { en: "en" },
      { zh: "zh" },
      { zhTW: "zh_tw" },
      { ja: "ja" },
      { th: "th" },
      { ko: "ko" },
    ],
  }),
  getters: {
    lang: (state) => state.clientLang,
    mergedKV: (state) =>
      state.kvPairs.reduce((acc, obj) => Object.assign(acc, obj), {}),
    getValueByKey: (state) => (key) => {
      const v = state.mergedKV[key];
      return typeof v === "undefined" ? null : v;
    },
  },
  actions: {
    updateLang(newLang) {
      this.clientLang = newLang;
    },
    setPath(path) {
      this.path = path;
    },
    setKV(key, value) {
      const idx = this.kvPairs.findIndex((obj) =>
        Object.prototype.hasOwnProperty.call(obj, key)
      );
      if (idx >= 0) {
        this.kvPairs[idx][key] = value;
      } else {
        this.kvPairs.push({ [key]: value });
      }
    },
    removeKV(key) {
      const idx = this.kvPairs.findIndex((obj) =>
        Object.prototype.hasOwnProperty.call(obj, key)
      );
      if (idx >= 0) this.kvPairs.splice(idx, 1);
    },
    setManyKV(list = []) {
      list.forEach((obj) => {
        const [k] = Object.keys(obj);
        if (!k) return;
        this.setKV(k, obj[k]);
      });
    },
  },
});