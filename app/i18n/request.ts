import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isSupportedLocale,
} from "@/app/lib/locale";

export default getRequestConfig(async ({ requestLocale }) => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const requestedLocale = await requestLocale;

  const locale = isSupportedLocale(requestedLocale)
    ? requestedLocale
    : isSupportedLocale(cookieLocale)
      ? cookieLocale
      : DEFAULT_LOCALE;

  const main = (await import(`../messages/${locale}/main.json`)).default;

  return {
    locale,
    messages: {
      ...main,
    },
  };
});
