"use client";

import { useEffect } from "react";

import i18n from "@/lib/i18n/i18n";
import { isLanguage } from "@/lib/i18n/settings";

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng");

    if (isLanguage(savedLanguage) && savedLanguage !== i18n.language) {
      void i18n.changeLanguage(savedLanguage);
    }

    document.documentElement.lang =
      isLanguage(savedLanguage) ? savedLanguage : i18n.language;

    const handleLanguageChanged = (lng: string) => {
      document.documentElement.lang = lng;
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  return <>{children}</>;
}