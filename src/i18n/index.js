import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import zh from "./locales/zh.json";
import ko from "./locales/ko.json";
import ja from "./locales/ja.json";
import it from "./locales/it.json";
import id from "./locales/id.json";
import sv from "./locales/sv.json";
import no from "./locales/no.json";
import ru from "./locales/ru.json";
import hu from "./locales/hu.json";
import pl from "./locales/pl.json";
import sl from "./locales/sl.json";

const messages = {
  en,
  es,
  fr,
  de,
  zh,
  ko,
  ja,
  it,
  id,
  sv,
  no,
  ru,
  hu,
  pl,
  sl,
};

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages,
});

export default i18n;
