"use server";

import { cookies } from "next/headers";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  toAppLocale,
} from "./locale";

/**
 * Persists the language choice. A Server Action keeps this out of the URL, so
 * the site stays a single route with no locale-prefixed paths.
 */
export async function setLocaleAction(value: string): Promise<void> {
  const locale = toAppLocale(value);
  const cookieStore = await cookies();

  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}
