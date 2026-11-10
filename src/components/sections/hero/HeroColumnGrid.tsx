import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCoverNext } from "@/components/kit/sectionNeighbour";
import MaskedLineReveal from "@/components/animation/MaskedLineReveal";
import HydraArrowPill from "@/components/kit/HydraArrowPill";
import Media from "@/components/kit/Media";

type Cta = { text: string; href?: string };

type HeroColumnGridProps = {
  title?: string;
  description?: string;
  primaryButton?: Cta;
  imageSrc?: string;
  imageAlt?: string;
  scrollHint?: string;
  introDelay?: number;
  ariaLabel?: string;
  className?: string;
};

const EASE_OUT = [0.19, 1, 0.22, 1] as const;
const EASE_WIPE = [0.65, 0, 0.35, 1] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const LINES = [
  { left: "0%", className: "hidden lg:block" },
  { left: "25%", className: "" },
  { left: "50%", className: "" },
  { left: "75%", className: "" },
];

const HeroColumnGrid = ({
  title = "Clean power for the industry that runs on it",
  description = "We build and run solar, wind and battery infrastructure so industrial sites cut carbon without cutting output.",
  primaryButton = { text: "Start a project", href: "#contact" },
  imageSrc = "https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg?auto=compress&cs=tinysrgb&w=1600",
  imageAlt = "",
  scrollHint = "",
  introDelay = 0,
  ariaLabel,
  className = "",
}: HeroColumnGridProps) => {
  const ref = useRef<HTMLElement>(null);
  useCoverNext(ref);
  const reduce = !!useReducedMotion();
  const live = !reduce;
  const drawLines = live && introDelay < 0.5;

  const { scrollYProgress: pin } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const photoY = useTransform(pin, (v) => (live ? `${clamp01(v) * 14}%` : "0%"));
  const shade = useTransform(pin, (v) => (live ? clamp01(v) * 0.45 : 0));
  const textOpacity = useTransform(pin, (v) => (live ? 1 - clamp01(v / 0.45) : 1));
  const textY = useTransform(pin, (v) => (live ? `${-clamp01(v / 0.45) * 3}rem` : "0rem"));

  const rise = (delay: number) =>
    live
      ? { initial: { opacity: 0, y: "1.25rem" }, animate: { opacity: 1, y: "0rem" }, transition: { duration: 1.1, ease: EASE_OUT, delay } }
      : {};

  return (
    <section ref={ref} aria-label={ariaLabel || "Hero section"} data-scene className={`${live ? "relative -mb-[100svh] h-[200svh]" : "relative h-svh"} ${className}`}>
      <div className="sticky top-0 h-svh overflow-hidden bg-deep text-white">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div style={{ y: photoY }} className="absolute inset-x-0 -top-[14%] h-[128%] will-change-transform">
            <Media
              src={imageSrc}
              alt={imageAlt}
              aria-hidden={imageAlt === ""}
              loading="eager"
              decoding="async"
              className="size-full object-cover"
            />
          </motion.div>
          <div aria-hidden="true" className="absolute inset-0 bg-black/35" />
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 z-[2] w-full -translate-x-1/2 lg:w-[var(--container)]">
          {LINES.map((line, i) => (
            <motion.div
              key={line.left}
              initial={drawLines ? { transform: "scaleY(0)" } : false}
              animate={{ transform: "scaleY(1)" }}
              transition={{ duration: 0.9, ease: EASE_WIPE, delay: 0.1 + i * 0.06 }}
              style={{ left: line.left }}
              className={`absolute inset-y-0 w-px origin-top bg-white/25 ${line.className}`}
            />
          ))}
          <motion.div
            initial={drawLines ? { transform: "scaleY(0)" } : false}
            animate={{ transform: "scaleY(1)" }}
            transition={{ duration: 0.9, ease: EASE_WIPE, delay: 0.34 }}
            className="absolute inset-y-0 right-0 hidden w-px origin-top bg-white/25 lg:block"
          />
        </div>

        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 z-[3] mx-auto flex w-[var(--container)] flex-col items-center justify-center pt-[4.5rem] text-center"
        >
          <MaskedLineReveal
            tag="h1"
            text={title}
            immediate
            delay={introDelay}
            stagger={0.1}
            duration={1.1}
            className="w-[min(100%,44rem)] text-balance text-center font-[family-name:var(--font-heading)] text-[length:calc(var(--text-display)*1.2)] leading-[1.1] tracking-[-0.05em] text-white [font-weight:var(--heading-weight)] lg:text-[length:var(--text-display)]"
          />
          {description && (
            <motion.p
              {...rise(introDelay + 0.2)}
              className="mt-[1.5rem] w-[min(100%,31.25rem)] text-balance text-[length:calc(var(--text-body)*1.06)] leading-[1.35] tracking-[-0.03em] text-white/90"
            >
              {description}
            </motion.p>
          )}
          {primaryButton && (
            <motion.div {...rise(introDelay + 0.32)} className="mt-[1.5rem]">
              <HydraArrowPill text={primaryButton.text} href={primaryButton.href} tone="lime" />
            </motion.div>
          )}
        </motion.div>

        {scrollHint && (
          <motion.p
            {...rise(introDelay + 0.6)}
            style={{ opacity: textOpacity }}
            className="absolute inset-x-0 bottom-[var(--gutter)] z-[3] text-center font-[family-name:var(--font-label)] text-[length:var(--text-label)] uppercase leading-[1.2] tracking-[-0.04em] text-white"
          >
            {scrollHint}
          </motion.p>
        )}

        {live && <motion.div aria-hidden="true" style={{ opacity: shade }} className="pointer-events-none absolute inset-0 z-[8] bg-black" />}
      </div>
    </section>
  );
};

export default HeroColumnGrid;
