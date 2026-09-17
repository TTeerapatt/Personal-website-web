import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { logo } from "@/app/assets";
import type { ContactMe, SectionId } from "@/app/types/content";
import SocialLinks from "../ui/SocialLinks";

type SiteFooterProps = {
  brandName: string;
  sections: SectionId[];
  contact: ContactMe | null | undefined;
  fallbackGithubUrl?: string | null;
};

export default async function SiteFooter({
  brandName,
  sections,
  contact,
  fallbackGithubUrl = null,
}: SiteFooterProps) {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tContact = await getTranslations("contact");

  // Rendered on the server, so the year never causes a hydration mismatch.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[var(--brand-primary)] text-white">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-6 lg:px-8 lg:py-14 xl:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/20">
                <Image src={logo} alt="" fill sizes="40px" className="object-cover" />
              </span>
              <span className="text-[17px] font-bold">{brandName}</span>
            </div>

            <SocialLinks
              contact={contact}
              fallbackGithubUrl={fallbackGithubUrl}
              tone="inverse"
              className="mt-6"
              labels={{
                github: tContact("github"),
                linkedin: tContact("linkedin"),
                facebook: tContact("facebook"),
                instagram: tContact("instagram"),
              }}
            />
          </div>

          {sections.length > 0 ? (
            <nav
              aria-label={brandName}
              className="grid grid-cols-2 gap-x-8 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-2"
            >
              {sections.map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-[14px] font-medium text-white/70 transition hover:text-white"
                >
                  {tNav(id)}
                </a>
              ))}
            </nav>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/12 pt-6 text-[13px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brandName}. {t("rights")}
          </p>
          <p>{t("builtWith")}</p>
        </div>
      </div>
    </footer>
  );
}
