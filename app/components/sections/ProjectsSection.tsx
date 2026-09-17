"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { HiOutlineExternalLink, HiOutlinePhotograph } from "react-icons/hi";
import { pickLocalized, type AppLocale } from "@/app/lib/locale";
import { resolveExternalUrl } from "@/app/lib/mediaUrl";
import { htmlToPlainText } from "@/app/lib/sanitizeHtml";
import type { Project } from "@/app/types/content";
import MediaFrame from "../ui/MediaFrame";
import Reveal from "../ui/Reveal";
import SectionShell from "../ui/SectionShell";
import ProjectDetailDialog, { type ProjectDetail } from "./ProjectDetailDialog";

type ProjectsSectionProps = {
  projects: Project[];
  locale: AppLocale;
};

export default function ProjectsSection({
  projects,
  locale,
}: ProjectsSectionProps) {
  const t = useTranslations("projects");
  const [activeProject, setActiveProject] = useState<ProjectDetail | null>(null);

  // Resolve the localized fields once, so cards and the dialog agree.
  const items = useMemo<ProjectDetail[]>(
    () =>
      projects.map((project) => ({
        id: project.id,
        name: pickLocalized(locale, project.name_th, project.name_en),
        description: pickLocalized(
          locale,
          project.description_th,
          project.description_en
        ),
        thumbnailUrl: project.thumbnail_url,
        githubUrl: project.github_url,
        demoUrl: project.demo_url,
      })),
    [projects, locale]
  );

  return (
    <SectionShell
      id="projects"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      badge={t("countLabel", { count: items.length })}
    >
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {items.map((project, index) => {
          const preview = htmlToPlainText(project.description, 150);
          const githubUrl = resolveExternalUrl(project.githubUrl);
          const demoUrl = resolveExternalUrl(project.demoUrl);

          return (
            <li key={project.id} className="h-full">
              <Reveal delay={Math.min(index, 5) * 70} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
                  <MediaFrame
                    url={project.thumbnailUrl}
                    mediaType="image"
                    alt={t("thumbnailAlt", { name: project.name })}
                    className="aspect-video w-full overflow-hidden bg-[var(--surface-muted)]"
                    mediaClassName="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    fallback={
                      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-[var(--surface-muted)] text-[var(--text-muted)]">
                        <HiOutlinePhotograph
                          aria-hidden="true"
                          className="text-[28px]"
                        />
                        <span className="text-[12px] font-medium">
                          {t("noThumbnail")}
                        </span>
                      </div>
                    }
                  />

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-[16px] font-bold text-[var(--text-primary)] sm:text-[17px]">
                      {project.name}
                    </h3>

                    {preview ? (
                      <p className="mt-2.5 line-clamp-3 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
                        {preview}
                      </p>
                    ) : null}

                    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
                      <button
                        type="button"
                        onClick={() => setActiveProject(project)}
                        className="text-[13px] font-bold text-[var(--brand-highlight)] transition hover:text-[var(--brand-primary)]"
                      >
                        {t("viewDetails")}
                      </button>

                      <span className="ml-auto flex items-center gap-1.5">
                        {demoUrl ? (
                          <a
                            href={demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${t("liveDemo")}: ${project.name}`}
                            title={t("liveDemo")}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[18px] text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--brand-primary)]"
                          >
                            <HiOutlineExternalLink aria-hidden="true" />
                          </a>
                        ) : null}

                        {githubUrl ? (
                          <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${t("sourceCode")}: ${project.name}`}
                            title={t("sourceCode")}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[17px] text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--brand-primary)]"
                          >
                            <FaGithub aria-hidden="true" />
                          </a>
                        ) : null}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>

      <ProjectDetailDialog
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </SectionShell>
  );
}
