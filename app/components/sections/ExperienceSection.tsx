import { getTranslations } from "next-intl/server";
import { calculateDuration, formatPeriod } from "@/app/lib/formatDate";
import { pickLocalized, type AppLocale } from "@/app/lib/locale";
import type { Experience } from "@/app/types/content";
import SectionShell from "../ui/SectionShell";
import TimelineList, { type TimelineEntry } from "../ui/TimelineList";

type ExperienceSectionProps = {
  experiences: Experience[];
  locale: AppLocale;
};

export default async function ExperienceSection({
  experiences,
  locale,
}: ExperienceSectionProps) {
  const t = await getTranslations("experiences");
  const tCommon = await getTranslations("common");

  const presentLabel = tCommon("present");

  const entries: TimelineEntry[] = experiences.map((experience) => {
    const duration = calculateDuration(
      experience.start_date,
      experience.end_date
    );

    const durationParts: string[] = [];
    if (duration) {
      if (duration.years > 0) {
        durationParts.push(tCommon("yearShort", { count: duration.years }));
      }
      if (duration.months > 0) {
        durationParts.push(tCommon("monthShort", { count: duration.months }));
      }
    }

    return {
      id: experience.id,
      title: pickLocalized(locale, experience.name_th, experience.name_en),
      subtitle: experience.position || undefined,
      period: formatPeriod(
        experience.start_date,
        experience.end_date,
        locale,
        presentLabel
      ),
      durationLabel: durationParts.join(" ") || undefined,
      badge: experience.end_date ? undefined : t("current"),
      descriptionHtml: pickLocalized(
        locale,
        experience.description_th,
        experience.description_en
      ),
      mediaUrl: experience.url,
      mediaType: experience.media_type,
      logoAlt: t("logoAlt", {
        name: pickLocalized(locale, experience.name_th, experience.name_en),
      }),
    };
  });

  return (
    <SectionShell
      id="experiences"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      badge={t("countLabel", { count: entries.length })}
    >
      <TimelineList entries={entries} />
    </SectionShell>
  );
}
