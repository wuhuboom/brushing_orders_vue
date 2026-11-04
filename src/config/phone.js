export const DEFAULT_PHONE_COUNTRY_ID = 1;

export const PHONE_COUNTRIES = [
  { id: 1, name: "United States", dial: "1", flag: "https://flagcdn.com/w40/us.png" },
  { id: 2, name: "United Kingdom", dial: "44", flag: "https://flagcdn.com/w40/gb.png" },
  { id: 3, name: "Canada", dial: "1", flag: "https://flagcdn.com/w40/ca.png" },
  { id: 4, name: "China", dial: "86", flag: "https://flagcdn.com/w40/cn.png" },
  { id: 5, name: "Japan", dial: "81", flag: "https://flagcdn.com/w40/jp.png" },
  { id: 6, name: "South Korea", dial: "82", flag: "https://flagcdn.com/w40/kr.png" },
  { id: 7, name: "Thailand", dial: "66", flag: "https://flagcdn.com/w40/th.png" },
  { id: 8, name: "Singapore", dial: "65", flag: "https://flagcdn.com/w40/sg.png" },
  { id: 9, name: "Malaysia", dial: "60", flag: "https://flagcdn.com/w40/my.png" },
  { id: 10, name: "Vietnam", dial: "84", flag: "https://flagcdn.com/w40/vn.png" },
  { id: 11, name: "Indonesia", dial: "62", flag: "https://flagcdn.com/w40/id.png" },
  { id: 12, name: "Philippines", dial: "63", flag: "https://flagcdn.com/w40/ph.png" },
  { id: 13, name: "India", dial: "91", flag: "https://flagcdn.com/w40/in.png" },
  { id: 14, name: "Pakistan", dial: "92", flag: "https://flagcdn.com/w40/pk.png" },
  { id: 15, name: "United Arab Emirates", dial: "971", flag: "https://flagcdn.com/w40/ae.png" },
  { id: 16, name: "Saudi Arabia", dial: "966", flag: "https://flagcdn.com/w40/sa.png" },
  { id: 17, name: "Turkey", dial: "90", flag: "https://flagcdn.com/w40/tr.png" },
  { id: 18, name: "Israel", dial: "972", flag: "https://flagcdn.com/w40/il.png" },
  { id: 19, name: "Germany", dial: "49", flag: "https://flagcdn.com/w40/de.png" },
  { id: 20, name: "France", dial: "33", flag: "https://flagcdn.com/w40/fr.png" },
  { id: 21, name: "Italy", dial: "39", flag: "https://flagcdn.com/w40/it.png" },
  { id: 22, name: "Spain", dial: "34", flag: "https://flagcdn.com/w40/es.png" },
  { id: 23, name: "Portugal", dial: "351", flag: "https://flagcdn.com/w40/pt.png" },
  { id: 24, name: "Russia", dial: "7", flag: "https://flagcdn.com/w40/ru.png" },
  { id: 25, name: "Malta", dial: "356", flag: "https://flagcdn.com/w40/mt.png" },
  { id: 26, name: "Mali", dial: "223", flag: "https://flagcdn.com/w40/ml.png" },
  { id: 27, name: "Mauritania (موريتانيا)", dial: "222", flag: "https://flagcdn.com/w40/mr.png" },
  { id: 28, name: "Mauritius (Moris)", dial: "230", flag: "https://flagcdn.com/w40/mu.png" },
  { id: 29, name: "Mayotte", dial: "262", flag: "https://flagcdn.com/w40/yt.png" },
  { id: 30, name: "Marshall Islands", dial: "692", flag: "https://flagcdn.com/w40/mh.png" },
  { id: 31, name: "Martinique", dial: "596", flag: "https://flagcdn.com/w40/mq.png" },
  { id: 32, name: "Australia", dial: "61", flag: "https://flagcdn.com/w40/au.png" },
  { id: 33, name: "New Zealand", dial: "64", flag: "https://flagcdn.com/w40/nz.png" },
  { id: 34, name: "Brazil", dial: "55", flag: "https://flagcdn.com/w40/br.png" },
  { id: 35, name: "Mexico", dial: "52", flag: "https://flagcdn.com/w40/mx.png" },
  { id: 36, name: "Argentina", dial: "54", flag: "https://flagcdn.com/w40/ar.png" },
  { id: 37, name: "Chile", dial: "56", flag: "https://flagcdn.com/w40/cl.png" },
  { id: 38, name: "Colombia", dial: "57", flag: "https://flagcdn.com/w40/co.png" },
];

