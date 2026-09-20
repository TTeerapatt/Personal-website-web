import { getTranslations } from "next-intl/server";
import { FaGithub } from "react-icons/fa6";
import { HiOutlineDocumentText, HiOutlineMail } from "react-icons/hi";
import { resolveExternalUrl } from "@/app/lib/mediaUrl";
import { pickLocalized, type AppLocale } from "@/app/lib/locale";
import { isHtmlEmpty } from "@/app/lib/sanitizeHtml";
import type { AboutMe } from "@/app/types/content";
import ActionLink from "../ui/ActionLink";
import MediaFrame from "../ui/MediaFrame";
import Reveal from "../ui/Reveal";
import RichText from "../ui/RichText";
import TypewriterText from "../ui/TypewriterText";

type AboutSectionProps = {
  about: AboutMe;
  locale: AppLocale;
  /** Renders the "Get in touch" button only when a contact section exists. */
  hasContactSection: boolean;
};

/**
 * Intro section. Uses the CMS title as its own heading rather than a static
 * string, since that field holds the owner's headline.
 */
export default async function AboutSection({
  about,
  locale,
  hasContactSection,
}: AboutSectionProps) {
  const t = await getTranslations("about");

  const title =
    pickLocalized(locale, about.title_th, about.title_en) || t("title");
  const description = pickLocalized(
    locale,
    about.description_th,
    about.description_en
  );
  const taglines = pickLocalized(
    locale,
    about.text_animation_th,
    about.text_animation_en
  )
    .split("|")
    .map((phrase) => phrase.trim())
    .filter(Boolean);

  const githubUrl = resolveExternalUrl(about.github_url);
  const resumeUrl = resolveExternalUrl(about.resume_url);
  const hasImage = Boolean(about.image_url?.trim());

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative scroll-mt-[var(--header-height)] overflow-hidden bg-[var(--canvas)] py-14 sm:py-16 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="brand-glow pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full"
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-6 lg:px-8 xl:px-10">
        <div
          className={`grid items-center gap-10 lg:gap-14 ${
            hasImage ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-1"
          }`}
        >
          <Reveal>
            <div className={hasImage ? "" : "mx-auto max-w-3xl text-center"}>
              <p className="text-[12px] font-bold tracking-[0.18em] text-[var(--brand-highlight)] uppercase sm:text-[13px]">
                {t("eyebrow")}
              </p>

              <h2
                id="about-heading"
                className="text-balance mt-3 text-[28px] font-bold leading-tight text-[var(--text-primary)] sm:text-[36px] lg:text-[44px]"
              >
                {title}
              </h2>

              {taglines.length > 0 ? (
                <TypewriterText
                  phrases={taglines}
                  className="mt-3 flex min-h-[1.75rem] items-center text-[16px] font-semibold text-[var(--brand-highlight)] sm:text-[19px]"
                />
              ) : null}

              {!isHtmlEmpty(description) ? (
                <RichText
                  html={description}
                  className="mt-5 text-[14px] sm:text-[15px]"
                />
              ) : null}

              {githubUrl || resumeUrl || hasContactSection ? (
                <div
                  className={`mt-8 flex flex-wrap gap-3 ${
                    hasImage ? "" : "justify-center"
                  }`}
                >
                  {githubUrl ? (
                    <ActionLink href={githubUrl} variant="primary">
                      <FaGithub aria-hidden="true" className="text-[16px]" />
                      {t("viewGithub")}
                    </ActionLink>
                  ) : null}

                  {resumeUrl ? (
                    <ActionLink href={resumeUrl} variant="secondary">
                      <HiOutlineDocumentText
                        aria-hidden="true"
                        className="text-[17px]"
                      />
                      {t("downloadResume")}
                    </ActionLink>
                  ) : null}

                  {hasContactSection ? (
                    <ActionLink
                      href="#contact"
                      variant="ghost"
                      external={false}
                    >
                      <HiOutlineMail aria-hidden="true" className="text-[17px]" />
                      {t("getInTouch")}
                    </ActionLink>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Reveal>

          {hasImage ? (
            <Reveal delay={120}>
              <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[420px] lg:max-w-none">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-3 translate-y-3 rounded-[28px] bg-[var(--brand-soft)]"
                />
                <MediaFrame
                  url={about.image_url}
                  mediaType="image"
                  alt={t("portraitAlt")}
                  eager
                  className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] ring-1 ring-[var(--border)]"
                  mediaClassName="h-full w-full object-cover"
                />
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
