import { getTranslations } from "next-intl/server";
import type { Skill } from "@/app/types/content";
import MediaFrame from "../ui/MediaFrame";
import Reveal from "../ui/Reveal";
import SectionShell from "../ui/SectionShell";

type SkillsSectionProps = {
  skills: Skill[];
};

/** Responsive logo grid: 2 columns on phones up to 6 on wide desktops. */
export default async function SkillsSection({ skills }: SkillsSectionProps) {
  const t = await getTranslations("skills");

  return (
    <SectionShell
      id="skills"
      tone="muted"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      badge={t("countLabel", { count: skills.length })}
    >
      {/* Centred wrap rather than a fixed grid, so a short list stays balanced
          and the final row of a long list is centred too. */}
      <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {skills.map((skill, index) => (
          <li key={skill.id} className="w-[calc(50%-0.375rem)] sm:w-40">
            {/* Cap the stagger so long lists do not delay the last rows. */}
            <Reveal delay={Math.min(index, 11) * 45}>
              <div className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:border-[var(--brand-soft)] hover:shadow-[var(--shadow-card-hover)] sm:p-5">
                <MediaFrame
                  url={skill.url}
                  mediaType={skill.media_type}
                  alt={t("logoAlt", { name: skill.name })}
                  className="flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14"
                  mediaClassName="h-full w-full object-contain transition duration-200 group-hover:scale-105"
                  fallback={
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[18px] font-bold text-[var(--brand-primary)] sm:h-14 sm:w-14">
                      {skill.name.trim().charAt(0).toUpperCase()}
                    </span>
                  }
                />

                <span className="text-[13px] font-semibold break-words text-[var(--text-primary)] sm:text-[14px]">
                  {skill.name}
                </span>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
