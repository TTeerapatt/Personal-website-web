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
        <div className="mx-auto max-w-2xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          {displayName ? (
            <p className="text-center text-[17px] font-semibold text-[var(--text-primary)] sm:text-[18px]">
              {displayName}
            </p>
          ) : null}

          <dl
            className={`divide-y divide-[var(--border)] ${
              displayName ? "mt-6" : ""
            }`}
          >
            {email ? (
              <div className="flex items-center gap-4 py-4 first:pt-0">
                <HiOutlineMail
                  aria-hidden="true"
                  className="shrink-0 text-[20px] text-[var(--brand-highlight)]"
                />
                <div className="min-w-0 flex-1">
                  <dt className="text-[12px] text-[var(--text-muted)]">
                    {t("emailLabel")}
                  </dt>
                  <dd className="truncate">
                    <a
                      href={`mailto:${email}`}
                      className="text-[15px] font-medium text-[var(--text-primary)] transition hover:text-[var(--brand-highlight)]"
                    >
                      {email}
                    </a>
                  </dd>
                </div>
                <CopyEmailButton email={email} />
              </div>
            ) : null}

            {phone && telHref ? (
              <div className="flex items-center gap-4 py-4 last:pb-0">
                <HiOutlinePhone
                  aria-hidden="true"
                  className="shrink-0 text-[20px] text-[var(--brand-highlight)]"
                />
                <div className="min-w-0 flex-1">
                  <dt className="text-[12px] text-[var(--text-muted)]">
                    {t("phoneLabel")}
                  </dt>
                  <dd>
                    <a
                      href={telHref}
                      className="text-[15px] font-medium text-[var(--text-primary)] transition hover:text-[var(--brand-highlight)]"
                    >
                      {phone}
                    </a>
                  </dd>
                </div>
              </div>
            ) : null}
          </dl>

          <div className="mt-6 flex flex-col items-center gap-5 border-t border-[var(--border)] pt-6 sm:flex-row sm:justify-between">
            <SocialLinks
              contact={contact}
              fallbackGithubUrl={fallbackGithubUrl}
              labels={{
                github: t("github"),
                linkedin: t("linkedin"),
                facebook: t("facebook"),
                instagram: t("instagram"),
              }}
            />

            {email ? (
              <ActionLink
                href={`mailto:${email}`}
                variant="primary"
                external={false}
                className="w-full sm:w-auto"
              >
                <HiOutlineMail aria-hidden="true" className="text-[17px]" />
                {t("sendEmail")}
              </ActionLink>
            ) : null}
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
