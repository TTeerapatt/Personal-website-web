import type { AppLocale } from "./locale";

/**
 * Date formatting for experience / education periods.
 *
 * `start_date` / `end_date` are PostgreSQL DATE columns. node-postgres parses
 * them into a Date at the *API host's* local midnight, so the instant that
 * reaches us is displaced from UTC midnight by that host's UTC offset — e.g.
 * 2022-03-01 becomes "2022-02-28T17:00:00.000Z" from an Asia/Bangkok host and
 * "2022-03-01T00:00:00.000Z" from a UTC one. Since the API and web containers
 * need not share a timezone, we recover the intended calendar day by rounding
 * to the nearest UTC midnight, which is correct for any API offset within
 * ±12h and independent of this process's own timezone.
 */

type CalendarParts = {
  year: number;
  month: number;
  day: number;
};

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Thai formatting is pinned to the Gregorian calendar so TH and EN show the same year. */
function intlLocale(locale: AppLocale): string {
  return locale === "en" ? "en-US" : "th-TH-u-ca-gregory";
}

function toCalendarParts(
  value: string | null | undefined
): CalendarParts | null {
  if (!value) return null;

  const dateOnly = DATE_ONLY_PATTERN.exec(value.trim());
  if (dateOnly) {
    return {
      year: Number(dateOnly[1]),
      month: Number(dateOnly[2]) - 1,
      day: Number(dateOnly[3]),
    };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  const atUtcMidnight = new Date(
    Math.round(parsed.getTime() / DAY_MS) * DAY_MS
  );

  return {
    year: atUtcMidnight.getUTCFullYear(),
    month: atUtcMidnight.getUTCMonth(),
    day: atUtcMidnight.getUTCDate(),
  };
}

function format(parts: CalendarParts, locale: AppLocale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(parts.year, parts.month, parts.day)));
}

/** "Jan 2024" / "ม.ค. 2024". Returns an empty string for unusable input. */
export function formatMonthYear(
  value: string | null | undefined,
  locale: AppLocale
): string {
  const parts = toCalendarParts(value);
  return parts ? format(parts, locale) : "";
}

/**
 * "Jan 2022 – Present". `presentLabel` comes from the translation files so the
 * ongoing case (end_date = NULL) reads correctly in both languages.
 */
export function formatPeriod(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  locale: AppLocale,
  presentLabel: string
): string {
  const start = formatMonthYear(startDate, locale);
  if (!start) return "";

  const end = endDate ? formatMonthYear(endDate, locale) : presentLabel;
  return end ? `${start} – ${end}` : start;
}

/** Whole years + months between the dates, for the "1 yr 8 mos" badge. */
export function calculateDuration(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): { years: number; months: number } | null {
  const start = toCalendarParts(startDate);
  if (!start) return null;

  const end = toCalendarParts(endDate) ?? currentCalendarParts();

  let totalMonths =
    (end.year - start.year) * 12 + (end.month - start.month);
  if (end.day < start.day) totalMonths -= 1;
  if (totalMonths < 0) return null;

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
  };
}

/** Read in UTC so an ongoing duration does not depend on the host timezone. */
function currentCalendarParts(): CalendarParts {
  const now = new Date();
  return {
    year: now.getUTCFullYear(),
    month: now.getUTCMonth(),
    day: now.getUTCDate(),
  };
}
