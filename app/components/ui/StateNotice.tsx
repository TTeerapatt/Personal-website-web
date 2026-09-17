import type { ReactNode } from "react";

type StateNoticeProps = {
  icon: ReactNode;
  title: string;
  description: string;
  /** Collapsible technical detail, shown only when an error message exists. */
  detail?: { label: string; message: string } | null;
  action?: ReactNode;
};

/**
 * Full-width message used when the content service is unreachable or when the
 * CMS has nothing published. Keeps the page a valid single route instead of
 * throwing to an error boundary.
 */
export default function StateNotice({
  icon,
  title,
  description,
  detail = null,
  action,
}: StateNoticeProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-20">
      <div className="w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-card)] sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[26px] text-[var(--brand-primary)]">
          {icon}
        </span>

        <h1 className="mt-5 text-[20px] font-bold text-[var(--text-primary)] sm:text-[22px]">
          {title}
        </h1>
        <p className="text-pretty mt-3 text-[14px] leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>

        {detail ? (
          <details className="mt-5 text-left">
            <summary className="cursor-pointer text-[13px] font-semibold text-[var(--text-muted)]">
              {detail.label}
            </summary>
            <p className="mt-2 rounded-xl bg-[var(--surface-muted)] px-3 py-2 text-[12px] leading-relaxed break-words text-[var(--text-secondary)]">
              {detail.message}
            </p>
          </details>
        ) : null}

        {action ? (
          <div className="mt-6 flex justify-center">{action}</div>
        ) : null}
      </div>
    </div>
  );
}
