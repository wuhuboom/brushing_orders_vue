// src/i18n.js
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ko from './locales/ko.json';
// import ja from './locales/ja.json';
import it from './locales/it.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import id from './locales/id.json';
import es from './locales/es.json'; //西班牙
import tr from './locales/tr.json'; //土耳其语
import ar from './locales/ar.json'; //阿拉伯

// 定义语言包
const messages = {
  en,
  fr,
  de,
  zh,
  ko,
  // ja,
  it,
  id,
  es,
  tr,
  ar
};

// 创建 i18n 实例并导出
const i18n = createI18n({
  locale: 'en', // 设置默认语言
  fallbackLocale: 'en', // 设置备用语言
  messages, // 设置语言包
});

export default i18n;