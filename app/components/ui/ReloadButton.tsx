"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { HiOutlineRefresh } from "react-icons/hi";

type ReloadButtonProps = {
  label: string;
};

/** Re-runs the server render so a transient API failure can recover in place. */
export default function ReloadButton({ label }: ReloadButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[var(--brand-accent)] disabled:cursor-wait disabled:opacity-70"
    >
      <HiOutlineRefresh
        aria-hidden="true"
        className={`text-[17px] ${isPending ? "animate-spin" : ""}`}
      />
      {label}
    </button>
  );
}
