import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useKitMotion } from "@/components/kit/kitMotion";
import HydraArrowPill from "@/components/kit/HydraArrowPill";
import ImageScrollParallax from "@/components/animation/ImageScrollParallax";
import MaskedLineReveal from "@/components/animation/MaskedLineReveal";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type AboutIntroStatementProps = {
  label?: string;
  title?: string;
  button?: { text: string; href: string };
  imageSrc?: string;
  imageAlt?: string;
  ariaLabel?: string;
  className?: string;
};

const wipe = [0.65, 0, 0.35, 1] as const;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const AboutIntroStatement = ({
  label = "Introduction",
  title = "We build and run clean energy infrastructure that powers heavy industry, so the companies that make things can keep making them on solar, wind and stored power.",
  button = { text: "Learn more", href: "#about" },
  imageSrc = "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=1600",
  imageAlt = "",
  ariaLabel,
  className,
}: AboutIntroStatementProps) => {
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const kit = useKitMotion();
  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ["start end", "start start"] });
  const clipPath = useTransform(scrollYProgress, (p) => {
    const a = 1 - clamp01(p);
    return `inset(0% calc((100% - var(--container)) / 2 * ${a}) ${a * 18}% calc((100% - var(--container)) / 2 * ${a}))`;
  });

  return (
    <section aria-label={ariaLabel ?? label ?? "About"} className={cn("relative z-10 flex min-h-svh flex-col bg-background pb-[var(--section-space)] text-foreground", className)}>
      <div className="mx-auto flex w-[var(--container)] flex-col items-start gap-[clamp(1.5rem,2.4vw,2rem)] py-[var(--section-space)]">
        {label && (
          <motion.div
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: kit.fast, ease: wipe }}
            className="origin-left bg-accent px-[0.5rem] py-[0.25rem] text-accent-foreground"
          >
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: kit.fast, delay: kit.fast }}
              className="whitespace-nowrap font-[family-name:var(--font-label)] text-[length:var(--text-label)] uppercase"
            >
              {label}
            </motion.p>
          </motion.div>
        )}
        {title && (
          <MaskedLineReveal
            tag="h2"
            text={title}
            stagger={0.06}
            duration={kit.base}
            ease={kit.ease}
            className="max-w-[24em] text-balance text-[length:clamp(1.75rem,1.2rem+1.6vw,2.75rem)] leading-[1.2] tracking-[var(--heading-tracking)] [font-family:var(--font-heading)] [font-weight:var(--heading-weight)] [overflow-wrap:anywhere]"
          />
        )}
        {button && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: "1rem" }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: kit.base, ease: kit.ease, delay: 0.2 }}
          >
            <HydraArrowPill text={button.text} href={button.href} tone="deep" />
          </motion.div>
        )}
      </div>
      <motion.div
        ref={mediaRef}
        initial={reduce ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0 }}
        className="relative h-[80svh] w-full lg:h-svh"
      >
        <motion.div data-nav-dark style={reduce ? undefined : { clipPath }} className="absolute inset-0 overflow-hidden will-change-[clip-path]">
          <motion.div
            variants={{ hidden: { scale: 1.08 }, shown: { scale: 1, transition: { duration: kit.slow, ease: kit.ease } } }}
            className="absolute inset-0"
          >
            <ImageScrollParallax imageSrc={imageSrc} imageAlt={imageAlt} strength={0.2} className="absolute inset-0 aspect-auto h-full rounded-none" />
          </motion.div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-cols-4">
            {[0, 1, 2, 3].map((column) => (
              <div key={column} className="relative h-full">
                <motion.div
                  variants={{ hidden: { scaleY: 1 }, shown: { scaleY: 0, transition: { duration: kit.base, ease: wipe, delay: column * 0.05 } } }}
                  className="absolute inset-0 origin-top bg-background"
                />
                {column > 0 && (
                  <motion.div
                    variants={{ hidden: { scaleY: 0 }, shown: { scaleY: 1, transition: { duration: kit.slow, ease: wipe, delay: 0.2 + column * 0.07 } } }}
                    className="absolute inset-y-0 left-0 w-px origin-top bg-white/25"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutIntroStatement;
