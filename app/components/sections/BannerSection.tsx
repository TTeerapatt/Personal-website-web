"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
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

export default function BannerSection({
  banners,
  nextSectionId,
}: BannerSectionProps) {
  const t = useTranslations("banners");
  const tCommon = useTranslations("common");

  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const slideCount = banners.length;
  const hasMultiple = slideCount > 1;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (!swiper || swiper.destroyed || !swiper.autoplay) return;

    if (hasMultiple && !prefersReducedMotion) {
      swiper.autoplay.start();
    } else {
      swiper.autoplay.stop();
    }
  }, [swiper, hasMultiple, prefersReducedMotion]);

  return (
    <section
      id="home"
      aria-label={t("title")}
      className="relative scroll-mt-[var(--header-height)] overflow-hidden bg-[var(--brand-primary)]"
    >
      <div className="relative h-[62svh] min-h-[400px] w-full sm:h-[70svh] lg:h-[84svh] lg:min-h-[560px]">
        <Swiper
          modules={[A11y, Autoplay, Keyboard]}
          className="banner-swiper h-full w-full"
          slidesPerView={1}
          speed={700}
          rewind={hasMultiple}
          watchOverflow
          a11y={{
            enabled: true,
            prevSlideMessage: tCommon("previous"),
            nextSlideMessage: tCommon("next"),
          }}
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
          onSwiper={setSwiper}
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
              onClick={() => swiper?.slidePrev()}
              aria-label={tCommon("previous")}
              className="absolute top-1/2 left-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/28 text-[20px] text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-black/45 sm:left-5 sm:h-12 sm:w-12 sm:text-[24px]"
            >
              <HiOutlineChevronLeft aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => swiper?.slideNext()}
              aria-label={tCommon("next")}
              className="absolute top-1/2 right-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/28 text-[20px] text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-black/45 sm:right-5 sm:h-12 sm:w-12 sm:text-[24px]"
            >
              <HiOutlineChevronRight aria-hidden="true" />
            </button>

            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-8">
              {banners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => swiper?.slideTo(index)}
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
            className="animate-float absolute bottom-14 left-1/2 z-20 hidden h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-[24px] text-white/75 transition hover:text-white sm:bottom-16 sm:flex"
          >
            <HiOutlineChevronDown />
          </a>
        ) : null}
      </div>
    </section>
  );
}
