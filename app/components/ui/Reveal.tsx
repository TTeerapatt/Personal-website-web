"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger in milliseconds, applied as a CSS transition delay. */
  delay?: number;
  className?: string;
};

/**
 * Plays a one-shot fade/slide animation when the element scrolls into view.
 *
 * The hidden starting state is defined in `globals.css` so it ships in the
 * server HTML; this only flips `data-revealed`. Children stay server-rendered
 * because they are passed through untouched.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: RevealProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.dataset.revealed = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "true";
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={nodeRef}
      className={`reveal ${className}`.trim()}
      style={delay ? { ["--reveal-delay" as string]: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
