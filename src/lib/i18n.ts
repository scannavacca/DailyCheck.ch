export const languages = ["de", "en", "it", "fr"] as const;
export type Language = (typeof languages)[number];

export const languageLabels: Record<Language, string> = {
  de: "DE",
  en: "EN",
  it: "IT",
  fr: "FR",
};

export const languageNames: Record<Language, string> = {
  de: "Deutsch",
  en: "English",
  it: "Italiano",
  fr: "Français",
};

export const DEFAULT_LANGUAGE: Language = "de";

export function isLanguage(value: string | null | undefined): value is Language {
  if (!value) return false;
  return (languages as readonly string[]).includes(value);
}
