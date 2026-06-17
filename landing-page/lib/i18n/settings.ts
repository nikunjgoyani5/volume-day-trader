export const SUPPORTED_LANGUAGES = ["en", "pl"] as const;

export const DEFAULT_LANGUAGE = "en" as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const isLanguage = (value: unknown): value is Language => {
  return (
    typeof value === "string" &&
    (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
  );
};