/**
 * Types for the public landing payload.
 * Mirrors Personal-website-api `GET /public/content`
 * (src/services/public_content.service.ts).
 */

export type MediaType = "image" | "video";

export type SiteSettings = {
  show_banners: boolean;
  show_about_me: boolean;
  show_skills: boolean;
  show_projects: boolean;
  show_experiences: boolean;
  show_education: boolean;
  show_contact_me: boolean;
};

export type HomeBanner = {
  id: number;
  name: string;
  media_type: MediaType;
  url: string;
  display_order: number;
  is_active: boolean;
};

export type AboutMe = {
  id: number;
  title_th: string;
  title_en: string;
  text_animation_th: string;
  text_animation_en: string;
  description_th: string | null;
  description_en: string | null;
  image_url: string | null;
  github_url: string | null;
  resume_url: string | null;
  is_active: boolean;
};

export type Skill = {
  id: number;
  name: string;
  media_type: MediaType;
  url: string;
  display_order: number;
  is_active: boolean;
};

export type Project = {
  id: number;
  name_th: string;
  name_en: string;
  description_th: string | null;
  description_en: string | null;
  thumbnail_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  display_order: number;
  is_active: boolean;
};

export type Experience = {
  id: number;
  name_th: string;
  name_en: string;
  description_th: string | null;
  description_en: string | null;
  position: string;
  start_date: string;
  end_date: string | null;
  media_type: MediaType | null;
  url: string | null;
  display_order: number;
  is_active: boolean;
};

export type Education = {
  id: number;
  name_th: string;
  name_en: string;
  description_th: string | null;
  description_en: string | null;
  start_date: string;
  end_date: string | null;
  media_type: MediaType | null;
  url: string | null;
  display_order: number;
  is_active: boolean;
};

export type ContactMe = {
  id: number;
  name_th: string;
  name_en: string;
  phone: string | null;
  email: string;
  github_url: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  is_active: boolean;
};

/**
 * Sections whose `show_*` flag is false are omitted entirely by the API,
 * so every content key is optional.
 */
export type PublicWebsiteContent = {
  settings: SiteSettings;
  banners?: HomeBanner[];
  about_me?: AboutMe | null;
  skills?: Skill[];
  projects?: Project[];
  experiences?: Experience[];
  education?: Education[];
  contact_me?: ContactMe | null;
};

/** Anchor targets for the single-page navigation. */
export type SectionId =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "experiences"
  | "education"
  | "contact";
