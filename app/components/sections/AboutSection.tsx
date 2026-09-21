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
      className="relative scroll-mt-[var(--header-height)] overflow-hidden bg-[var(--canvas)] py-16 sm:py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="brand-glow pointer-events-none absolute -top-28 -right-20 h-[480px] w-[480px] rounded-full opacity-90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-28 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(30,58,95,0.08),transparent)]"
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-6 lg:px-8 xl:px-10">
        <div
          className={`grid items-center gap-12 lg:gap-16 xl:gap-20 ${
            hasImage ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-1"
          }`}
        >
          <Reveal>
            <div className={hasImage ? "max-w-xl" : "mx-auto max-w-3xl text-center"}>
              <p
                className={`inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.2em] text-[var(--brand-highlight)] uppercase sm:text-[13px] ${
                  hasImage ? "" : "justify-center"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="hidden h-px w-8 bg-[var(--brand-highlight)]/50 sm:inline-block"
                />
                {t("eyebrow")}
              </p>

              <h2
                id="about-heading"
                className="text-balance mt-4 text-[30px] font-bold leading-[1.15] tracking-tight text-[var(--text-primary)] sm:mt-5 sm:text-[40px] lg:text-[48px]"
              >
                {title}
              </h2>

              {taglines.length > 0 ? (
                <div
                  className={`mt-4 flex items-stretch gap-3 ${
                    hasImage ? "" : "justify-center"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="hidden w-0.5 shrink-0 self-stretch rounded-full bg-[var(--brand-highlight)] sm:block"
                  />
                  <TypewriterText
                    phrases={taglines}
                    className="flex min-h-[1.85rem] items-center text-[16px] font-semibold text-[var(--brand-highlight)] sm:text-[20px]"
                  />
                </div>
              ) : null}

              {!isHtmlEmpty(description) ? (
                <RichText
                  html={description}
                  className="mt-6 text-[15px] leading-relaxed sm:mt-7 sm:text-[16px]"
                />
              ) : null}

              {githubUrl || resumeUrl || hasContactSection ? (
                <div
                  className={`mt-9 flex flex-wrap gap-3 sm:mt-10 ${
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
              <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[440px] lg:ml-auto lg:max-w-[480px]">
                {/* Soft radial wash behind the portrait */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(47,111,237,0.22),rgba(11,31,58,0.06)_55%,transparent_72%)]"
                />

                {/* Offset matte panel */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-3 translate-y-3 rounded-[30px] bg-gradient-to-br from-[var(--brand-soft)] to-[#c5d4ea] sm:translate-x-4 sm:translate-y-4 sm:rounded-[34px]"
                />

                {/* Thin accent outline, slightly offset the other way */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-2 -translate-y-2 rounded-[30px] border border-[var(--brand-highlight)]/25 sm:-translate-x-2.5 sm:-translate-y-2.5 sm:rounded-[34px]"
                />

                <MediaFrame
                  url={about.image_url}
                  mediaType="image"
                  alt={t("portraitAlt")}
                  eager
                  className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] shadow-[0_24px_55px_rgba(11,31,58,0.18)] ring-1 ring-white/80 sm:rounded-[32px]"
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
