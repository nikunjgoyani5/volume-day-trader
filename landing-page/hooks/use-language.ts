"use client";

import { useTranslation } from "react-i18next";

import { DEFAULT_LANGUAGE, isLanguage, type Language } from "@/lib/i18n/settings";

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const currentLanguage: Language = isLanguage(i18n.language)
    ? i18n.language
    : DEFAULT_LANGUAGE;

  const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language);
  };

  return {
    currentLanguage,
    changeLanguage,
  };
};