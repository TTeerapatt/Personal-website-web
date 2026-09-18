"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocaleAction } from "@/app/lib/localeActions";
import { SUPPORTED_LOCALES, type AppLocale } from "@/app/lib/locale";

type LocaleSwitcherProps = {
  tone?: "default" | "inverse";
  className?: string;
};

export default function LocaleSwitcher({
  tone = "default",
  className = "",
}: LocaleSwitcherProps) {
  const activeLocale = useLocale() as AppLocale;
  const t = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (locale: AppLocale) => {
    if (locale === activeLocale || isPending) return;

    startTransition(async () => {
      await setLocaleAction(locale);
      router.refresh();
    });
  };

  const isInverse = tone === "inverse";

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={`inline-flex items-center rounded-full p-0.5 transition ${
        isInverse
          ? "bg-white/12 ring-1 ring-white/25"
          : "bg-[var(--surface-muted)] ring-1 ring-[var(--border)]"
      } ${isPending ? "opacity-70" : ""} ${className}`.trim()}
    >
      {SUPPORTED_LOCALES.map((locale) => {
        const isActive = locale === activeLocale;

        return (
          <button
            key={locale}
            type="button"
            onClick={() => handleSelect(locale)}
            aria-pressed={isActive}
            disabled={isPending}
            className={`rounded-full px-2.5 py-1 text-[12px] font-bold uppercase transition sm:px-3 ${
              isActive
                ? isInverse
                  ? "bg-white text-[var(--brand-primary)]"
                  : "bg-[var(--brand-primary)] text-white"
                : isInverse
                  ? "text-white/80 hover:text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            } ${isPending ? "cursor-wait" : "cursor-pointer"}`}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
