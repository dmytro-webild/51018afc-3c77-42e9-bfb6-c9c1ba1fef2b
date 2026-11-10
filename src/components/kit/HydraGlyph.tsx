"use client";

import { motion, useReducedMotion } from "motion/react";

export type HydraGlyphVariant = "dots" | "bars" | "ring" | "rings";

type HydraGlyphProps = {
  variant?: HydraGlyphVariant;
  className?: string;
};

const ease = [0.19, 1, 0.22, 1] as const;
const lime = "fill-[var(--accent)]";
const dim = "fill-[color-mix(in_srgb,currentColor_35%,transparent)]";

const HydraGlyph = ({ variant = "dots", className = "size-[7.5rem]" }: HydraGlyphProps) => {
  const reduce = useReducedMotion();
  const show = reduce ? false : "hidden";

  if (variant === "dots") {
    const dots = [
      { cx: 30, cy: 30, on: true },
      { cx: 90, cy: 30, on: true },
      { cx: 30, cy: 90, on: false },
      { cx: 90, cy: 90, on: true },
    ];
    return (
      <motion.svg viewBox="0 0 120 120" aria-hidden="true" className={className} initial={show} whileInView="shown" viewport={{ once: true, margin: "-10%" }}>
        {dots.map((dot, index) => (
          <motion.circle
            key={index}
            cx={dot.cx}
            cy={dot.cy}
            r="30"
            className={dot.on ? lime : dim}
            style={{ transformOrigin: `${dot.cx}px ${dot.cy}px` }}
            variants={{ hidden: { scale: 0 }, shown: { scale: 1, transition: { duration: 0.8, ease, delay: index * 0.08 } } }}
          />
        ))}
      </motion.svg>
    );
  }

  if (variant === "bars") {
    return (
      <motion.svg viewBox="0 0 120 100" aria-hidden="true" className={className} initial={show} whileInView="shown" viewport={{ once: true, margin: "-10%" }}>
        {Array.from({ length: 7 }, (_, index) => (
          <motion.rect
            key={index}
            x={index * 18 + 2}
            y="0"
            width="7"
            height="100"
            className={index < 3 ? lime : dim}
            style={{ transformOrigin: `${index * 18 + 5.5}px 100px` }}
            variants={{ hidden: { scaleY: 0 }, shown: { scaleY: 1, transition: { duration: 0.8, ease, delay: index * 0.06 } } }}
          />
        ))}
      </motion.svg>
    );
  }

  if (variant === "ring") {
    return (
      <motion.svg viewBox="0 0 120 120" aria-hidden="true" className={className} initial={show} whileInView="shown" viewport={{ once: true, margin: "-10%" }}>
        <circle cx="60" cy="60" r="55" fill="none" strokeWidth="6" className="stroke-[color-mix(in_srgb,currentColor_35%,transparent)]" />
        <motion.circle
          cx="60"
          cy="60"
          r="55"
          fill="none"
          strokeWidth="6"
          className="stroke-[var(--accent)]"
          style={{ rotate: -90, transformOrigin: "60px 60px" }}
          variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 0.3, transition: { duration: 1.2, ease } } }}
        />
      </motion.svg>
    );
  }

  return (
    <motion.svg viewBox="0 0 120 120" aria-hidden="true" className={className} initial={show} whileInView="shown" viewport={{ once: true, margin: "-10%" }}>
      {[54, 42, 30, 18].map((radius, index) => (
        <motion.circle
          key={radius}
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="6"
          className={index % 2 === 0 ? "stroke-[var(--accent)]" : "stroke-[color-mix(in_srgb,currentColor_35%,transparent)]"}
          style={{ transformOrigin: "60px 60px" }}
          variants={{ hidden: { scale: 0.4, opacity: 0 }, shown: { scale: 1, opacity: 1, transition: { duration: 1, ease, delay: (3 - index) * 0.08 } } }}
        />
      ))}
    </motion.svg>
  );
};

export default HydraGlyph;
