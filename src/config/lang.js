export const LANGS = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "mx", name: "Español (México)", flag: "🇲🇽" },
  { code: "cl", name: "Español (Chile)", flag: "🇨🇱" },
  { code: "co", name: "Español (Colombia)", flag: "🇨🇴" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "no", name: "Norsk", flag: "🇳🇴" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "hu", name: "Magyar", flag: "🇭🇺" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "sl", name: "Slovenčina", flag: "🇸🇰" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
];

export function normalizeLocale(value) {
  const code = String(value || "en").trim().toLowerCase().replaceAll("_", "-");
  const aliases = { "es-mx": "mx", "es-cl": "cl", "es-co": "co", sk: "sl", nb: "no" };
  const base = code.split("-")[0];
  const locale = aliases[code] || aliases[base] || base;
  return LANGS.some((item) => item.code === locale) ? locale : "en";
}
