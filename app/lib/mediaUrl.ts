/**
 * The API builds upload URLs from the request `Host` header and falls back to a
 * relative `/upload/...` path when that header is missing. Absolutize those so
 * media still loads when the web app runs on a different origin than the API.
 */
function resolveBackendOrigin(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:3006/personal-website/api/";

  try {
    return new URL(baseUrl).origin;
  } catch {
    return "";
  }
}

export function resolveMediaUrl(
  url: string | null | undefined
): string | null {
  const trimmed = url?.trim();
  if (!trimmed) return null;

  if (/^(?:https?:)?\/\//i.test(trimmed)) return trimmed;
  if (!trimmed.startsWith("/")) return trimmed;

  const origin = resolveBackendOrigin();
  return origin ? `${origin}${trimmed}` : trimmed;
}

/** External links are stored free-form; make sure they carry a scheme. */
export function resolveExternalUrl(
  url: string | null | undefined
): string | null {
  const trimmed = url?.trim();
  if (!trimmed) return null;

  if (/^(?:https?|mailto|tel):/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return trimmed;
  return `https://${trimmed}`;
}
