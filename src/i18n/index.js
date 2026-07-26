// src/i18n.js
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import it from './locales/it.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';
import sv from './locales/sv.json';
import de from './locales/de.json';
import no from './locales/no.json';
import ru from './locales/ru.json';
import hu from './locales/hu.json';
import pl from './locales/pl.json';
import sl from './locales/sl.json';


import zh from './locales/zh.json';
import ko from './locales/ko.json';
import id from './locales/id.json';

// 定义语言包
const messages = {
  en,
  it,
  es,
  fr,
  sv,
  ja,
  de,
  no,
  ru,
  hu,
  pl,
  sl,
  zh,
  ko,
  id
};

// 创建 i18n 实例并导出
const i18n = createI18n({
  locale: 'en', // 设置默认语言
  fallbackLocale: 'en', // 设置备用语言
  messages, // 设置语言包
});

export default i18n;