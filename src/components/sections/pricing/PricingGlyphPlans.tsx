import { motion, useReducedMotion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useKitMotion } from "@/components/kit/kitMotion";
import MaskedLineReveal from "@/components/animation/MaskedLineReveal";
import HydraArrowPill from "@/components/kit/HydraArrowPill";
import HydraGlyph, { type HydraGlyphVariant } from "@/components/kit/HydraGlyph";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type Plan = { title: string; price: string; description?: string; features?: string[]; button?: { text: string; href: string } };

type PricingGlyphPlansProps = {
  label?: string;
  title?: string;
  description?: string;
  items?: Plan[];
  ariaLabel?: string;
  className?: string;
};

const defaultItems: Plan[] = [
  { title: "Survey", price: "€4,800", description: "A full site study before you commit to anything.", features: ["Roof and land assessment", "Grid connection check", "Yield and payback model"], button: { text: "Book a survey", href: "#contact" } },
  { title: "Build", price: "From €0.62/W", description: "We design, permit and install the plant for you.", features: ["Solar, wind or storage design", "Permits and grid filing", "Installation and testing", "Ten year workmanship warranty"], button: { text: "Plan a build", href: "#contact" } },
  { title: "Operate", price: "€0.07/kWh", description: "We own and run the plant, you pay for energy used.", features: ["No upfront cost", "Monitoring around the clock", "Maintenance and repairs", "Yearly impact report"], button: { text: "Talk to us", href: "#contact" } },
];

const glyphs: HydraGlyphVariant[] = ["dots", "bars", "ring", "rings"];

const columns = (count: number) => {
  if (count <= 1) return "grid-cols-1 lg:max-w-[28rem]";
  if (count === 2) return "grid-cols-1 lg:grid-cols-2";
  return "grid-cols-1 lg:grid-cols-3";
};

const PricingGlyphPlans = ({
  label = "Plans",
  title = "Ways to work with us",
  description = "Start with a survey, or let us build and run the whole plant. Every plan is quoted per site.",
  items = defaultItems,
  ariaLabel,
  className,
}: PricingGlyphPlansProps) => {
  const reduce = useReducedMotion();
  const kit = useKitMotion();

  return (
    <section aria-label={ariaLabel ?? title ?? "Pricing"} className={cn("relative bg-background py-[var(--section-space)] text-foreground", className)}>
      <div className="mx-auto w-[var(--container)]">
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

        <ul className={cn("mt-[clamp(1.5rem,3vw,3rem)] grid gap-[0.5rem]", columns(items.length))}>
          {items.map((item, index) => (
            <motion.li
              key={index}
              initial={reduce ? false : { opacity: 0, y: "2rem" }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: kit.base, ease: kit.ease, delay: (index % 3) * 0.08 }}
              className="kit-card flex flex-col gap-[clamp(1.25rem,2vw,1.75rem)] p-[clamp(0.75rem,1.2vw,1rem)]"
            >
              <div className="grid aspect-[16/9] place-items-center rounded-[var(--radius-card)] bg-deep text-deep-foreground">
                <HydraGlyph variant={glyphs[index % glyphs.length]} className="size-[clamp(4.5rem,7vw,6.5rem)]" />
              </div>
              <div className="flex flex-1 flex-col gap-[clamp(1rem,1.6vw,1.25rem)] px-[clamp(0.5rem,1vw,1rem)] pb-[clamp(0.5rem,1vw,1rem)]">
                <div className="flex flex-col gap-[0.625rem]">
                  <h3 className="text-balance text-[length:var(--text-body-lg)] leading-[1.2] tracking-[-0.03em] [overflow-wrap:anywhere]">{item.title}</h3>
                  <p className="whitespace-nowrap font-[family-name:var(--font-label)] text-[length:var(--text-h3)] leading-[1.1] tracking-[-0.03em]">{item.price}</p>
                  {item.description && <p className="text-balance text-[length:var(--text-body)] leading-[1.45] text-muted-foreground">{item.description}</p>}
                </div>
                {item.features && item.features.length > 0 && (
                  <ul className="flex flex-col gap-[0.625rem] border-t border-[color-mix(in_srgb,var(--foreground)_12%,transparent)] pt-[clamp(1rem,1.6vw,1.25rem)]">
                    {item.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-[0.625rem]">
                        <div aria-hidden="true" className="mt-[0.2em] grid size-[1rem] shrink-0 place-items-center bg-deep">
                          <div className="size-[0.375rem] rounded-full bg-accent" />
                        </div>
                        <p className="text-[length:var(--text-small)] leading-[1.4]">{feature}</p>
                      </li>
                    ))}
                  </ul>
                )}
                {item.button && (
                  <div className="mt-auto pt-[0.5rem]">
                    <HydraArrowPill text={item.button.text} href={item.button.href} tone="deep" />
                  </div>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PricingGlyphPlans;
