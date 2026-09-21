"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { HiOutlineCalendar, HiOutlineChevronDown } from "react-icons/hi";
import type { MediaType } from "@/app/types/content";
import MediaFrame from "./MediaFrame";
import RichText from "./RichText";

export type AccordionItem = {
  id: number;
  title: string;
  subtitle?: string;
  period?: string;
  durationLabel?: string;
  badge?: string;
  descriptionHtml: string;
  mediaUrl: string | null;
  mediaType: MediaType | null;
  logoAlt: string;
};

type AccordionListProps = {
  items: AccordionItem[];
  /** When false, only one panel may be open at a time (admin default). */
  allowMultiple?: boolean;
  /** Opens this item on first render. Defaults to the first item. */
  defaultOpenId?: number | null;
};

function AccordionRow({
  item,
  index,
  open,
  onToggle,
  isLast,
}: {
  item: AccordionItem;
  index: number;
  open: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const tCommon = useTranslations("common");
  const panelId = useId();

  return (
    <li className={`relative pl-16 sm:pl-20 ${isLast ? "" : "pb-4 sm:pb-5"}`}>
      <span
        className={`absolute top-1 left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border bg-[var(--surface)] text-[14px] font-bold shadow-sm sm:h-14 sm:w-14 sm:text-[15px] ${
          open
            ? "border-[var(--brand-primary)] text-[var(--brand-primary)]"
            : "border-[var(--border)] text-[var(--text-secondary)]"
        }`}
        aria-hidden="true"
      >
        {index}
      </span>

      <article
        className={`overflow-hidden rounded-[20px] border bg-[var(--surface)] shadow-[var(--shadow-card)] transition duration-200 ${
          open
            ? "border-[var(--brand-primary)]/35 shadow-[var(--shadow-card-hover)]"
            : "border-[var(--border)]"
        }`}
      >
        <div className="flex items-stretch gap-3 px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left sm:gap-4"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] sm:h-16 sm:w-16">
              <MediaFrame
                url={item.mediaUrl}
                mediaType={item.mediaType}
                alt={item.logoAlt}
                className="h-full w-full p-2"
                mediaClassName="h-full w-full object-contain"
                fallback={
                  <span className="text-[16px] font-bold text-[var(--brand-primary)]">
                    {item.title.trim().charAt(0).toUpperCase()}
                  </span>
                }
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="truncate text-[15px] font-semibold text-[var(--text-primary)] sm:text-[16px]">
                  {item.title}
                </span>
                {item.badge ? (
                  <span className="rounded-full bg-[rgba(31,122,77,0.1)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--success)] ring-1 ring-[rgba(31,122,77,0.22)]">
                    {item.badge}
                  </span>
                ) : null}
              </span>

              {item.subtitle ? (
                <span className="mt-0.5 block truncate text-[13px] font-medium text-[var(--brand-highlight)] sm:text-[14px]">
                  {item.subtitle}
                </span>
              ) : null}

              {item.period || item.durationLabel ? (
                <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-medium text-[var(--text-muted)] sm:text-[12.5px]">
                  {item.period ? <span>{item.period}</span> : null}
                  {item.period && item.durationLabel ? (
                    <span aria-hidden="true">·</span>
                  ) : null}
                  {item.durationLabel ? (
                    <span>{item.durationLabel}</span>
                  ) : null}
                </span>
              ) : null}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? tCommon("collapse") : tCommon("expand")}
            className={`inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center self-center rounded-xl bg-[var(--surface-muted)] text-[var(--text-secondary)] transition duration-200 ${
              open
                ? "rotate-180 bg-[var(--brand-soft)] text-[var(--brand-primary)]"
                : "hover:bg-[var(--surface-soft)]"
            }`}
          >
            <HiOutlineChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div
          id={panelId}
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="space-y-3 border-t border-[var(--border)] px-4 pt-3.5 pb-4 sm:px-5 sm:pb-5">
              {item.period ? (
                <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-medium leading-none text-[var(--text-muted)] sm:text-[13px]">
                  <span className="inline-flex items-center gap-1.5">
                    <HiOutlineCalendar
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{item.period}</span>
                  </span>
                  {item.durationLabel ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{item.durationLabel}</span>
                    </>
                  ) : null}
                </p>
              ) : null}

              <RichText
                html={item.descriptionHtml}
                className="text-[13.5px] sm:text-[14px]"
              />
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}

/**
 * Accordion list with a left timeline rail. Circles show the order number;
 * each row expands like the admin experience accordion.
 */
export default function AccordionList({
  items,
  allowMultiple = false,
  defaultOpenId = null,
}: AccordionListProps) {
  const [openIds, setOpenIds] = useState<number[]>(() => {
    if (defaultOpenId != null) return [defaultOpenId];
    if (items[0]) return [items[0].id];
    return [];
  });

  const toggle = (id: number) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (allowMultiple) {
        return isOpen ? prev.filter((value) => value !== id) : [...prev, id];
      }
      return isOpen ? [] : [id];
    });
  };

  if (items.length === 0) return null;

  return (
    <ol className="relative mx-auto max-w-3xl">
      <span
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-[23px] w-px bg-[var(--border-strong)] sm:left-[27px]"
      />

      {items.map((item, index) => (
        <AccordionRow
          key={item.id}
          item={item}
          index={index + 1}
          open={openIds.includes(item.id)}
          onToggle={() => toggle(item.id)}
          isLast={index === items.length - 1}
        />
      ))}
    </ol>
  );
}
