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
import { LANGS } from "@/config/lang";

const supportedLocales = new Set(LANGS.map(({ code }) => code));
const esLatinAmerica = {
  ...esES,
  clear: "Borrar",
  nameEmpty: "Ingresa el nombre",
  addContact: "Agregar contacto",
  vanCalendar: {
    ...esES.vanCalendar,
    monthTitle: (year, month) =>
      new Date(year, month - 1).toLocaleDateString("es-MX", {
        month: "long",
        year: "numeric",
      }),
    rangePrompt: (maxRange) => `Selecciona hasta ${maxRange} días`,
  },
  vanPullRefresh: {
    pulling: "Desliza para actualizar...",
    loosing: "Suelta para actualizar...",
  },
  vanCouponCell: {
    ...esES.vanCouponCell,
    count: (count) =>
      count === 1 ? "Tienes 1 cupón" : `Tienes ${count} cupones`,
  },
  vanAddressEdit: {
    ...esES.vanAddressEdit,
    areaEmpty: "Selecciona una zona",
    addressEmpty: "Ingresa la dirección",
    defaultAddress: "Establecer como dirección predeterminada",
  },
  vanAddressList: { add: "Agregar dirección" },
};

export function normalizeLocale(value) {
  const normalized = String(value || "mx").trim().toLowerCase().replaceAll("_", "-");
  if (normalized === "es-mx") return "mx";
  if (supportedLocales.has(normalized)) return normalized;
  const base = normalized.split("-")[0];
  return supportedLocales.has(base) ? base : "mx";
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
    mx: { name: "es-MX", pack: esLatinAmerica },
    cl: { name: "es-CL", pack: esLatinAmerica },
    co: { name: "es-CO", pack: esLatinAmerica },
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
    document.documentElement.lang = vantLang?.name || normalized;
    return normalized;
  }

  return {
    locale,
    setLocale,
  };
}
