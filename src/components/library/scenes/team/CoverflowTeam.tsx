"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MotionMedia } from "@/components/kit/Media";
import { usePreloadImages } from "@/components/kit/kitMotion";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export type CoverflowTeamItem = {
  imageSrc: string;
  imageAlt?: string;
  videoSrc?: string;
  className?: string;
  caption?: ReactNode;
};

export type CoverflowTeamProps = {
  items?: CoverflowTeamItem[];
  angle?: number;
  className?: string;
  cardClassName?: string;
  imageFrameClassName?: string;
  stageClassName?: string;
  flowProgress?: MotionValue<number>;
  flowStep?: number;
  flowOnReducedMotion?: boolean;
  flowLoop?: boolean;
};

const photo = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

const defaultItems: CoverflowTeamItem[] = [34939749, 6215303, 7870270, 34757861, 8123906, 4427506, 37264834].map((id) => ({ imageSrc: photo(id) }));

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 4);

const Card = ({ item, offset, maxDistance, angle, count, progress, flow, flowStep, loop, cardClassName, imageFrameClassName }: { item: CoverflowTeamItem; offset: number; maxDistance: number; angle: number; count: number; progress: MotionValue<number>; flow?: MotionValue<number>; flowStep: number; loop: boolean; cardClassName?: string; imageFrameClassName?: string }) => {
  const reduceVideo = useReducedMotion() ?? false;
  const distance = Math.abs(offset);
  const side = Math.sign(offset);
  const delay = maxDistance ? (distance / maxDistance) * 0.35 : 0;
  const open = useTransform(progress, (p) => ease(clamp((p / 0.5 - delay) / (1 - delay))));
  const driver = flow ?? open;
  const rel = (v: number) => {
    if (!loop) return offset - (clamp(v) - 0.5) * (count - 1);
    const d = ((((offset + maxDistance - v) % count) + count) % count);
    return d >= count / 2 ? d - count : d;
  };
  const edge = (v: number) => (loop ? clamp((count / 2 - Math.abs(rel(v))) * 2) : 1);
  const x = useTransform(driver, (v) => (flow ? `${rel(v) * flowStep}%` : `${(offset * 42 + side * 22) * v}%`));
  const y = useTransform(driver, (v) => (flow ? "0%" : `${(1 - v) * 30}%`));
  const z = useTransform(driver, (v) => (flow ? -Math.abs(rel(v)) * 150 : -distance * 150 * v - (1 - v) * 260));
  const rotateY = useTransform(driver, (v) => (flow ? -Math.max(-1, Math.min(1, rel(v))) * angle : -side * angle * v));
  const opacity = useTransform(driver, (v) => (flow ? clamp(2.6 - Math.abs(rel(v))) * edge(v) :clamp(v * 1.6)));
  const imageScale = useTransform(driver, (v) => (flow ? 1 : 1.3 - v * 0.3));
  const zIndex = useTransform(driver, (v) => Math.round((count - (flow ? Math.abs(rel(v)) : distance)) * 2));
  const shade = useTransform(driver, (v) => Math.min((flow ? Math.abs(rel(v)) : distance) * 0.12, 0.45));

  return (
    <motion.div
      style={{ x, y, z, rotateY, opacity, zIndex }}
      className={cn("absolute inset-0 flex flex-col overflow-hidden rounded-[calc(var(--radius,0.625rem)*1.5)] bg-muted will-change-transform", cardClassName, item.className)}
    >
      <div className={cn("relative min-h-0 w-full flex-1 overflow-hidden rounded-[inherit]", imageFrameClassName)}>
        {item.videoSrc ? (
          <video src={item.videoSrc} poster={item.imageSrc} autoPlay={!reduceVideo} muted loop playsInline aria-label={item.imageAlt} className="size-full object-cover" />
        ) : (
          <MotionMedia src={item.imageSrc} alt={item.imageAlt ?? ""} draggable={false} loading="lazy" decoding="async" className="size-full object-cover" style={{ scale: imageScale }} />
        )}
      </div>
      {item.caption}
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: shade }} />
    </motion.div>
  );
};

const CoverflowTeam = ({ items = defaultItems, angle = 42, className, cardClassName, imageFrameClassName, stageClassName, flowProgress, flowStep = 62, flowOnReducedMotion = false, flowLoop = false }: CoverflowTeamProps) => {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  usePreloadImages(ref, "150%");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3, restDelta: 0.0001 });
  const progress = useTransform(smooth, (p) => (reduce ? 1 : p));
  const drift = useTransform(smooth, (p) => (reduce || flowProgress ? 0 : (p - 0.5) * -14));
  const center = (items.length - 1) / 2;
  const flow = reduce && !flowOnReducedMotion ? undefined : flowProgress;

  return (
    <div ref={ref} className={cn("relative flex h-[clamp(320px,40vw,520px)] w-full items-center justify-center overflow-hidden [perspective:1400px]", className)}>
      <motion.div className={cn("relative aspect-[3/4] h-[86%]", stageClassName)} style={{ transformStyle: "preserve-3d", rotateY: drift }}>
        {items.map((item, i) => (
          <Card key={i} item={item} offset={i - center} maxDistance={center} angle={angle} count={items.length} progress={progress} flow={flow} flowStep={flowStep} loop={flowLoop && items.length > 2} cardClassName={cardClassName} imageFrameClassName={imageFrameClassName} />
        ))}
      </motion.div>
    </div>
  );
};

export default CoverflowTeam;
