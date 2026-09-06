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
import svSE from "vant/es/locale/lang/sv-SE";
import nbNO from "vant/es/locale/lang/nb-NO";
import ruRU from "vant/es/locale/lang/ru-RU";
import plPL from "vant/es/locale/lang/pl-PL";
import esES from "vant/es/locale/lang/es-ES";
import idID from "vant/es/locale/lang/id-ID";

const supportedLocales = new Set([
  "en",
  "it",
  "es",
  "fr",
  "ja",
  "sv",
  "de",
  "no",
  "ru",
  "hu",
  "pl",
  "sl",
  "zh",
  "ko",
  "id",
]);

export function normalizeLocale(value) {
  const normalized = String(value || "en").trim().toLowerCase().replaceAll("_", "-");
  if (supportedLocales.has(normalized)) return normalized;
  const base = normalized.split("-")[0];
  return supportedLocales.has(base) ? base : "en";
}

export function useLocale() {
  const { locale } = useI18n();

  const vantLocales = {
    zh: { name: "zh-CN", pack: zhCN },
    en: { name: "en", pack: enUS },
    ko: { name: "ko", pack: koKR },
    ja: { name: "ja", pack: jaJP },
    it: { name: "it", pack: itIT },
    fr: { name: "fr", pack: frFR },
    es: { name: "es-ES", pack: esES },
    de: { name: "de", pack: deDE },
    sv: { name: "sv-SE", pack: svSE },
    no: { name: "nb-NO", pack: nbNO },
    ru: { name: "ru-RU", pack: ruRU },
    pl: { name: "pl-PL", pack: plPL },
    hu: { name: "en-US", pack: enUS },
    sl: { name: "en-US", pack: enUS },
    id: { name: "id-ID", pack: idID },
  };

  function setLocale(lang) {
    const normalized = normalizeLocale(lang);
    locale.value = normalized;

    const vantLang = vantLocales[normalized];
    if (vantLang) {
      Locale.use(vantLang.name, vantLang.pack);
    }
    return normalized;
  }

  return {
    locale,
    setLocale,
  };
}
