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
      // { key: 'siteName', value: 'My App' },
      // { key: 'theme', value: 'dark' },
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
    // 合并为平面对象（后面的覆盖前面的）
    mergedKV: (state) =>
      state.kvPairs.reduce((acc, obj) => Object.assign(acc, obj), {}),

    // 按 key 查 value（找不到返回 null）
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
    // 设置/更新某个键（如果已存在对应项就更新，否则 push 新项）
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

    // 删除某个键（移除该项）
    removeKV(key) {
      const idx = this.kvPairs.findIndex((obj) =>
        Object.prototype.hasOwnProperty.call(obj, key)
      );
      if (idx >= 0) this.kvPairs.splice(idx, 1);
    },

    // 批量写入：形如 [{ en:'en' }, { zh:'zh' }, ...]
    setManyKV(list = []) {
      list.forEach((obj) => {
        const [k] = Object.keys(obj);
        if (!k) return;
        this.setKV(k, obj[k]);
      });
    },
  },
});