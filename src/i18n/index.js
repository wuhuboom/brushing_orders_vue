// src/i18n.js
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import es from "./locales/es.json";
import zh from "./locales/zh.json";
import ko from "./locales/ko.json";
import ja from "./locales/ja.json";
import it from "./locales/it.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import id from "./locales/id.json";
import th from "./locales/th.json";
import zhTW from "./locales/zh-Tw.json";

// 定义语言包
const withEnglishFallback = (localeMessages) => ({
  ...en,
  ...localeMessages,
});

const messages = {
  en,
  fr: withEnglishFallback(fr),
  de: withEnglishFallback(de),
  zh: withEnglishFallback(zh),
  ko: withEnglishFallback(ko),
  ja: withEnglishFallback(ja),
  it: withEnglishFallback(it),
  id: withEnglishFallback(id),
  th: withEnglishFallback(th),
  es: withEnglishFallback(es),
  zhTW: withEnglishFallback(zhTW),
};

// 创建 i18n 实例并导出
const i18n = createI18n({
  locale: "en", // setting默认语言
  fallbackLocale: "en", // setting备用语言
  messages, // setting语言包
  // Locale files contain trusted, static marketing/guide copy with simple HTML
  // tags that are rendered by the app. Disable vue-i18n's HTML-message
  // development warning so the console no longer floods with:
  // [intlify] Detected HTML in ... Recommend not using HTML messages to avoid XSS.
  // `warnHtmlMessage` is used by vue-i18n v9/v10; `warnHtmlInMessage` keeps
  // compatibility with older option handling and cached dependency builds.
  warnHtmlMessage: false,
  warnHtmlInMessage: "off",
  escapeParameterHtml: true,
});

export default i18n;
