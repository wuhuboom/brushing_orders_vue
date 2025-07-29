// src/i18n.js
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ko from './locales/ko.json';
import ja from './locales/ja.json';
import it from './locales/it.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

// 定义语言包
const messages = {
  en,
  zh,
  ko,
  ja,
  it,
  fr,
  de
};

// 创建 i18n 实例并导出
const i18n = createI18n({
  locale: 'en', // 设置默认语言
  fallbackLocale: 'en', // 设置备用语言
  messages, // 设置语言包
});

export default i18n;