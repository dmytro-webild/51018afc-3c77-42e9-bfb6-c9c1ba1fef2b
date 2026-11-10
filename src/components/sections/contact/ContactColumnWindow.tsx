import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import MaskedLineReveal from "@/components/animation/MaskedLineReveal";
import { useImageReady, useKitMotion } from "@/components/kit/kitMotion";
import Media, { MotionMedia } from "@/components/kit/Media";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type Photo = { imageSrc: string; imageAlt?: string };

type ContactColumnWindowProps = {
  title?: string;
  submitText?: string;
  successText?: string;
  images?: Photo[];
  ariaLabel?: string;
  className?: string;
};

const defaults: Photo[] = [
  { imageSrc: "https://images.pexels.com/photos/4254168/pexels-photo-4254168.jpeg?auto=compress&cs=tinysrgb&w=1400", imageAlt: "Engineer checking a solar array" },
  { imageSrc: "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1400", imageAlt: "Wind turbine on a green hill" },
];

const fields = [
  { name: "name", label: "Name", type: "text", wide: false },
  { name: "company", label: "Company", type: "text", wide: false },
  { name: "email", label: "Email", type: "email", wide: true },
];

const ContactColumnWindow = ({
  title = "Start a project",
  submitText = "Send message",
  successText = "Thanks, we will be in touch soon",
  images = defaults,
  ariaLabel,
  className,
}: ContactColumnWindowProps) => {
  const reduce = useReducedMotion();
  const kit = useKitMotion();
  const windowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(windowRef, { once: true, amount: 0.15 });
  const [sent, setSent] = useState(false);
  const [slide, setSlide] = useState({ current: 0, previous: -1, round: 0 });
  const { scrollYProgress } = useScroll({ target: windowRef, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const count = images.length;

  useEffect(() => {
    if (!inView || reduce || count < 2) return;
    const id = window.setInterval(() => setSlide((s) => ({ current: (s.current + 1) % count, previous: s.current, round: s.round + 1 })), 4000);
    return () => window.clearInterval(id);
  }, [inView, reduce, count]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const current = images[slide.current] ?? images[0];
  const previous = slide.previous >= 0 ? images[slide.previous] : undefined;
  const imgReady = useImageReady(windowRef, inView);
  const play = (inView && imgReady) || Boolean(reduce);

  return (
    <section aria-label={ariaLabel ?? title} className={cn("relative bg-background py-[var(--section-space)] text-foreground", className)}>
      <div className="mx-auto grid w-[var(--container)] grid-cols-1 gap-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col">
          <MaskedLineReveal tag="h2" text={title} className="text-balance text-[length:var(--text-h2)] leading-[1.1]" />
          <motion.form
            onSubmit={onSubmit}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: kit.base, ease: kit.ease, delay: 0.15 }}
            className="mt-[clamp(1.5rem,3vw,3rem)] grid grid-cols-1 gap-x-[var(--gap)] gap-y-8 sm:grid-cols-2"
          >
            {fields.map((field) => (
              <label key={field.name} className={cn("flex min-w-0 flex-col gap-2", field.wide && "sm:col-span-2")}>
                <p className="font-mono text-[length:var(--text-label)] uppercase tracking-[var(--label-tracking)] text-muted-foreground">{field.label}</p>
                <input
                  name={field.name}
                  type={field.type}
                  required={field.name !== "company"}
                  className="w-full min-w-0 border-b border-input bg-transparent py-2.5 text-[length:var(--text-body)] text-foreground outline-none transition-colors focus:border-foreground"
                />
              </label>
            ))}
            <label className="flex min-w-0 flex-col gap-2 sm:col-span-2">
              <p className="font-mono text-[length:var(--text-label)] uppercase tracking-[var(--label-tracking)] text-muted-foreground">Message</p>
              <textarea name="message" rows={3} required className="w-full resize-none border-b border-input bg-transparent py-2.5 text-[length:var(--text-body)] text-foreground outline-none transition-colors focus:border-foreground" />
            </label>
            <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
              <button type="submit" className="btn-pair group inline-flex items-center gap-[2px] rounded-full">
                <div className="btn-secondary">
                  <p className="btn-label">{submitText}</p>
                </div>
                <div className="btn-secondary size-[2.5rem] shrink-0 px-0">
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-[0.875rem] group-hover:rotate-45 group-focus-visible:rotate-45" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
                  </svg>
                </div>
              </button>
              {sent && <p role="status" className="text-[length:var(--text-small)] text-muted-foreground">{successText}</p>}
            </div>
          </motion.form>
        </div>
        <div ref={windowRef} className="relative h-[26rem] overflow-hidden rounded-[var(--radius-image)] lg:h-auto lg:min-h-[32rem]">
          <motion.div style={{ y: reduce ? 0 : drift }} className="absolute inset-x-0 -top-[6%] h-[112%]">
            {previous && <Media src={previous.imageSrc} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />}
            <div key={slide.round} role="img" aria-label={current.imageAlt ?? ""} className="absolute inset-0">
              {[0, 1, 2, 3].map((strip) => (
                <motion.div
                  key={strip}
                  initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
                  animate={play ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
                  transition={{ duration: kit.slow, ease: kit.easeInOut, delay: strip * 0.07 }}
                  style={{ left: `${strip * 25}%` }}
                  className="absolute inset-y-0 w-[25.2%] overflow-hidden"
                >
                  <MotionMedia
                    src={current.imageSrc}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    initial={reduce ? false : { scale: 1.08 }}
                    animate={play ? { scale: 1 } : undefined}
                    transition={{ duration: kit.slow, ease: kit.ease }}
                    style={{ left: `${-strip * 100}%` }}
                    className="absolute top-0 h-full w-[400%] max-w-none object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
          {[1, 2, 3].map((line) => (
            <motion.div
              key={line}
              aria-hidden="true"
              initial={reduce ? false : { scaleY: 0 }}
              animate={play ? { scaleY: 1 } : undefined}
              transition={{ duration: kit.slow, ease: kit.easeInOut, delay: 0.3 + line * 0.07 }}
              style={{ left: `${line * 25}%` }}
              className="absolute inset-y-0 w-px origin-top bg-white/25"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactColumnWindow;
