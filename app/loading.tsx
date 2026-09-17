import { getTranslations } from "next-intl/server";

/** Streamed shell shown while the landing content is fetched on the server. */
export default async function Loading() {
  const t = await getTranslations("common");

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <div className="h-[var(--header-height)] border-b border-[var(--border)] bg-white/85" />

      <div className="mx-auto w-full max-w-[1280px] px-5 py-14 sm:px-6 lg:px-8 lg:py-20 xl:px-10">
        <div className="animate-pulse space-y-10">
          <div className="mx-auto h-[38svh] min-h-[220px] w-full rounded-3xl bg-[var(--surface-muted)]" />

          <div className="mx-auto max-w-2xl space-y-3">
            <div className="mx-auto h-3 w-24 rounded-full bg-[var(--surface-soft)]" />
            <div className="mx-auto h-7 w-3/4 rounded-full bg-[var(--surface-muted)]" />
            <div className="mx-auto h-3 w-2/3 rounded-full bg-[var(--surface-soft)]" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="h-56 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              />
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-[13px] font-medium text-[var(--text-muted)]">
          {t("loading")}
        </p>
      </div>
    </div>
  );
}
