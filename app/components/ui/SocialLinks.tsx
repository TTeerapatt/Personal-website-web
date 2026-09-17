import type { ReactNode } from "react";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import { resolveExternalUrl } from "@/app/lib/mediaUrl";
import type { ContactMe } from "@/app/types/content";

type SocialLinksProps = {
  contact: ContactMe | null | undefined;
  /** Used when contact_me has no GitHub of its own (about_me.github_url). */
  fallbackGithubUrl?: string | null;
  labels: {
    github: string;
    linkedin: string;
    facebook: string;
    instagram: string;
  };
  tone?: "default" | "inverse";
  className?: string;
};

type SocialEntry = {
  key: string;
  href: string;
  label: string;
  icon: ReactNode;
};

/** Icon row for the contact section and the footer. */
export default function SocialLinks({
  contact,
  fallbackGithubUrl = null,
  labels,
  tone = "default",
  className = "",
}: SocialLinksProps) {
  const entries: SocialEntry[] = [];

  const pushEntry = (
    key: keyof typeof labels,
    rawUrl: string | null | undefined,
    icon: ReactNode
  ) => {
    const href = resolveExternalUrl(rawUrl);
    if (!href) return;
    entries.push({ key, href, label: labels[key], icon });
  };

  pushEntry(
    "github",
    contact?.github_url || fallbackGithubUrl,
    <FaGithub aria-hidden="true" />
  );
  pushEntry("linkedin", contact?.linkedin_url, <FaLinkedinIn aria-hidden="true" />);
  pushEntry("facebook", contact?.facebook_url, <FaFacebookF aria-hidden="true" />);
  pushEntry("instagram", contact?.instagram_url, <FaInstagram aria-hidden="true" />);

  if (entries.length === 0) return null;

  const isInverse = tone === "inverse";

  return (
    <ul className={`flex flex-wrap items-center gap-2.5 ${className}`.trim()}>
      {entries.map((entry) => (
        <li key={entry.key}>
          <a
            href={entry.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={entry.label}
            title={entry.label}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-[17px] transition duration-200 ${
              isInverse
                ? "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
                : "bg-[var(--surface-muted)] text-[var(--brand-primary)] ring-1 ring-[var(--border)] hover:-translate-y-0.5 hover:bg-[var(--brand-soft)]"
            }`}
          >
            {entry.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