export const PHONE_RULES = {
  1: { pattern: "(###) ###-####", min: 10, max: 10 },
  7: { pattern: "(###) ###-##-##", min: 10, max: 10 },
  33: { pattern: "# ## ## ## ##", min: 9, max: 9 },
  34: { pattern: "### ### ###", min: 9, max: 9 },
  39: { pattern: "### ### ####", min: 9, max: 10 },
  44: { pattern: "#### ### ###", min: 10, max: 10 },
  49: { pattern: "### #### ####", min: 10, max: 11 },
  52: { pattern: "### ### ####", min: 10, max: 10 },
  54: { pattern: "## ####-####", min: 10, max: 10 },
  55: { pattern: "(##) #####-####", min: 10, max: 11 },
  56: { pattern: "# #### ####", min: 9, max: 9 },
  57: { pattern: "### ### ####", min: 10, max: 10 },
  60: { pattern: "##-####-####", min: 9, max: 10 },
  61: { pattern: "# #### ####", min: 9, max: 9 },
  62: { pattern: "###-####-#####", min: 9, max: 12 },
  63: { pattern: "###-###-####", min: 10, max: 10 },
  64: { pattern: "## ### ####", min: 8, max: 9 },
  65: { pattern: "#### ####", min: 8, max: 8 },
  66: { pattern: "##-###-####", min: 9, max: 9 },
  81: { pattern: "##-####-####", min: 9, max: 10 },
  82: { pattern: "##-####-####", min: 9, max: 10 },
  84: { pattern: "##-###-####", min: 9, max: 9 },
  86: { pattern: "### #### ####", min: 11, max: 11 },
  90: { pattern: "### ### ## ##", min: 10, max: 10 },
  91: { pattern: "#####-#####", min: 10, max: 10 },
  92: { pattern: "###-#######", min: 10, max: 10 },
  222: { pattern: "## ## ## ##", min: 8, max: 8 },
  223: { pattern: "## ## ## ##", min: 8, max: 8 },
  230: { pattern: "#### ####", min: 8, max: 8 },
  262: { pattern: "### ## ## ##", min: 9, max: 9 },
  351: { pattern: "### ### ###", min: 9, max: 9 },
  356: { pattern: "#### ####", min: 8, max: 8 },
  596: { pattern: "### ## ## ##", min: 9, max: 9 },
  692: { pattern: "### ####", min: 7, max: 7 },
  966: { pattern: "##-###-####", min: 9, max: 9 },
  971: { pattern: "##-###-####", min: 9, max: 9 },
  972: { pattern: "##-###-####", min: 8, max: 9 },
};

export const DEFAULT_PHONE_RULE = {
  pattern: "### ### ####",
  min: 6,
  max: 10,
};

export const getPhoneCountry = (countryId) => {
  const normalizedId = Number(countryId);
  return (
    PHONE_COUNTRIES.find((country) => country.id === normalizedId) ||
    PHONE_COUNTRIES.find((country) => country.id === DEFAULT_PHONE_COUNTRY_ID)
  );
};

export const getPhoneRule = (country) =>
  PHONE_RULES[country?.dial] || DEFAULT_PHONE_RULE;

export const localPhoneDigits = (value) =>
  String(value || "").replace(/\D/g, "");

export const phoneDigitCount = (rule) =>
  (rule.pattern.match(/#/g) || []).length;

export const formatPhoneNumber = (value, rule) => {
  const digits = localPhoneDigits(value).slice(0, rule.max);
  if (!digits) return "";
  let result = "";
  let digitIndex = 0;
  for (const token of rule.pattern) {
    if (token === "#") {
      if (digitIndex >= digits.length) break;
      result += digits[digitIndex];
      digitIndex += 1;
      continue;
    }
    if (digitIndex === 0 || digitIndex < digits.length) result += token;
  }
  return result;
};

export const isValidPhone = (phone, dial, rule) => {
  if (!/^[0-9]+$/.test(phone)) return false;
  const hasValidLocalLength =
    phone.length >= rule.min && phone.length <= rule.max;
  return hasValidLocalLength && `${dial}${phone}`.length <= 15;
};
