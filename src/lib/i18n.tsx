"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

type Locale = "fr" | "es" | "de";

interface Translations {
  [key: string]: any;
}

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLocales: { code: Locale; name: string; nativeName: string }[];
}

// Default context for SSR and initial render before translations load
const defaultContext: I18nContextType = {
  locale: "fr",
  setLocale: () => {},
  t: (key: string) => key,
  availableLocales: [
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "de", name: "German", nativeName: "Deutsch" },
  ],
};

const I18nContext = createContext<I18nContextType>(defaultContext);

const translationsCache: Record<Locale, Translations | null> = {
  fr: null,
  es: null,
  de: null,
};

async function loadTranslations(locale: Locale): Promise<Translations> {
  if (translationsCache[locale]) {
    return translationsCache[locale]!;
  }

  try {
    const response = await fetch(`/locales/${locale}.json`);
    if (!response.ok) throw new Error(`Failed to load ${locale}`);
    const data = await response.json();
    translationsCache[locale] = data;
    return data;
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error);
    // Fallback to French
    if (locale !== "fr") {
      return loadTranslations("fr");
    }
    return {};
  }
}

function getNestedValue(obj: Translations, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() ?? match;
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load translations on locale change
  useEffect(() => {
    let mounted = true;
    loadTranslations(locale).then((data) => {
      if (mounted) {
        setTranslations(data);
        setIsLoaded(true);
      }
    });
    return () => { mounted = false; };
  }, [locale]);

  // Persist locale to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cbg_locale", locale);
    }
  }, [locale]);

  // Initialize locale from localStorage or browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cbg_locale") as Locale | null;
      if (saved && ["fr", "es", "de"].includes(saved)) {
        setLocaleState(saved);
      } else {
        // Detect browser language
        const browserLang = navigator.language.slice(0, 2) as Locale;
        if (["fr", "es", "de"].includes(browserLang)) {
          setLocaleState(browserLang);
        }
      }
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const value = getNestedValue(translations, key);
    if (typeof value === "string") {
      return interpolate(value, params);
    }
    if (typeof value === "object" && value !== null) {
      // Return the object as JSON string for complex cases (shouldn't happen in normal usage)
      return JSON.stringify(value);
    }
    // Fallback: return the key itself if translation not found
    console.warn(`Translation missing for key: ${key} in locale: ${locale}`);
    return key;
  }, [translations, locale]);

  const availableLocales = [
    { code: "fr" as Locale, name: "French", nativeName: "Français" },
    { code: "es" as Locale, name: "Spanish", nativeName: "Español" },
    { code: "de" as Locale, name: "German", nativeName: "Deutsch" },
  ];

  const contextValue = { locale, setLocale, t, availableLocales };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, locale, setLocale, availableLocales } = useI18n();
  return { t, locale, setLocale, availableLocales };
}