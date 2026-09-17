import { getTranslations } from "next-intl/server";
import { formatPeriod } from "@/app/lib/formatDate";
import { pickLocalized, type AppLocale } from "@/app/lib/locale";
import type { Education } from "@/app/types/content";
import SectionShell from "../ui/SectionShell";
import TimelineList, { type TimelineEntry } from "../ui/TimelineList";

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

  const entries: TimelineEntry[] = education.map((item) => {
    const name = pickLocalized(locale, item.name_th, item.name_en);

    return {
      id: item.id,
      title: name,
      period: formatPeriod(
        item.start_date,
        item.end_date,
        locale,
        presentLabel
      ),
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
      badge={t("countLabel", { count: entries.length })}
    >
      <TimelineList entries={entries} />
    </SectionShell>
  );
}
