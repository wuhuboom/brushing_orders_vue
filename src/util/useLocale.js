// src/composables/useLocale.ts
import { useI18n } from "vue-i18n";
import { Locale } from "vant";
import zhCN from "vant/es/locale/lang/zh-CN";
import enUS from "vant/es/locale/lang/en-US";
import koKR from "vant/es/locale/lang/ko-KR";
import jaJP from "vant/es/locale/lang/ja-JP";
import itIT from "vant/es/locale/lang/it-IT";
import frFR from "vant/es/locale/lang/fr-FR";
import deDE from "vant/es/locale/lang/de-DE";
import arSA from "vant/es/locale/lang/ar-SA";
import trTR from "vant/es/locale/lang/tr-TR";
import esES from "vant/es/locale/lang/es-ES";

export function useLocale() {
  const { locale } = useI18n();

  const vantLocales = {
    // zh: { name: "zh-CN", pack: zhCN },
    en: { name: "en", pack: enUS },
    // ko: { name: "ko", pack: koKR },
    // ja: { name: "ja", pack: jaJP },
    // it: { name: "it", pack: itIT },
    // fr: { name: "fr", pack: frFR },
    // de: { name: "de", pack: deDE },
    ar: { name: "ar", pack: arSA },
    tr: { name: "tr", pack: trTR },
    es: { name: "es", pack: esES },
  };

  function setLocale(lang) {
    console.log(lang);
    locale.value = lang;

    const vantLang = vantLocales[lang];
    if (vantLang) {
      Locale.use(vantLang.name, vantLang.pack);
    }
  }

  return {
    locale,
    setLocale,
  };
}
