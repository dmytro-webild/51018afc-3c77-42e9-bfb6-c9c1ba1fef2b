"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type LoaderHairlineColumnsProps = {
  brand?: string;
  onComplete?: () => void;
  liftAt?: number;
  doneAt?: number;
};

const EASE_OUT = [0.19, 1, 0.22, 1] as const;
const EASE_WIPE = [0.65, 0, 0.35, 1] as const;
const LIFT = 0.8;
const LIFT_STAGGER = 0.08;
const LINE_STAGGER = 0.06;

const isDesktop = () => typeof window !== "undefined" && window.matchMedia("(min-width: 880px)").matches;

const edge = (index: number, count: number, desktop: boolean) =>
  desktop ? `calc(50% - var(--container) / 2 + var(--container) * ${index / count})` : `${(index / count) * 100}%`;

const LoaderHairlineColumns = ({ brand = "©Solvar", onComplete, liftAt = 1.25, doneAt = 2.3 }: LoaderHairlineColumnsProps) => {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"in" | "out" | "lift">("in");
  const [desktop] = useState(isDesktop);
  const count = 4;
  const done = useRef(onComplete);

  useEffect(() => {
    done.current = onComplete;
  });

  useEffect(() => {
    if (reduce) {
      setVisible(false);
      done.current?.();
      return;
    }
    const timers = [
      window.setTimeout(() => setPhase("out"), (liftAt - 0.2) * 1000),
      window.setTimeout(() => setPhase("lift"), liftAt * 1000),
      window.setTimeout(() => {
        setVisible(false);
        done.current?.();
      }, doneAt * 1000),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [reduce, liftAt, doneAt]);

  if (!visible || reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100000] overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{ transform: phase === "lift" ? "translateY(-101%)" : "translateY(0%)" }}
          transition={{ duration: LIFT, ease: EASE_WIPE, delay: i * LIFT_STAGGER }}
          style={{ left: i === 0 ? "0px" : edge(i, count, desktop), right: i === count - 1 ? "0px" : edge(count - 1 - i, count, desktop) }}
          className="absolute inset-y-0 bg-deep"
        />
      ))}

      <div className="absolute inset-y-0 left-1/2 w-full -translate-x-1/2 lg:w-[var(--container)]">
        {Array.from({ length: count + 1 }, (_, i) => (desktop || (i > 0 && i < count)) && (
          <motion.div
            key={i}
            initial={false}
            animate={{ transform: phase === "lift" ? "translateY(-101%)" : "translateY(0%)" }}
            transition={{ duration: LIFT, ease: EASE_WIPE, delay: Math.min(i, count - 1) * LIFT_STAGGER }}
            style={i === count ? { right: "0px" } : { left: `${(i / count) * 100}%` }}
            className="absolute inset-y-0 w-px"
          >
            <motion.div
              initial={{ transform: "scaleY(0)" }}
              animate={{ transform: "scaleY(1)" }}
              transition={{ duration: 0.9, ease: EASE_WIPE, delay: 0.1 + i * LINE_STAGGER }}
              className="size-full origin-top bg-white/25"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
          <motion.p
            initial={{ transform: "translateY(110%)" }}
            animate={{ transform: phase === "in" ? "translateY(0%)" : "translateY(-110%)" }}
            transition={phase === "in" ? { duration: 0.8, ease: EASE_OUT, delay: 0.4 } : { duration: 0.45, ease: EASE_WIPE }}
            className="whitespace-nowrap font-[family-name:var(--font-heading)] text-[length:var(--text-h3)] leading-[1.1] tracking-[var(--heading-tracking)] text-accent"
          >
            {brand}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default LoaderHairlineColumns;
