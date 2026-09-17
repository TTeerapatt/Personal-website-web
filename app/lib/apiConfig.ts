/**
 * Backend base URL resolution.
 *
 * The landing page renders on the server, so two different URLs can be in play:
 * - Browser requests use NEXT_PUBLIC_BACKEND_URL (baked in at build time).
 * - Server renders can use BACKEND_INTERNAL_URL to reach the API over the
 *   container network, where the browser-facing host is not resolvable.
 */

const DEFAULT_BACKEND_URL = "http://localhost:3001/personal-website/api/";

function withTrailingSlash(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

/** Base URL for axios. Relative paths are appended to this. */
export function resolveBackendBaseUrl(): string {
  const browserUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (typeof window === "undefined") {
    const internalUrl = process.env.BACKEND_INTERNAL_URL;
    if (internalUrl?.trim()) return withTrailingSlash(internalUrl);
  }

  if (browserUrl?.trim()) return withTrailingSlash(browserUrl);
  return DEFAULT_BACKEND_URL;
}

/**
 * Origin that serves uploaded media, derived from the API base URL by dropping
 * the `/personal-website/api` suffix. Used to absolutize relative media paths.
 */
export function resolveBackendOrigin(): string {
  const baseUrl = resolveBackendBaseUrl();
  try {
    return new URL(baseUrl).origin;
  } catch {
    return "";
  }
}
