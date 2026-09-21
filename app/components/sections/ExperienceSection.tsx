import { getTranslations } from "next-intl/server";
import { calculateDuration, formatPeriod } from "@/app/lib/formatDate";
import { pickLocalized, type AppLocale } from "@/app/lib/locale";
import type { Experience } from "@/app/types/content";
import AccordionList, { type AccordionItem } from "../ui/AccordionList";
import SectionShell from "../ui/SectionShell";

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

  const items: AccordionItem[] = experiences.map((experience) => {
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

    const name = pickLocalized(locale, experience.name_th, experience.name_en);

    return {
      id: experience.id,
      title: name,
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
      logoAlt: t("logoAlt", { name }),
    };
  });

  return (
    <SectionShell
      id="experiences"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <AccordionList items={items} />
    </SectionShell>
  );
}
