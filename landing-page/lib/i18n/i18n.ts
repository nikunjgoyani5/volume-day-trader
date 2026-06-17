"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { resources } from "./resources";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./settings";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

  i18n.on("languageChanged", (lng) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("i18nextLng", lng);
    }
  });
}

export default i18n;
