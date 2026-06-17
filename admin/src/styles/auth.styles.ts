export const AUTH_INPUT_CLASS =
  "w-full min-h-11 rounded-xl border border-btn-border bg-[#050024]/80 px-4 py-3 text-base text-tertiary-text placeholder:text-secondary-text/60 outline-none transition-colors focus:border-tab-active/60 focus:ring-2 focus:ring-tab-active/20 sm:min-h-0";

export const AUTH_INPUT_ERROR_CLASS =
  "border-tab-active/70 ring-2 ring-tab-active/25";

export function getAuthInputClassName(hasError: boolean, extra = "") {
  return [AUTH_INPUT_CLASS, hasError ? AUTH_INPUT_ERROR_CLASS : "", extra]
    .filter(Boolean)
    .join(" ");
}

export const AUTH_BUTTON_CLASS =
  "w-full min-h-12 cursor-pointer rounded-full bg-tab-active px-4 py-3.5 text-base font-semibold text-white shadow-[var(--shadow-control-inset)] transition-colors hover:bg-tab-active-hover disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0";

export const AUTH_LINK_CLASS =
  "cursor-pointer text-base font-medium text-tab-active transition-colors hover:text-tab-active-hover";

export const FEATURE_PILLS = [
  "Smart Market Analysis",
  "Real-Time Trading Signals",
  "Premium Trading Courses",
  "Advanced Trading Indicators",
] as const;
