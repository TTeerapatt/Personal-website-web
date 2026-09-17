import { getLocale, getTranslations } from "next-intl/server";
import { HiOutlineExclamationCircle, HiOutlineInbox } from "react-icons/hi";
import BackToTop from "./components/layout/BackToTop";
import SiteFooter from "./components/layout/SiteFooter";
import SiteHeader from "./components/layout/SiteHeader";
import VisitTracker from "./components/layout/VisitTracker";
import AboutSection from "./components/sections/AboutSection";
import BannerSection from "./components/sections/BannerSection";
import ContactSection from "./components/sections/ContactSection";
import EducationSection from "./components/sections/EducationSection";
import ExperienceSection from "./components/sections/ExperienceSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import SkillsSection from "./components/sections/SkillsSection";
import ReloadButton from "./components/ui/ReloadButton";
import StateNotice from "./components/ui/StateNotice";
import { pickLocalized, toAppLocale } from "./lib/locale";
import { getVisibleSections, loadWebsiteContent } from "./lib/websiteContent";

/**
 * The only route on this site. Everything is driven by
 * `GET /public/content`, whose `settings.show_*` flags decide which sections
 * the admin has published.
 */
export default async function HomePage() {
  const locale = toAppLocale(await getLocale());
  const t = await getTranslations("main");

  const { content, errMessage } = await loadWebsiteContent();

  if (!content) {
    const tError = await getTranslations("error");

    return (
      <StateNotice
        icon={<HiOutlineExclamationCircle aria-hidden="true" />}
        title={tError("title")}
        description={tError("description")}
        detail={
          // Kept out of production HTML: the transport message can name the
          // internal backend host and port.
          errMessage && process.env.NODE_ENV !== "production"
            ? { label: tError("detailLabel"), message: errMessage }
            : null
        }
        action={<ReloadButton label={tError("retry")} />}
      />
    );
  }

  const sections = getVisibleSections(content);

  const about = content.about_me ?? null;
  const contact = content.contact_me ?? null;

  // Prefer the CMS-authored name, then the About headline, then the app name.
  const brandName =
    pickLocalized(locale, contact?.name_th, contact?.name_en) ||
    pickLocalized(locale, about?.title_th, about?.title_en) ||
    t("header");

  if (sections.length === 0) {
    const tEmpty = await getTranslations("empty");

    return (
      <>
        <SiteHeader sections={[]} brandName={brandName} hasHero={false} />
        <main id="main-content" className="pt-[var(--header-height)]">
          <StateNotice
            icon={<HiOutlineInbox aria-hidden="true" />}
            title={tEmpty("title")}
            description={tEmpty("description")}
          />
        </main>
        <VisitTracker />
      </>
    );
  }

  const hasHero = sections[0] === "home";
  const hasContactSection = sections.includes("contact");

  return (
    <div id="top">
      <SiteHeader
        sections={sections}
        brandName={brandName}
        hasHero={hasHero}
      />

      {/* Without a hero the header would overlap the first section. */}
      <main
        id="main-content"
        className={hasHero ? undefined : "pt-[var(--header-height)]"}
      >
        {sections.includes("home") && content.banners?.length ? (
          <BannerSection
            banners={content.banners}
            nextSectionId={sections[1]}
          />
        ) : null}

        {sections.includes("about") && about ? (
          <AboutSection
            about={about}
            locale={locale}
            hasContactSection={hasContactSection}
          />
        ) : null}

        {sections.includes("skills") && content.skills?.length ? (
          <SkillsSection skills={content.skills} />
        ) : null}

        {sections.includes("projects") && content.projects?.length ? (
          <ProjectsSection projects={content.projects} locale={locale} />
        ) : null}

        {sections.includes("experiences") && content.experiences?.length ? (
          <ExperienceSection
            experiences={content.experiences}
            locale={locale}
          />
        ) : null}

        {sections.includes("education") && content.education?.length ? (
          <EducationSection education={content.education} locale={locale} />
        ) : null}

        {sections.includes("contact") && contact ? (
          <ContactSection
            contact={contact}
            locale={locale}
            fallbackGithubUrl={about?.github_url ?? null}
          />
        ) : null}
      </main>

      <SiteFooter
        brandName={brandName}
        sections={sections}
        contact={contact}
        fallbackGithubUrl={about?.github_url ?? null}
      />

      <BackToTop />
      <VisitTracker />
    </div>
  );
}
