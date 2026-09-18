import type { ReactNode } from "react";

type ActionLinkVariant = "primary" | "secondary" | "outline" | "ghost";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ActionLinkVariant;
  /** Opens in a new tab with rel="noreferrer". Defaults to true for http(s). */
  external?: boolean;
  className?: string;
};

const BASE_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2";

const VARIANT_CLASS: Record<ActionLinkVariant, string> = {
  primary:
    "bg-[var(--brand-primary)] text-white shadow-[0_8px_20px_rgba(11,31,58,0.22)] hover:bg-[var(--brand-accent)] hover:shadow-[0_12px_26px_rgba(11,31,58,0.28)]",
  secondary:
    "bg-white text-[var(--brand-primary)] ring-1 ring-[var(--border-strong)] hover:bg-[var(--surface-muted)]",
  outline:
    "bg-transparent text-white ring-1 ring-white/45 hover:bg-white/12 hover:ring-white/70",
  ghost:
    "bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[var(--surface-soft)]",
};

/** Consistent call-to-action link used across the hero, cards, and contact. */
export default function ActionLink({
  href,
  children,
  variant = "primary",
  external,
  className = "",
}: ActionLinkProps) {
  const isExternal = external ?? /^https?:/i.test(href);

  return (
    <a
      href={href}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
      className={`${BASE_CLASS} ${VARIANT_CLASS[variant]} ${className}`.trim()}
    >
      {children}
    </a>
  );
}
