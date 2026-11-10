import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import MaskedLineReveal from "@/components/animation/MaskedLineReveal";
import HydraArrowPill from "@/components/kit/HydraArrowPill";
import { useKitMotion } from "@/components/kit/kitMotion";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type FooterLink = { text: string; href?: string };
type FooterColumn = { title: string; links: FooterLink[] };

type FooterLimeWordmarkProps = {
  description?: string;
  primaryButton?: { text: string; href?: string };
  columns?: FooterColumn[];
  wordmark?: string;
  city?: string;
  timeZone?: string;
  copyright?: string;
  ariaLabel?: string;
  className?: string;
};

const defaultColumns: FooterColumn[] = [
  { title: "Pages", links: [{ text: "Home" }, { text: "Projects" }, { text: "About" }, { text: "Contact" }] },
  { title: "Social", links: [{ text: "Instagram" }, { text: "LinkedIn" }] },
];

const formatTime = (timeZone: string) => {
  try {
    return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
  }
};

const FooterLimeWordmark = ({
  description = "Start your project today. Tell us about your site and let's work together to reach your goals.",
  primaryButton = { text: "Start a project", href: "#contact" },
  columns = defaultColumns,
  wordmark = "©Studio",
  city = "Amsterdam",
  timeZone = "Europe/Amsterdam",
  copyright = "©2026 All rights reserved",
  ariaLabel,
  className,
}: FooterLimeWordmarkProps) => {
  const reduce = useReducedMotion();
  const kit = useKitMotion();
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(formatTime(timeZone));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -5% 0px" },
    transition: { duration: kit.base, ease: kit.ease, delay },
  });

  return (
    <section aria-label={ariaLabel ?? "Footer"} data-tone="deep" className={cn("relative flex flex-col overflow-hidden bg-background pb-2 pt-[var(--section-space)] text-foreground", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 grid w-[var(--container)] -translate-x-1/2 grid-cols-4">
        {[0, 1, 2, 3].map((column) => (
          <div key={column} className="border-l border-[color-mix(in_srgb,var(--deep-foreground)_8%,transparent)] last:border-r" />
        ))}
      </div>
      <footer className="relative mx-auto flex w-[var(--container)] flex-col gap-[clamp(3.5rem,7.5vw,7rem)]">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-[var(--gap)]">
          <div className="flex max-w-[25rem] flex-col items-start gap-4">
            {description && (
              <motion.p {...rise(0)} className="text-balance text-[length:var(--text-body-lg)] font-medium leading-[1.2] tracking-[-0.04em]">
                {description}
              </motion.p>
            )}
            {primaryButton && (
              <motion.div {...rise(0.1)}>
                <HydraArrowPill text={primaryButton.text} href={primaryButton.href} tone="lime" />
              </motion.div>
            )}
          </div>
          <div className="flex flex-wrap gap-x-[clamp(3rem,5.5vw,5rem)] gap-y-10">
            {columns.map((column, index) => (
              <motion.div key={column.title} {...rise(0.1 + index * 0.08)} className="flex flex-col gap-5 lg:flex-row lg:gap-16">
                <p className="whitespace-nowrap pt-1 font-mono text-[length:var(--text-label)] uppercase leading-[1.2] before:content-['↳_']">{column.title}</p>
                <ul className="flex flex-col gap-1">
                  {column.links.map((link) => (
                    <li key={link.text}>
                      <a href={link.href ?? "#"} className="whitespace-nowrap text-[length:var(--text-body)] leading-[1.35] tracking-[-0.03em] transition-opacity hover:opacity-70">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <MaskedLineReveal
            tag="p"
            lines={[wordmark]}
            duration={kit.slow}
            className="w-auto whitespace-nowrap text-[length:clamp(4rem,11vw,10rem)] leading-[0.95] tracking-[-0.05em] [font-family:var(--font-heading)]"
          />
          <motion.div {...rise(0.2)} className="flex flex-col gap-3 pb-[clamp(0.25rem,1.2vw,1rem)] font-mono text-[length:var(--text-label)] uppercase leading-[1.2] lg:flex-row lg:gap-4">
            <p className="whitespace-nowrap tabular-nums">
              {city}: {time}
            </p>
            <p className="whitespace-nowrap">{copyright}</p>
          </motion.div>
        </div>
      </footer>
    </section>
  );
};

export default FooterLimeWordmark;
