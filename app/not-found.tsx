import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi";

/**
 * Safety net only. `proxy.ts` redirects unmatched paths to the landing page, so
 * this renders just if the request somehow bypasses that.
 */
export default async function NotFound() {
  const t = await getTranslations("common");
  const tMain = await getTranslations("main");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--canvas)] px-5">
      <div className="text-center">
        <p className="text-[13px] font-bold tracking-[0.18em] text-[var(--brand-highlight)] uppercase">
          {tMain("header")}
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[var(--brand-accent)]"
        >
          <HiOutlineArrowLeft aria-hidden="true" className="text-[17px]" />
          {t("backToTop")}
        </Link>
      </div>
    </main>
  );
}
