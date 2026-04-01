import { createContext, useCallback, useContext, useState } from "react";
import { en } from "./en";
import { ru } from "./ru";
import { uz } from "./uz";

const LANGS = { uz, en, ru };
export const LANG_LABELS = { uz: "O'zbek", ru: "Русский", en: "English" };

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = LANGS[lang];
  const changeLang = useCallback((newLang) => {
    if (LANGS[newLang]) setLang(newLang);
  }, []);
  return (
    <I18nContext.Provider
      value={{ t, lang, changeLang, langs: Object.keys(LANGS) }}
    >
      {children}
    </I18nContext.Provider>
  );
}
export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used inside I18nProvider");
  return ctx;
}
