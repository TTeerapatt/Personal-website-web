import mainAPI from "@/app/services/main/mainAPI";
import type { PublicWebsiteContent, SectionId } from "@/app/types/content";
import { isHtmlEmpty } from "./sanitizeHtml";

export type WebsiteContentState = {
  content: PublicWebsiteContent | null;
  errMessage: string | null;
};

const EMPTY_SETTINGS: PublicWebsiteContent["settings"] = {
  show_banners: false,
  show_about_me: false,
  show_skills: false,
  show_projects: false,
  show_experiences: false,
  show_education: false,
  show_contact_me: false,
};

/**
 * Loads the landing payload and normalizes both failure shapes the API client
 * can produce (transport failure, or a `success: false` envelope) into one
 * result the page can render without throwing.
 */
export async function loadWebsiteContent(): Promise<WebsiteContentState> {
  const result = await mainAPI.getPublicWebsiteContent();

  if ("status" in result && result.status === "failed") {
    return fail(result.errMessage);
  }

  if (!("success" in result) || result.success === false || !result.data) {
    const message =
      ("message" in result && result.message) ||
      "Unable to load website content";
    return fail(message);
  }

  const data = result.data;

  return {
    content: {
      ...data,
      settings: { ...EMPTY_SETTINGS, ...data.settings },
    },
    errMessage: null,
  };
}

/**
 * The page only surfaces this message outside production, so log it here to
 * keep the cause visible in the container logs either way.
 */
function fail(errMessage: string | null): WebsiteContentState {
  console.error("[website-content] failed to load public content:", errMessage);
  return { content: null, errMessage };
}

/**
 * A section renders only when the admin enabled it *and* it actually has
 * content, so a toggled-on but empty section never leaves a blank slab.
 */
export function getVisibleSections(
  content: PublicWebsiteContent | null
): SectionId[] {
  if (!content) return [];

  const { settings } = content;
  const sections: SectionId[] = [];

  if (settings.show_banners && (content.banners?.length ?? 0) > 0) {
    sections.push("home");
  }
  if (settings.show_about_me && hasAboutContent(content)) {
    sections.push("about");
  }
  if (settings.show_skills && (content.skills?.length ?? 0) > 0) {
    sections.push("skills");
  }
  if (settings.show_projects && (content.projects?.length ?? 0) > 0) {
    sections.push("projects");
  }
  if (settings.show_experiences && (content.experiences?.length ?? 0) > 0) {
    sections.push("experiences");
  }
  if (settings.show_education && (content.education?.length ?? 0) > 0) {
    sections.push("education");
  }
  if (settings.show_contact_me && hasContactContent(content)) {
    sections.push("contact");
  }

  return sections;
}

function hasAboutContent(content: PublicWebsiteContent): boolean {
  const about = content.about_me;
  if (!about) return false;

  return Boolean(
    about.title_th?.trim() ||
      about.title_en?.trim() ||
      about.text_animation_th?.trim() ||
      about.text_animation_en?.trim() ||
      about.image_url?.trim() ||
      !isHtmlEmpty(about.description_th) ||
      !isHtmlEmpty(about.description_en)
  );
}

function hasContactContent(content: PublicWebsiteContent): boolean {
  const contact = content.contact_me;
  if (!contact) return false;

  return Boolean(
    contact.email?.trim() ||
      contact.phone?.trim() ||
      contact.github_url?.trim() ||
      contact.linkedin_url?.trim() ||
      contact.facebook_url?.trim() ||
      contact.instagram_url?.trim()
  );
}
