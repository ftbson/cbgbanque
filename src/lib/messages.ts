import fr from "@/locales/fr.json";
import de from "@/locales/de.json";
import es from "@/locales/es.json";

export type Locale = "fr" | "de" | "es";

const messages = { fr, de, es } satisfies Record<Locale, typeof fr>;

export function getMessages(locale: Locale) {
  return messages[locale] ?? messages.fr;
}
