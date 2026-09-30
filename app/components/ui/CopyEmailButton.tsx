"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { HiOutlineCheck, HiOutlineClipboardCopy } from "react-icons/hi";

type CopyEmailButtonProps = {
  email: string;
};

/** Copies the email to the clipboard, with a brief confirmation state. */
export default function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const t = useTranslations("contact");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timer = window.setTimeout(() => setIsCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [isCopied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setIsCopied(true);
    } catch {
      // Clipboard access can be blocked; the mailto link remains available.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={isCopied ? t("copiedEmail") : t("copyEmail")}
      title={isCopied ? t("copiedEmail") : t("copyEmail")}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[17px] text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--brand-primary)]"
    >
      {isCopied ? (
        <HiOutlineCheck aria-hidden="true" />
      ) : (
        <HiOutlineClipboardCopy aria-hidden="true" />
      )}
    </button>
  );
}
