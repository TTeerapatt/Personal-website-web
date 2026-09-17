export const SUPPORTED_LOCALES = ["th", "en"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "th";

export const LOCALE_COOKIE = "personal_website_locale";

/** One year, so a visitor's language choice survives future visits. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isSupportedLocale(value: unknown): value is AppLocale {
  return (
    typeof value === "string" &&
    SUPPORTED_LOCALES.includes(value as AppLocale)
  );
}

export function toAppLocale(value: unknown): AppLocale {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Pick the field matching the active locale from a `*_th` / `*_en` pair,
 * falling back to the other language when the preferred one is blank.
 */
export function pickLocalized(
  locale: AppLocale,
  thValue: string | null | undefined,
  enValue: string | null | undefined
): string {
  const preferred = locale === "en" ? enValue : thValue;
  const fallback = locale === "en" ? thValue : enValue;

  if (preferred && preferred.trim()) return preferred;
  if (fallback && fallback.trim()) return fallback;
  return "";
}
