"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa6";
import { HiOutlineExternalLink, HiOutlineX } from "react-icons/hi";
import { resolveExternalUrl } from "@/app/lib/mediaUrl";
import { isHtmlEmpty } from "@/app/lib/sanitizeHtml";
import ActionLink from "./ActionLink";
import MediaFrame from "./MediaFrame";
import RichText from "./RichText";

export type ProjectDetail = {
  id: number;
  name: string;
  description: string;
  thumbnailUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  createdAt: string | null;
};

type ProjectDetailDialogProps = {
  project: ProjectDetail | null;
  onClose: () => void;
};

/** Modal with the full project write-up. Keeps the site on a single route. */
export default function ProjectDetailDialog({
  project,
  onClose,
}: ProjectDetailDialogProps) {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const githubUrl = resolveExternalUrl(project.githubUrl);
  const demoUrl = resolveExternalUrl(project.demoUrl);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${t("dialogTitle")}: ${project.name}`}
      className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-[rgba(11,27,52,0.55)] p-0 backdrop-blur-sm sm:items-center sm:p-6"
    >
      {/* Backdrop click target, behind the panel. */}
      <button
        type="button"
        aria-label={tCommon("close")}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
        tabIndex={-1}
      />

      <div className="relative my-0 flex max-h-[92svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-[var(--surface)] shadow-[0_24px_60px_rgba(11,31,58,0.28)] sm:my-6 sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4 sm:px-6">
          <h3 className="text-[17px] font-bold text-[var(--text-primary)] sm:text-[19px]">
            {project.name}
          </h3>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={tCommon("close")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[20px] text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
          >
            <HiOutlineX aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {project.thumbnailUrl ? (
            <MediaFrame
              url={project.thumbnailUrl}
              mediaType="image"
              alt={t("thumbnailAlt", { name: project.name })}
              className="mb-5 aspect-video w-full overflow-hidden rounded-2xl bg-[var(--surface-muted)]"
              mediaClassName="h-full w-full object-cover"
            />
          ) : null}

          {isHtmlEmpty(project.description) ? null : (
            <RichText html={project.description} className="text-[14px]" />
          )}
        </div>

        {githubUrl || demoUrl ? (
          <div className="flex flex-wrap gap-3 border-t border-[var(--border)] px-5 py-4 sm:px-6">
            {demoUrl ? (
              <ActionLink href={demoUrl} variant="primary">
                <HiOutlineExternalLink aria-hidden="true" className="text-[17px]" />
                {t("liveDemo")}
              </ActionLink>
            ) : null}

            {githubUrl ? (
              <ActionLink href={githubUrl} variant="secondary">
                <FaGithub aria-hidden="true" className="text-[16px]" />
                {t("sourceCode")}
              </ActionLink>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
