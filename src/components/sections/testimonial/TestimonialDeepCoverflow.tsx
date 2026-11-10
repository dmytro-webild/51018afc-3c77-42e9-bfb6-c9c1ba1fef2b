import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useKitMotion } from "@/components/kit/kitMotion";
import CoverflowTeam from "@/components/library/scenes/team/CoverflowTeam";
import MaskedLineReveal from "@/components/animation/MaskedLineReveal";
import HydraGlyph from "@/components/kit/HydraGlyph";
import Media from "@/components/kit/Media";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type Testimonial = { name: string; role?: string; quote: string; imageSrc: string; imageAlt?: string };

type TestimonialDeepCoverflowProps = {
  label?: string;
  title?: string;
  description?: string;
  items?: Testimonial[];
  angle?: number;
  ariaLabel?: string;
  className?: string;
};

const photo = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&w=800`;

const defaultItems: Testimonial[] = [
  { name: "Mara Lind", role: "Facilities director", quote: "Our plant now runs on its own roof for most of the year, and the bills finally make sense.", imageSrc: photo(8727530) },
  { name: "Jonas Holm", role: "Head of operations", quote: "They built the battery park around our peak hours. We have not lost a shift to the grid since.", imageSrc: photo(19456417) },
  { name: "Lucia Ferreira", role: "Sustainability lead", quote: "Clear numbers from day one, and reports our board actually reads.", imageSrc: photo(17981389) },
  { name: "Daniel Okafor", role: "Site manager", quote: "From survey to first power in four months, with one contact the whole way.", imageSrc: photo(12311564) },
];

const Arrow = ({ dir, onClick, label }: { dir: -1 | 1; onClick: () => void; label: string }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="flex size-[3rem] shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground ring-1 ring-transparent transition-[background-color,color,box-shadow] duration-300 hover:bg-deep hover:text-accent hover:ring-accent focus-visible:bg-deep focus-visible:text-accent focus-visible:ring-accent focus-visible:outline-none"
  >
    <svg viewBox="0 0 16 16" aria-hidden="true" className={cn("size-[1rem]", dir < 0 && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  </button>
);

const TestimonialDeepCoverflow = ({
  label,
  title = "What our partners say",
  description = "Plant managers and energy leads on running their sites with us.",
  items = defaultItems,
  angle = 34,
  ariaLabel,
  className,
}: TestimonialDeepCoverflowProps) => {
  const reduce = useReducedMotion() ?? false;
  const kit = useKitMotion();
  const list = items;
  const count = list.length;
  const [active, setActive] = useState(0);
  const index = useMotionValue(0);
  const spring = useSpring(index, { stiffness: 120, damping: 22, mass: 0.8 });
  const loop = count > 2;
  const flow = useTransform(spring, (v) => (loop ? v : count > 1 ? v / (count - 1) : 0.5));
  const turn = useTransform(spring, (v) => v * 90);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);

  useEffect(() => {
    index.set(active);
  }, [active, index]);

  if (!count) return null;

  const shown = ((active % count) + count) % count;
  const current = list[shown];
  const go = (dir: number) => setActive((a) => (loop ? a + dir : Math.min(count - 1, Math.max(0, a + dir))));

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, moved: false };
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    drag.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 40) {
      go(dx < 0 ? 1 : -1);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    if (rel < 0.38) go(-1);
    else if (rel > 0.62) go(1);
  };

  const cards = list.map((item) => ({ imageSrc: item.imageSrc, imageAlt: item.imageAlt ?? item.name }));

  return (
    <section
      data-tone="deep"
      aria-label={ariaLabel ?? title ?? "Testimonials"}
      className={cn("relative overflow-x-clip bg-background py-[var(--section-space)] text-foreground", className)}
    >
      <div className="mx-auto flex w-[var(--container)] flex-col items-center gap-[clamp(0.75rem,1.4vw,1.25rem)] text-center">
        <div className="flex w-full min-w-0 flex-col items-center gap-[clamp(0.75rem,1.4vw,1.25rem)]">
          {label && (
            <motion.div
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: kit.fast, ease: kit.easeInOut }}
              className="origin-center bg-accent px-[0.5rem] py-[0.25rem] text-accent-foreground"
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
              className="mx-auto max-w-[14em] text-balance text-[length:var(--text-h2)] leading-[var(--heading-leading)] tracking-[var(--heading-tracking)] [font-family:var(--font-heading)] [font-weight:var(--heading-weight)] [overflow-wrap:anywhere]"
            />
          )}
        </div>
        {description && (
          <motion.p
            initial={reduce ? false : { opacity: 0, y: "1rem" }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: kit.base, ease: kit.ease, delay: 0.1 }}
            className="mx-auto max-w-[34rem] text-balance text-[length:var(--text-body)] leading-[1.5] text-muted-foreground"
          >
            {description}
          </motion.p>
        )}
      </div>

      <div
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
        className="mx-auto mt-[clamp(1.5rem,3vw,3rem)] w-[var(--container)] cursor-grab touch-pan-y select-none active:cursor-grabbing"
      >
        {reduce ? (
          <div className="mx-auto aspect-[3/4] h-[clamp(14rem,40vw,26rem)] overflow-hidden rounded-[var(--radius-card)] bg-card">
            <Media src={current.imageSrc} alt={current.imageAlt ?? current.name} draggable={false} loading="lazy" decoding="async" className="size-full object-cover" />
          </div>
        ) : (
          <CoverflowTeam
            angle={angle}
            items={cards}
            flowProgress={flow}
            flowStep={64}
            flowLoop={loop}
            className="h-[clamp(14rem,40vw,26rem)]"
            stageClassName="aspect-[3/4] h-full"
            cardClassName="rounded-[var(--radius-card)] bg-card"
            imageFrameClassName="rounded-none"
          />
        )}
      </div>

      <div className="mx-auto mt-[clamp(1.5rem,3vw,2.5rem)] flex w-[var(--container)] flex-col gap-[clamp(1.25rem,2.4vw,2rem)] lg:flex-row lg:items-start lg:justify-center">
        <div className="flex min-w-0 items-start gap-[clamp(1rem,2.4vw,2rem)] lg:max-w-[44rem] lg:flex-1">
          <motion.div style={reduce ? undefined : { rotate: turn }} className="shrink-0">
            <HydraGlyph variant="ring" className="size-[2.75rem] lg:size-[3.5rem]" />
          </motion.div>
          <div aria-live="polite" className="grid min-w-0 flex-1">
            {list.map((item, i) => (
              <div key={i} aria-hidden="true" className="invisible col-start-1 row-start-1 flex flex-col gap-[1rem]">
                <p className="text-balance text-[length:var(--text-body-lg)] leading-[1.35] tracking-[-0.02em] [font-family:var(--font-heading)] [overflow-wrap:anywhere]">{`“${item.quote}”`}</p>
                <div className="flex flex-col gap-[0.375rem]">
                  <p className="text-[length:var(--text-body)] font-medium leading-[1.3]">{item.name}</p>
                  {item.role && <p className="text-[length:var(--text-small)] leading-[1.4]">{item.role}</p>}
                </div>
              </div>
            ))}
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure key={active} initial="hidden" animate="shown" exit="gone" className="col-start-1 row-start-1 flex flex-col gap-[1rem]">
                <div className="-mb-[0.15em] overflow-hidden pb-[0.15em]">
                  <motion.blockquote
                    variants={{
                      hidden: { y: reduce ? 0 : "110%" },
                      shown: { y: 0, transition: { duration: reduce ? 0 : kit.base, ease: kit.ease } },
                      gone: { y: reduce ? 0 : "-110%", transition: { duration: reduce ? 0 : kit.fast, ease: kit.easeInOut } },
                    }}
                    className="text-balance text-[length:var(--text-body-lg)] leading-[1.35] tracking-[-0.02em] [font-family:var(--font-heading)] [overflow-wrap:anywhere]"
                  >
                    <p>{`“${current.quote}”`}</p>
                  </motion.blockquote>
                </div>
                <div className="-mb-[0.15em] overflow-hidden pb-[0.15em]">
                  <motion.figcaption
                    variants={{
                      hidden: { y: reduce ? 0 : "110%" },
                      shown: { y: 0, transition: { duration: reduce ? 0 : kit.base, ease: kit.ease, delay: reduce ? 0 : 0.08 } },
                      gone: { y: reduce ? 0 : "-110%", transition: { duration: reduce ? 0 : kit.fast, ease: kit.easeInOut } },
                    }}
                    className="flex flex-col gap-[0.375rem]"
                  >
                    <p className="text-[length:var(--text-body)] font-medium leading-[1.3]">{current.name}</p>
                    {current.role && <p className="text-[length:var(--text-small)] leading-[1.4] text-muted-foreground">{current.role}</p>}
                  </motion.figcaption>
                </div>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>
        {count > 1 && (
          <div className="flex shrink-0 items-center gap-[0.5rem] pl-[calc(2.75rem+clamp(1rem,2.4vw,2rem))] lg:pl-0">
            <Arrow dir={-1} label="Previous testimonial" onClick={() => go(-1)} />
            <Arrow dir={1} label="Next testimonial" onClick={() => go(1)} />
            <p aria-hidden="true" className="ml-[0.75rem] whitespace-nowrap text-[length:var(--text-small)] tabular-nums text-muted-foreground">{`${shown + 1} / ${count}`}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialDeepCoverflow;
