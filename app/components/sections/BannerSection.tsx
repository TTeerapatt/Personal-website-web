"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineChevronDown, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import MediaFrame from "../ui/MediaFrame";
import type { HomeBanner, SectionId } from "@/app/types/content";

type BannerSectionProps = {
  banners: HomeBanner[];
  /** Target of the scroll-down affordance, when a section follows the hero. */
  nextSectionId?: SectionId;
};

const AUTOPLAY_INTERVAL_MS = 6500;
const SWIPE_THRESHOLD_PX = 48;

/** Full-bleed hero carousel built from the CMS home banners. */
export default function BannerSection({
  banners,
  nextSectionId,
}: BannerSectionProps) {
  const t = useTranslations("banners");
  const tCommon = useTranslations("common");

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const slideCount = banners.length;
  const hasMultiple = slideCount > 1;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % slideCount) + slideCount) % slideCount);
    },
    [slideCount]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrevious = useCallback(
    () => goTo(activeIndex - 1),
    [activeIndex, goTo]
  );

  // Autoplay, suspended on interaction, when the tab is hidden, or when the
  // visitor asked for reduced motion.
  useEffect(() => {
    if (!hasMultiple || isPaused) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setActiveIndex((index) => (index + 1) % slideCount);
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [hasMultiple, isPaused, slideCount]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hasMultiple) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX === null || !hasMultiple) return;

    const deltaX = (event.changedTouches[0]?.clientX ?? startX) - startX;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

    if (deltaX < 0) goNext();
    else goPrevious();
  };

  return (
    <section
      id="home"
      aria-label={t("title")}
      aria-roledescription="carousel"
      className="relative scroll-mt-[var(--header-height)] overflow-hidden bg-[var(--brand-primary)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        role="group"
        tabIndex={hasMultiple ? 0 : -1}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative h-[62svh] min-h-[400px] w-full sm:h-[70svh] lg:h-[84svh] lg:min-h-[560px]"
      >
        <div
          className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${slideCount}`}
              aria-hidden={index !== activeIndex}
              className="h-full w-full shrink-0"
            >
              <MediaFrame
                url={banner.url}
                mediaType={banner.media_type}
                alt={t("mediaAlt", { name: banner.name })}
                autoPlay
                eager={index === 0}
                className="h-full w-full"
                mediaClassName="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Vignette: keeps the header legible over bright media. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(11,31,58,0.62)] via-[rgba(11,31,58,0.18)] to-[rgba(11,31,58,0.72)]"
        />

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={goPrevious}
              aria-label={tCommon("previous")}
              className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/28 text-[20px] text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-black/45 sm:left-5 sm:h-12 sm:w-12 sm:text-[24px]"
            >
              <HiOutlineChevronLeft aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label={tCommon("next")}
              className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/28 text-[20px] text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-black/45 sm:right-5 sm:h-12 sm:w-12 sm:text-[24px]"
            >
              <HiOutlineChevronRight aria-hidden="true" />
            </button>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-8">
              {banners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={tCommon("goToSlide", { index: index + 1 })}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-7 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}

        {nextSectionId ? (
          <a
            href={`#${nextSectionId}`}
            aria-hidden="true"
            tabIndex={-1}
            className="animate-float absolute bottom-14 left-1/2 hidden h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-[24px] text-white/75 transition hover:text-white sm:bottom-16 sm:flex"
          >
            <HiOutlineChevronDown />
          </a>
        ) : null}
      </div>
    </section>
  );
}
