"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { HiOutlineArrowUp } from "react-icons/hi";

/** Floating scroll-to-top button, revealed after the first viewport. */
export default function BackToTop() {
  const t = useTranslations("common");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      setIsVisible(window.scrollY > window.innerHeight * 0.6);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t("backToTop")}
      title={t("backToTop")}
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      className={`fixed right-4 bottom-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[20px] text-white shadow-[0_10px_28px_rgba(11,31,58,0.32)] transition duration-300 hover:bg-[var(--brand-accent)] sm:right-6 sm:bottom-6 sm:h-12 sm:w-12 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <HiOutlineArrowUp aria-hidden="true" />
    </button>
  );
}
