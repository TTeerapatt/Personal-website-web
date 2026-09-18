import { sanitizeHtml } from "@/app/lib/sanitizeHtml";

type RichTextProps = {
  html: string | null | undefined;
  className?: string;
};

/** Renders `description_*` HTML authored in the admin rich-text editor. */
export default function RichText({ html, className = "" }: RichTextProps) {
  const sanitized = sanitizeHtml(html);
  if (!sanitized) return null;

  return (
    <div
      className={`rich-text ${className}`.replace(/\s+/g, " ").trim()}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
