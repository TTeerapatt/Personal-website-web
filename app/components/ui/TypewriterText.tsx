"use client";

import { useEffect, useState } from "react";

type TypewriterTextProps = {
  /** Taglines from `about_me.text_animation_*`, split on "|". */
  phrases: string[];
  className?: string;
};

type Phase = "typing" | "deleting";

const START_DELAY_MS = 450;
const TYPE_DELAY_MS = 70;
const DELETE_DELAY_MS = 38;
const HOLD_DELAY_MS = 1700;
const SWITCH_DELAY_MS = 260;

/**
 * Cycles through taglines with a typing effect.
 *
 * The first render shows the complete first phrase so the server HTML and the
 * initial client render match, then the animation takes over after mount. With
 * one phrase, or with reduced motion requested, it stays static.
 */
export default function TypewriterText({
  phrases,
  className = "",
}: TypewriterTextProps) {
  const firstPhrase = phrases[0] ?? "";

  const [isAnimated, setIsAnimated] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(firstPhrase.length);
  const [phase, setPhase] = useState<Phase>("typing");

  // Hand over to the animation after mount, so the first paint matches the
  // server HTML and the opening phrase is readable before it starts cycling.
  useEffect(() => {
    if (phrases.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => setIsAnimated(true), START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [phrases.length]);

  useEffect(() => {
    if (!isAnimated) return;

    const currentPhrase = phrases[phraseIndex] ?? "";
    let delay: number;
    let advance: () => void;

    if (phase === "typing") {
      if (charCount < currentPhrase.length) {
        delay = TYPE_DELAY_MS;
        advance = () => setCharCount((count) => count + 1);
      } else {
        delay = HOLD_DELAY_MS;
        advance = () => setPhase("deleting");
      }
    } else if (charCount > 0) {
      delay = DELETE_DELAY_MS;
      advance = () => setCharCount((count) => count - 1);
    } else {
      delay = SWITCH_DELAY_MS;
      advance = () => {
        setPhraseIndex((index) => (index + 1) % phrases.length);
        setPhase("typing");
      };
    }

    const timer = window.setTimeout(advance, delay);
    return () => window.clearTimeout(timer);
  }, [isAnimated, phase, charCount, phraseIndex, phrases]);

  if (!firstPhrase) return null;

  const visibleText = isAnimated
    ? (phrases[phraseIndex] ?? "").slice(0, charCount)
    : firstPhrase;

  return (
    <p className={className} aria-label={phrases.join(", ")}>
      <span aria-hidden={isAnimated}>{visibleText}</span>
      {isAnimated ? (
        <span
          aria-hidden="true"
          className="animate-caret ml-0.5 inline-block w-[2px] self-stretch bg-current align-middle"
          style={{ height: "1.05em" }}
        />
      ) : null}
    </p>
  );
}
