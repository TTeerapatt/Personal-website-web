import { sanitizeHtml } from "@/app/lib/sanitizeHtml";

type RichTextProps = {
  html: string | null | undefined;
  /** Light-on-dark variant, for rich text over the navy hero. */
  inverse?: boolean;
  className?: string;
};

/** Renders `description_*` HTML authored in the admin rich-text editor. */
export default function RichText({
  html,
  inverse = false,
  className = "",
}: RichTextProps) {
  const sanitized = sanitizeHtml(html);
  if (!sanitized) return null;

  return (
    <div
      className={`rich-text ${inverse ? "rich-text-inverse" : ""} ${className}`
        .replace(/\s+/g, " ")
        .trim()}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
