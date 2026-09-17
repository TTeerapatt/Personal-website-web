import type { ReactNode } from "react";
import type { SectionId } from "@/app/types/content";
import Reveal from "./Reveal";

type SectionShellProps = {
  id: SectionId;
  eyebrow: string;
  title: string;
  description?: string;
  /** Short count pill shown next to the heading, e.g. "8 projects". */
  badge?: string;
  /** `muted` paints a tinted band, used to alternate section backgrounds. */
  tone?: "default" | "muted";
  children: ReactNode;
};

/** Shared section wrapper: anchor target, heading block, and page gutters. */
export default function SectionShell({
  id,
  eyebrow,
  title,
  description,
  badge,
  tone = "default",
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`scroll-mt-[var(--header-height)] py-14 sm:py-16 lg:py-24 ${
        tone === "muted" ? "bg-[var(--surface-muted)]" : "bg-[var(--canvas)]"
      }`}
    >
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-6 lg:px-8 xl:px-10">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-bold tracking-[0.18em] text-[var(--brand-highlight)] uppercase sm:text-[13px]">
              {eyebrow}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              <h2
                id={`${id}-heading`}
                className="text-balance text-[26px] font-bold leading-tight text-[var(--text-primary)] sm:text-[32px] lg:text-[38px]"
              >
                {title}
              </h2>
              {badge ? (
                <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-[12px] font-semibold text-[var(--brand-primary)]">
                  {badge}
                </span>
              ) : null}
            </div>

            {description ? (
              <p className="text-pretty mt-4 text-[14px] leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
                {description}
              </p>
            ) : null}
          </div>
        </Reveal>

        <div className="mt-10 sm:mt-12 lg:mt-16">{children}</div>
      </div>
    </section>
  );
}
