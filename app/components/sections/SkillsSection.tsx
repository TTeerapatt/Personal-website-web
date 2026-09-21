import { getTranslations } from "next-intl/server";
import type { Skill } from "@/app/types/content";
import Reveal from "../ui/Reveal";
import SectionShell from "../ui/SectionShell";
import SkillsMarquee from "../ui/SkillsMarquee";

type SkillsSectionProps = {
  skills: Skill[];
};

/** Skills logos as a continuous marquee — images only, up to 8 per row. */
export default async function SkillsSection({ skills }: SkillsSectionProps) {
  const t = await getTranslations("skills");

  return (
    <SectionShell
      id="skills"
      tone="muted"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <Reveal>
        {/* Bleed to the section edges so the marquee can fade cleanly. */}
        <div className="-mx-5 sm:-mx-6 lg:-mx-8 xl:-mx-10">
          <SkillsMarquee skills={skills} />
        </div>
      </Reveal>
    </SectionShell>
  );
}
