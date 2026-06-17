"use client";

import { LANGUAGES } from "@/constants/languages";
import { useLanguage } from "@/hooks/use-language";

export default function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      {LANGUAGES.map((language) => {
        const isActive = language.value === currentLanguage;

        return (
          <button
            key={language.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => changeLanguage(language.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              isActive
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {language.label}
          </button>
        );
      })}
    </div>
  );
}