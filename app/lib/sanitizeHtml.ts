/**
 * Conservative sanitizer for the `description_*` rich text written in the admin
 * CMS (TipTap HTML). The source is trusted, so this is defence in depth against
 * a compromised admin account rather than the primary control.
 */

const DANGEROUS_ELEMENTS = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "base",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "svg",
];

const EVENT_HANDLER_ATTRIBUTE = /\son[a-z-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const UNSAFE_URL_ATTRIBUTE =
  /\s(?:href|src|xlink:href)\s*=\s*(?:"\s*(?:javascript|data|vbscript):[^"]*"|'\s*(?:javascript|data|vbscript):[^']*'|(?:javascript|data|vbscript):[^\s>]+)/gi;

function stripElement(html: string, tagName: string): string {
  const paired = new RegExp(
    `<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}\\s*>`,
    "gi"
  );
  const unpaired = new RegExp(`<\\/?${tagName}\\b[^>]*>`, "gi");
  return html.replace(paired, "").replace(unpaired, "");
}

/** Returns sanitized HTML safe to pass to `dangerouslySetInnerHTML`. */
export function sanitizeHtml(value: string | null | undefined): string {
  if (!value) return "";

  let html = String(value);
  for (const tagName of DANGEROUS_ELEMENTS) {
    html = stripElement(html, tagName);
  }

  return html
    .replace(EVENT_HANDLER_ATTRIBUTE, "")
    .replace(UNSAFE_URL_ATTRIBUTE, "")
    .trim();
}

/** True when the rich text has no renderable content (e.g. "<p></p>"). */
export function isHtmlEmpty(value: string | null | undefined): boolean {
  const sanitized = sanitizeHtml(value);
  if (!sanitized) return true;

  const text = sanitized
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();

  // Keep non-text media such as images even when there are no words.
  return text.length === 0 && !/<img\b/i.test(sanitized);
}

/** Plain-text preview of rich text, used for meta descriptions. */
export function htmlToPlainText(
  value: string | null | undefined,
  maxLength = 160
): string {
  const text = sanitizeHtml(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|h[1-6]|li)>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}
