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
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[18px] text-white ring-1 ring-white/20 transition hover:bg-white/20"
    >
      {isCopied ? (
        <HiOutlineCheck aria-hidden="true" />
      ) : (
        <HiOutlineClipboardCopy aria-hidden="true" />
      )}
    </button>
  );
}
