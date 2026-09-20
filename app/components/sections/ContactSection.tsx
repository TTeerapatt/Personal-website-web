import { getTranslations } from "next-intl/server";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { pickLocalized, type AppLocale } from "@/app/lib/locale";
import type { ContactMe } from "@/app/types/content";
import ActionLink from "../ui/ActionLink";
import Reveal from "../ui/Reveal";
import SectionShell from "../ui/SectionShell";
import SocialLinks from "../ui/SocialLinks";
import CopyEmailButton from "../ui/CopyEmailButton";

type ContactSectionProps = {
  contact: ContactMe;
  locale: AppLocale;
  /** about_me.github_url, used when contact_me has no GitHub link. */
  fallbackGithubUrl?: string | null;
};

export default async function ContactSection({
  contact,
  locale,
  fallbackGithubUrl = null,
}: ContactSectionProps) {
  const t = await getTranslations("contact");

  const displayName = pickLocalized(locale, contact.name_th, contact.name_en);
  const email = contact.email?.trim() ?? "";
  const phone = contact.phone?.trim() ?? "";

  // tel: links must not contain spaces or formatting characters.
  const telHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;

  return (
    <SectionShell
      id="contact"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <Reveal>
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-[var(--brand-primary)] p-6 text-white shadow-[0_18px_44px_rgba(11,31,58,0.24)] sm:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-[rgba(47,111,237,0.28)] blur-3xl"
          />

          <div className="relative">
            {displayName ? (
              <p className="text-[19px] font-bold sm:text-[22px]">
                {displayName}
              </p>
            ) : null}

            <dl className="mt-6 space-y-4">
              {email ? (
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[19px] ring-1 ring-white/20">
                    <HiOutlineMail aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <dt className="text-[11.5px] font-semibold tracking-[0.12em] text-white/55 uppercase">
                      {t("emailLabel")}
                    </dt>
                    <dd className="truncate">
                      <a
                        href={`mailto:${email}`}
                        className="text-[14px] font-semibold break-all text-white transition hover:text-white/80 sm:text-[15px]"
                      >
                        {email}
                      </a>
                    </dd>
                  </div>

                  <CopyEmailButton email={email} />
                </div>
              ) : null}

              {phone && telHref ? (
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[19px] ring-1 ring-white/20">
                    <HiOutlinePhone aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <dt className="text-[11.5px] font-semibold tracking-[0.12em] text-white/55 uppercase">
                      {t("phoneLabel")}
                    </dt>
                    <dd>
                      <a
                        href={telHref}
                        className="text-[14px] font-semibold text-white transition hover:text-white/80 sm:text-[15px]"
                      >
                        {phone}
                      </a>
                    </dd>
                  </div>
                </div>
              ) : null}
            </dl>

            <div className="mt-8 flex flex-col gap-6 border-t border-white/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-3 text-[11.5px] font-semibold tracking-[0.12em] text-white/55 uppercase">
                  {t("socialLabel")}
                </p>
                <SocialLinks
                  contact={contact}
                  fallbackGithubUrl={fallbackGithubUrl}
                  tone="inverse"
                  labels={{
                    github: t("github"),
                    linkedin: t("linkedin"),
                    facebook: t("facebook"),
                    instagram: t("instagram"),
                  }}
                />
              </div>

              {email ? (
                <ActionLink
                  href={`mailto:${email}`}
                  variant="outline"
                  external={false}
                  className="w-full justify-center sm:w-auto"
                >
                  <HiOutlineMail aria-hidden="true" className="text-[17px]" />
                  {t("sendEmail")}
                </ActionLink>
              ) : null}
            </div>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
