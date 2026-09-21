"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import type { SectionId } from "@/app/types/content";
import LocaleSwitcher from "./LocaleSwitcher";

type SiteHeaderProps = {
  sections: SectionId[];
  brandName: string;
  hasHero: boolean;
};

export default function SiteHeader({
  sections,
  brandName,
  hasHero,
}: SiteHeaderProps) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

  const headerRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(
    sections[0] ?? null
  );

  useEffect(() => {
    if (sections.length === 0) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      setIsScrolled(window.scrollY > 8);

      const offset = (headerRef.current?.offsetHeight ?? 64) + 24;
      let current: SectionId = sections[0];

      for (const id of sections) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top - offset <= 0) current = id;
      }

      const reachedBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (reachedBottom) current = sections[sections.length - 1];

      setActiveSection(current);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sections]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const isTransparent = hasHero && !isScrolled && !isMenuOpen;

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 h-[var(--header-height)] transition-colors duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "border-b border-[var(--border)] bg-white/85 shadow-[0_2px_12px_rgba(11,31,58,0.06)] backdrop-blur-md"
      }`}
    >
      <div className="mx-auto grid h-full w-full max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-6 lg:px-8 xl:px-10">
        <div aria-hidden="true" />

        <nav
          aria-label={brandName}
          className="hidden items-center justify-center gap-1 lg:flex"
        >
          {sections.map((id) => {
            const isActive = activeSection === id;

            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={isActive ? "true" : undefined}
                className={`rounded-full px-3 py-2 text-[14px] font-semibold transition ${
                  isTransparent
                    ? isActive
                      ? "bg-white/18 text-white"
                      : "text-white/80 hover:bg-white/12 hover:text-white"
                    : isActive
                      ? "bg-[var(--brand-soft)] text-[var(--brand-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {t(id)}
              </a>
            );
          })}
        </nav>

        <div className="col-start-3 flex items-center justify-end gap-2">
          <LocaleSwitcher tone={isTransparent ? "inverse" : "default"} />

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? tCommon("closeMenu") : tCommon("openMenu")}
            hidden={sections.length === 0}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-[22px] transition lg:hidden ${
              isTransparent
                ? "text-white hover:bg-white/12"
                : "text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            {isMenuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!isMenuOpen || sections.length === 0}
        className="absolute inset-x-0 top-full border-b border-[var(--border)] bg-white shadow-[0_18px_40px_rgba(11,31,58,0.14)] lg:hidden"
      >
        <nav className="mx-auto flex w-full max-w-[1280px] flex-col gap-1 px-5 py-4 sm:px-6">
          {sections.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={closeMenu}
              aria-current={activeSection === id ? "true" : undefined}
              className={`rounded-xl px-4 py-3 text-[15px] font-semibold transition ${
                activeSection === id
                  ? "bg-[var(--brand-soft)] text-[var(--brand-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {t(id)}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
