import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useKitMotion } from "@/components/kit/kitMotion";
import HydraArrowPill from "@/components/kit/HydraArrowPill";
import MaskedLineReveal from "@/components/animation/MaskedLineReveal";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type Question = { title: string; description: string };

type FaqGlyphRowsProps = {
  label?: string;
  title?: string;
  description?: string;
  button?: { text: string; href: string };
  items?: Question[];
  ariaLabel?: string;
  className?: string;
};

const wipe = [0.65, 0, 0.35, 1] as const;

const defaults: Question[] = [
  { title: "What kind of sites do you build on?", description: "Industrial roofs, brownfield land and coastal plots near heavy users. We assess grid access, ground and permits before any design work starts." },
  { title: "Do we need to pay for the installation?", description: "Not always. Under a power purchase agreement we finance, build and run the plant, and you pay only for the energy it delivers." },
  { title: "How long does a project take?", description: "A rooftop array runs about four months from survey to power. Larger wind and storage sites take one to two years, mostly for permits." },
  { title: "Who runs the plant once it is live?", description: "Our operations team in Rotterdam monitors every site around the clock and handles maintenance, repairs and yearly reporting." },
  { title: "Can storage keep our plant running at night?", description: "Yes. Battery systems are sized to your load profile so stored power covers evening peaks and short grid outages." },
];

const FaqGlyphRows = ({
  label = "FAQ",
  title = "Questions we hear most",
  description = "Straight answers on sites, financing and running a plant with us.",
  button = { text: "Contact us", href: "#contact" },
  items = defaults,
  ariaLabel,
  className,
}: FaqGlyphRowsProps) => {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();
  const kit = useKitMotion();

  return (
    <section aria-label={ariaLabel ?? title ?? "FAQ"} className={cn("relative overflow-x-clip bg-background py-[var(--section-space)] text-foreground", className)}>
      <div className="mx-auto grid w-[var(--container)] grid-cols-1 gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-[clamp(2rem,5vw,6rem)]">
        <div className="flex flex-col items-start gap-[clamp(1rem,1.6vw,1.5rem)] lg:sticky lg:top-[6rem] lg:self-start">
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
              className="max-w-[12em] text-balance text-[length:var(--text-h2)] leading-[var(--heading-leading)] tracking-[var(--heading-tracking)] [font-family:var(--font-heading)] [font-weight:var(--heading-weight)] [overflow-wrap:anywhere]"
            />
          )}
          {description && (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: "1rem" }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: kit.base, ease: kit.ease, delay: 0.1 }}
              className="max-w-[34rem] text-balance text-[length:var(--text-body)] leading-[1.5] text-muted-foreground"
            >
              {description}
            </motion.p>
          )}
          {button && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: "1rem" }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: kit.base, ease: kit.ease, delay: 0.2 }}
              className="mt-[0.5rem]"
            >
              <HydraArrowPill text={button.text} href={button.href} tone="deep" />
            </motion.div>
          )}
        </div>
        <ul className="flex flex-col">
          {items.map((item, index) => {
            const isOpen = open === index;
            return (
              <li key={index} className="relative">
                <motion.div
                  aria-hidden="true"
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: kit.slow, ease: wipe, delay: Math.min(index, 6) * 0.05 }}
                  className="absolute inset-x-0 top-0 h-px origin-left bg-border"
                />
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-[1rem] py-[clamp(1.25rem,2vw,1.75rem)] text-left"
                >
                  <p className="min-w-0 text-balance text-[length:var(--text-body-lg)] leading-[1.3] tracking-[-0.02em] [font-family:var(--font-heading)] [overflow-wrap:anywhere]">{item.title}</p>
                  <motion.div
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: reduce ? 0 : kit.base, ease: kit.ease }}
                    className="grid size-[2.25rem] shrink-0 place-items-center rounded-full bg-input text-foreground"
                  >
                    <svg viewBox="0 0 16 16" className="size-[0.875rem]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                      <path d="M8 2.5v11M2.5 8h11" />
                    </svg>
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduce ? false : { height: 0 }}
                      animate={{ height: "auto" }}
                      exit={reduce ? undefined : { height: 0 }}
                      transition={{ duration: kit.base, ease: kit.ease }}
                      className="overflow-hidden"
                    >
                      <motion.p
                        initial={reduce ? false : { opacity: 0, y: "1rem" }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: kit.base, ease: kit.ease, delay: 0.1 }}
                        className="max-w-[40rem] pb-[clamp(1.25rem,2vw,1.75rem)] pr-[3.25rem] text-[length:var(--text-body)] leading-[1.55] text-muted-foreground"
                      >
                        {item.description}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {index === items.length - 1 && <div aria-hidden="true" className="h-px w-full bg-border" />}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default FaqGlyphRows;
