// src/i18n.js
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import zh from "./locales/zh.json";
import ko from "./locales/ko.json";
// import ja from './locales/ja.json';
import it from "./locales/it.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import de from "./locales/de.json";
import id from "./locales/id.json";
import ja from "./locales/ja.json";
import { dasMessages } from "./das";

// 定义语言包
const withDas = (localeMessages, locale = "en") => {
  const localizedDas = dasMessages[locale] || {};
  return {
    ...localeMessages,
    das: {
      ...dasMessages.en,
      ...localizedDas,
      transaction: {
        ...dasMessages.en.transaction,
        ...(localizedDas.transaction || {}),
      },
    },
  };
};

const messages = {
  en: withDas(en, "en"),
  es: withDas(es, "es"),
  fr: withDas(fr, "fr"),
  de: withDas(de, "de"),
  zh: withDas(zh, "zh"),
  ko: withDas(ko, "ko"),
  ja: withDas(ja, "ja"),
  it: withDas(it, "it"),
  id: withDas(id, "id"),
};

// 创建 i18n 实例并导出
const i18n = createI18n({
  locale: "en", // 设置默认语言
  fallbackLocale: "en", // 设置备用语言
  messages, // 设置语言包
});

export default i18n;
