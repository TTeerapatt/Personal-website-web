import { getTranslations } from "next-intl/server";
import { calculateDuration, formatPeriod } from "@/app/lib/formatDate";
import { pickLocalized, type AppLocale } from "@/app/lib/locale";
import type { Education } from "@/app/types/content";
import AccordionList, { type AccordionItem } from "../ui/AccordionList";
import SectionShell from "../ui/SectionShell";

type EducationSectionProps = {
  education: Education[];
  locale: AppLocale;
};

export default async function EducationSection({
  education,
  locale,
}: EducationSectionProps) {
  const t = await getTranslations("education");
  const tCommon = await getTranslations("common");

  const presentLabel = tCommon("present");

  const items: AccordionItem[] = education.map((item) => {
    const name = pickLocalized(locale, item.name_th, item.name_en);
    const duration = calculateDuration(item.start_date, item.end_date);

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
      id: item.id,
      title: name,
      period: formatPeriod(
        item.start_date,
        item.end_date,
        locale,
        presentLabel
      ),
      durationLabel: durationParts.join(" ") || undefined,
      badge: item.end_date ? undefined : t("studying"),
      descriptionHtml: pickLocalized(
        locale,
        item.description_th,
        item.description_en
      ),
      mediaUrl: item.url,
      mediaType: item.media_type,
      logoAlt: t("logoAlt", { name }),
    };
  });

  return (
    <SectionShell
      id="education"
      tone="muted"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <AccordionList items={items} />
    </SectionShell>
  );
}
