"use client";

import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import type { Skill } from "@/app/types/content";
import { resolveMediaUrl } from "@/app/lib/mediaUrl";

const SKILLS_PER_ROW = 8;

type SkillsMarqueeProps = {
  skills: Skill[];
};

type SkillLogo = {
  id: number;
  name: string;
  src: string;
};

function chunkRows(items: SkillLogo[], size: number): SkillLogo[][] {
  if (items.length === 0) return [];

  const rows: SkillLogo[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

function SkillLogoItem({ skill }: { skill: SkillLogo }) {
  return (
    <div
      className="mx-7 flex h-12 w-12 shrink-0 items-center justify-center sm:mx-9 sm:h-14 sm:w-14 md:mx-11 md:h-16 md:w-16 lg:mx-14 lg:h-[4.5rem] lg:w-[4.5rem]"
      title={skill.name}
    >
      {/* Uploads come from the API origin, so next/image remote patterns cannot cover them. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={skill.src}
        alt={skill.name}
        className="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

/**
 * Continuous logo marquee. Skills are split into rows of 8; each row scrolls
 * on its own (alternating direction) so a long list stays readable.
 */
export default function SkillsMarquee({ skills }: SkillsMarqueeProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const logos: SkillLogo[] = skills.flatMap((skill) => {
    const src = resolveMediaUrl(skill.url);
    if (!src) return [];
    return [{ id: skill.id, name: skill.name, src }];
  });

  const rows = chunkRows(logos, SKILLS_PER_ROW);
  if (rows.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 md:gap-10" aria-label="Skills">
      {rows.map((row, rowIndex) => {
        const direction = rowIndex % 2 === 0 ? "left" : "right";

        return (
          <Marquee
            key={`skills-row-${rowIndex}`}
            direction={direction}
            speed={38}
            delay={rowIndex * 0.35}
            play={!prefersReducedMotion}
            pauseOnHover
            autoFill
            gradient
            gradientColor="#eef2f7"
            gradientWidth="12%"
            className="overflow-hidden py-1"
          >
            {row.map((skill) => (
              <SkillLogoItem key={skill.id} skill={skill} />
            ))}
          </Marquee>
        );
      })}
    </div>
  );
}
