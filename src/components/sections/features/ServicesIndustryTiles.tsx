import { useId, useRef, useState, type KeyboardEvent } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useImageReady, useKitMotion } from "@/components/kit/kitMotion";
import MaskedLineReveal from "@/components/animation/MaskedLineReveal";
import HydraArrowPill from "@/components/kit/HydraArrowPill";
import { MotionMedia } from "@/components/kit/Media";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type Industry = { title: string; description?: string; facts?: string[]; imageSrc?: string; imageAlt?: string; href?: string };

type ServicesIndustryTilesProps = {
  label?: string;
  title?: string;
  description?: string;
  items?: Industry[];
  linkText?: string;
  ariaLabel?: string;
  className?: string;
};

const photo = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&w=800`;

const defaultItems: Industry[] = [
  { title: "Data centres", description: "Round the clock power with storage on site.", facts: ["Battery storage bridges grid dips", "Solar and storage on one contract", "Monitored daily from Rotterdam"], imageSrc: photo(4508751), imageAlt: "Server aisle in a data centre", href: "#contact" },
  { title: "Manufacturing", description: "Rooftop solar sized to your shift pattern.", facts: ["Rooftop arrays from 200 kWp", "Load matched to shift schedules", "Installed without stopping lines"], imageSrc: photo(5824883), imageAlt: "Workshop floor", href: "#contact" },
  { title: "Logistics", description: "Charging and power for fleets and hubs.", facts: ["Depot charging for electric trucks", "Peak shaving at busy loading hours", "Grid upgrades handled for you"], imageSrc: photo(13961751), imageAlt: "Fleet of trucks from above", href: "#contact" },
  { title: "Agriculture", description: "Field solar that shares land with crops.", facts: ["Panels raised above working crops", "Irrigation pumps run on daytime sun", "Land leases set for 25 years"], imageSrc: photo(1166209), imageAlt: "Field at sunset", href: "#contact" },
];

const strips = [0, 1, 2, 3];

const columns = (count: number) => {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 lg:grid-cols-2";
  if (count === 3) return "grid-cols-1 lg:grid-cols-3";
  return "grid-cols-1 lg:grid-cols-2 xl:grid-cols-4";
};

type FlipCardProps = { item: Industry; index: number; linkText: string; reduce: boolean };

const FlipCard = ({ item, index, linkText, reduce }: FlipCardProps) => {
  const kit = useKitMotion();
  const backId = useId();
  const liRef = useRef<HTMLLIElement>(null);
  const inView = useInView(liRef, { once: true, margin: "0px 0px -10% 0px" });
  const ready = useImageReady(liRef, inView);
  const [flipped, setFlipped] = useState(false);
  const frontRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const openCard = () => {
    setFlipped(true);
    requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
  };

  const closeCard = () => {
    setFlipped(false);
    requestAnimationFrame(() => frontRef.current?.focus({ preventScroll: true }));
  };

  const onFrontKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCard();
    }
  };

  const onBackKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") closeCard();
  };

  return (
    <motion.li
      ref={liRef}
      initial={reduce ? false : "hidden"}
      animate={reduce || (inView && ready) ? "shown" : "hidden"}
      variants={{ hidden: { opacity: 0, y: "2rem" }, shown: { opacity: 1, y: 0, transition: { duration: kit.base, ease: kit.ease, delay: (index % 4) * 0.06 } } }}
      className="flex"
    >
      <div className="relative aspect-[4/5] w-full perspective-[1400px] lg:aspect-[3/4]">
        <div
          className={cn(
            "relative size-full transform-3d",
            !reduce && "transition-transform duration-[var(--dur-slow)] ease-[var(--ease-in-out)]",
            !reduce && flipped && "rotate-y-180"
          )}
        >
          <div
            ref={frontRef}
            role="button"
            tabIndex={flipped ? -1 : 0}
            aria-expanded={flipped}
            aria-controls={backId}
            aria-label={`Show details for ${item.title}`}
            aria-hidden={flipped}
            inert={flipped}
            onClick={openCard}
            onKeyDown={onFrontKey}
            className={cn(
              "kit-card group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-[clamp(1.25rem,2vw,2rem)] overflow-hidden p-[1rem] text-center outline-none backface-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              flipped && "pointer-events-none",
              reduce && "transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)]",
              reduce && flipped && "opacity-0"
            )}
          >
            <div aria-hidden="true" className="absolute right-[1rem] top-[1rem] grid size-[2.25rem] place-items-center rounded-full bg-[color-mix(in_srgb,var(--foreground)_12%,transparent)] text-foreground transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)] group-focus-visible:bg-accent group-focus-visible:text-accent-foreground lg:group-hover:bg-accent lg:group-hover:text-accent-foreground">
              <svg viewBox="0 0 16 16" className="size-[1rem]" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <path d="M8 2.5v11M2.5 8h11" />
              </svg>
            </div>
            {item.imageSrc && (
              <div className="relative aspect-square w-[45%] overflow-hidden">
                <MotionMedia
                  src={item.imageSrc}
                  alt={item.imageAlt ?? item.title}
                  loading="lazy"
                  decoding="async"
                  variants={reduce ? undefined : { hidden: { scale: 1.08 }, shown: { scale: 1, transition: { duration: kit.slow, ease: kit.ease, delay: 0.15 } } }}
                  className="size-full object-cover"
                />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-cols-4">
                  {strips.map((strip) => (
                    <motion.div
                      key={strip}
                      variants={reduce ? undefined : { hidden: { scaleY: 1 }, shown: { scaleY: 0, transition: { duration: kit.base, ease: kit.easeInOut, delay: 0.15 + strip * 0.07 } } }}
                      initial={reduce ? { scaleY: 0 } : undefined}
                      className="h-full origin-top bg-card"
                    />
                  ))}
                </div>
              </div>
            )}
            <h3 className="max-w-[16rem] text-balance text-[length:var(--text-body-lg)] font-medium leading-[1.2] tracking-[-0.04em] [overflow-wrap:anywhere]">{item.title}</h3>
          </div>
          <div
            id={backId}
            aria-hidden={!flipped}
            inert={!flipped}
            onKeyDown={onBackKey}
            className={cn(
              "absolute inset-0 flex flex-col justify-between gap-[1.25rem] overflow-hidden rounded-[var(--radius-card)] bg-deep p-[1.25rem] pt-[4rem] text-accent backface-hidden lg:p-[1.5rem] lg:pt-[4rem]",
              !flipped && "pointer-events-none",
              reduce ? cn("transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)]", flipped ? "opacity-100" : "opacity-0") : "rotate-y-180"
            )}
          >
            <button
              ref={closeRef}
              type="button"
              aria-label="Close details"
              onClick={closeCard}
              className="absolute right-[1rem] top-[1rem] grid size-[2.25rem] cursor-pointer place-items-center rounded-full bg-accent text-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-deep"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="size-[1rem] rotate-45" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <path d="M8 2.5v11M2.5 8h11" />
              </svg>
            </button>
            <div className="flex flex-col gap-[0.75rem]">
              <p className="text-balance text-[length:var(--text-body-lg)] font-medium leading-[1.2] tracking-[-0.04em] [overflow-wrap:anywhere]">{item.title}</p>
              {item.description && <p className="text-balance text-[length:var(--text-small)] leading-[1.4] text-[color-mix(in_srgb,var(--accent)_72%,var(--deep))]">{item.description}</p>}
            </div>
            {item.facts && item.facts.length > 0 && (
              <ul className="flex flex-col border-t border-[color-mix(in_srgb,var(--accent)_22%,transparent)]">
                {item.facts.map((fact, factIndex) => (
                  <li key={factIndex} className="border-b border-[color-mix(in_srgb,var(--accent)_22%,transparent)] py-[0.5rem]">
                    <p className="text-[length:var(--text-small)] leading-[1.35]">{fact}</p>
                  </li>
                ))}
              </ul>
            )}
            <HydraArrowPill text={linkText} href={item.href ?? "#"} tone="lime" className="self-start" />
          </div>
        </div>
      </div>
    </motion.li>
  );
};

const ServicesIndustryTiles = ({ label, title = "Industries we serve", description, items = defaultItems, linkText = "Learn more", ariaLabel, className }: ServicesIndustryTilesProps) => {
  const reduce = useReducedMotion() ?? false;
  const kit = useKitMotion();

  return (
    <section aria-label={ariaLabel ?? title ?? "Industries"} className={cn("relative overflow-x-clip bg-background py-[var(--section-space)] text-foreground", className)}>
      <div className="mx-auto w-[var(--container)]">
        {(label || title || description) && (
          <div className="flex flex-col items-start gap-[clamp(1rem,1.6vw,1.5rem)] lg:flex-row lg:items-end lg:justify-between">
            <div className="flex w-full min-w-0 flex-col items-start gap-[clamp(1rem,1.6vw,1.5rem)]">
              {label && (
                <motion.div
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: kit.fast, ease: kit.easeInOut }}
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
                  className="max-w-[14em] text-balance text-[length:var(--text-h2)] leading-[var(--heading-leading)] tracking-[var(--heading-tracking)] [font-family:var(--font-heading)] [font-weight:var(--heading-weight)] [overflow-wrap:anywhere]"
                />
              )}
            </div>
            {description && (
              <motion.p
                initial={reduce ? false : { opacity: 0, y: "1rem" }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: kit.base, ease: kit.ease, delay: 0.1 }}
                className="max-w-[34rem] text-balance text-[length:var(--text-body)] leading-[1.5] text-muted-foreground lg:max-w-[22rem]"
              >
                {description}
              </motion.p>
            )}
          </div>
        )}

        <ul className={cn("mt-[clamp(1.5rem,3vw,3rem)] grid gap-[0.5rem]", columns(items.length))}>
          {items.map((item, index) => (
            <FlipCard key={index} item={item} index={index} linkText={linkText} reduce={reduce} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ServicesIndustryTiles;
