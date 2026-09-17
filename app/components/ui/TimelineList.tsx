import type { MediaType } from "@/app/types/content";
import MediaFrame from "./MediaFrame";
import Reveal from "./Reveal";
import RichText from "./RichText";

export type TimelineEntry = {
  id: number;
  /** Company or institution name. */
  title: string;
  /** Job position for experiences; unused for education. */
  subtitle?: string;
  /** Pre-formatted period, e.g. "Jan 2022 – Present". */
  period: string;
  /** Pre-formatted length, e.g. "1 yr 8 mos". */
  durationLabel?: string;
  /** Pill shown for ongoing entries ("Current" / "Studying"). */
  badge?: string;
  descriptionHtml: string;
  mediaUrl: string | null;
  mediaType: MediaType | null;
  logoAlt: string;
};

type TimelineListProps = {
  entries: TimelineEntry[];
};

/** Single-rail vertical timeline shared by the experience and education sections. */
export default function TimelineList({ entries }: TimelineListProps) {
  return (
    <ol className="relative mx-auto max-w-3xl">
      {/* Rail, aligned to the centre of the logo markers. */}
      <span
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-[23px] w-px bg-[var(--border-strong)] sm:left-[27px]"
      />

      {entries.map((entry, index) => (
        <li
          key={entry.id}
          className={`relative pl-16 sm:pl-20 ${
            index === entries.length - 1 ? "" : "pb-6 sm:pb-8"
          }`}
        >
          <span className="absolute top-1 left-0 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface)] shadow-sm sm:h-14 sm:w-14">
            <MediaFrame
              url={entry.mediaUrl}
              mediaType={entry.mediaType}
              alt={entry.logoAlt}
              className="h-full w-full p-1.5"
              mediaClassName="h-full w-full object-contain"
              fallback={
                <span className="text-[16px] font-bold text-[var(--brand-primary)]">
                  {entry.title.trim().charAt(0).toUpperCase()}
                </span>
              }
            />
          </span>

          <Reveal>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] transition duration-200 hover:shadow-[var(--shadow-card-hover)] sm:p-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 className="text-[16px] font-bold text-[var(--text-primary)] sm:text-[18px]">
                  {entry.title}
                </h3>
                {entry.badge ? (
                  <span className="rounded-full bg-[rgba(31,122,77,0.1)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--success)] ring-1 ring-[rgba(31,122,77,0.22)]">
                    {entry.badge}
                  </span>
                ) : null}
              </div>

              {entry.subtitle ? (
                <p className="mt-1 text-[14px] font-semibold text-[var(--brand-highlight)] sm:text-[15px]">
                  {entry.subtitle}
                </p>
              ) : null}

              {entry.period ? (
                <p className="mt-2 flex flex-wrap items-center gap-x-2 text-[12.5px] font-medium text-[var(--text-muted)] sm:text-[13px]">
                  <span>{entry.period}</span>
                  {entry.durationLabel ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{entry.durationLabel}</span>
                    </>
                  ) : null}
                </p>
              ) : null}

              <RichText
                html={entry.descriptionHtml}
                className="mt-3.5 text-[13.5px] sm:text-[14px]"
              />
            </article>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
