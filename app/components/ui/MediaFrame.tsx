import { resolveMediaUrl } from "@/app/lib/mediaUrl";
import type { MediaType } from "@/app/types/content";

type MediaFrameProps = {
  url: string | null | undefined;
  mediaType?: MediaType | null;
  alt: string;
  className?: string;
  /** Applied to the <img>/<video> itself, for object-fit and sizing. */
  mediaClassName?: string;
  /** Videos only. Banners autoplay muted; inline logos do not. */
  autoPlay?: boolean;
  /** Skips lazy loading for above-the-fold media. */
  eager?: boolean;
  fallback?: React.ReactNode;
};

/**
 * Renders an uploaded image or video. `media_type` comes from the CMS, but the
 * file extension is used as a fallback because it is nullable on experiences
 * and education.
 */
export default function MediaFrame({
  url,
  mediaType,
  alt,
  className = "",
  mediaClassName = "h-full w-full object-cover",
  autoPlay = false,
  eager = false,
  fallback = null,
}: MediaFrameProps) {
  const resolvedUrl = resolveMediaUrl(url);
  if (!resolvedUrl) return <>{fallback}</>;

  const isVideo =
    mediaType === "video" ||
    (!mediaType && /\.(mp4|webm|ogg|mov|m4v)(?:\?|#|$)/i.test(resolvedUrl));

  if (isVideo) {
    return (
      <div className={className}>
        <video
          className={mediaClassName}
          src={resolvedUrl}
          aria-label={alt}
          autoPlay={autoPlay}
          muted
          loop
          playsInline
          preload={eager ? "auto" : "metadata"}
          controls={!autoPlay}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Uploads are served from the API origin, which is not known at build
          time, so next/image remote patterns cannot be configured for it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={mediaClassName}
        src={resolvedUrl}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
      />
    </div>
  );
}
