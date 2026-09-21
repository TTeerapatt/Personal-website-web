"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import MediaFrame from "../ui/MediaFrame";
import type { HomeBanner, SectionId } from "@/app/types/content";

type BannerSectionProps = {
  banners: HomeBanner[];
  nextSectionId?: SectionId;
};

const AUTOPLAY_INTERVAL_MS = 6500;

/** Hover only — avoid focus-within so a clicked control does not keep icons visible after the pointer leaves. */
const CONTROLS_VISIBILITY =
  "pointer-events-none opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 group-has-[:focus-visible]:pointer-events-auto group-has-[:focus-visible]:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100";

export default function BannerSection({
  banners,
  nextSectionId,
}: BannerSectionProps) {
  const t = useTranslations("banners");
  const tCommon = useTranslations("common");

  const swiperRef = useRef<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const hasMultiple = banners.length > 1;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  return (
    <section
      id="home"
      aria-label={t("title")}
      className="relative scroll-mt-[var(--header-height)] overflow-hidden bg-[var(--brand-primary)]"
    >
      <div className="group relative h-svh min-h-svh w-full">
        <Swiper
          modules={[A11y, Autoplay, Keyboard]}
          className="banner-swiper h-full w-full"
          slidesPerView={1}
          speed={700}
          rewind={hasMultiple}
          watchOverflow
          a11y
          keyboard={{ enabled: hasMultiple }}
          autoplay={
            hasMultiple && !prefersReducedMotion
              ? {
                  delay: AUTOPLAY_INTERVAL_MS,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          onSwiper={(instance) => {
            swiperRef.current = instance;
          }}
          onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner.id}>
              <MediaFrame
                url={banner.url}
                mediaType={banner.media_type}
                alt={t("mediaAlt", { name: banner.name })}
                autoPlay
                eager={index === 0}
                className="h-full w-full"
                mediaClassName="h-full w-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[rgba(11,31,58,0.62)] via-[rgba(11,31,58,0.18)] to-[rgba(11,31,58,0.72)]"
        />

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                swiperRef.current?.slidePrev();
                event.currentTarget.blur();
              }}
              aria-label={tCommon("previous")}
              className={`${CONTROLS_VISIBILITY} absolute top-1/2 left-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/28 text-[20px] text-white ring-1 ring-white/25 backdrop-blur-sm hover:bg-black/45 sm:left-5 sm:h-12 sm:w-12 sm:text-[24px]`}
            >
              <HiOutlineChevronLeft aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                swiperRef.current?.slideNext();
                event.currentTarget.blur();
              }}
              aria-label={tCommon("next")}
              className={`${CONTROLS_VISIBILITY} absolute top-1/2 right-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/28 text-[20px] text-white ring-1 ring-white/25 backdrop-blur-sm hover:bg-black/45 sm:right-5 sm:h-12 sm:w-12 sm:text-[24px]`}
            >
              <HiOutlineChevronRight aria-hidden="true" />
            </button>

            <div
              className={`${CONTROLS_VISIBILITY} absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-8`}
            >
              {banners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={(event) => {
                    swiperRef.current?.slideTo(index);
                    event.currentTarget.blur();
                  }}
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
            className={`${CONTROLS_VISIBILITY} animate-float absolute bottom-14 left-1/2 z-20 hidden h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-[24px] text-white/75 hover:text-white sm:bottom-16 sm:flex`}
          >
            <HiOutlineChevronDown />
          </a>
        ) : null}
      </div>
    </section>
  );
}
