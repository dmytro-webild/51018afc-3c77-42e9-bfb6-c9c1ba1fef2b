"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

interface MaskedLineRevealProps {
  lines?: string[];
  text?: string;
  tag?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  immediate?: boolean;
  ease?: [number, number, number, number];
  from?: string;
  margin?: string;
  accent?: boolean;
  rotate?: number;
  fade?: boolean;
  separateLines?: boolean;
}

const toTokens = (text: string, accent = false) => {
  let on = false;
  return text
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((raw) => {
      const firstLetter = raw.search(/[^*\p{P}]/u);
      const lastLetter = raw.length - 1 - [...raw].reverse().join("").search(/[^*\p{P}]/u);
      const stars = accent ? [...raw].flatMap((ch, i) => (ch === "*" ? [i] : [])) : [];
      const opens = stars.some((i) => firstLetter === -1 || i < firstLetter);
      const closes = stars.some((i) => firstLetter !== -1 && i > lastLetter);
      const word = accent ? raw.replace(/\*/g, "") : raw;
      if (!word) return [];
      const lit = on || opens;
      if (opens) on = true;
      if (closes) on = false;
      return word
        .split(/(?<=-)(?=.)/)
        .filter(Boolean)
        .map((part, i, parts) => ({ part, raw: lit ? `*${part}*` : part, space: i === parts.length - 1 }));
    });
};

const splitAccent = (row: string) => row.split(/(\*[^*]+\*)/).filter(Boolean);

const MaskedLineReveal = ({
  lines,
  text = "Design that ships and is built for the long run",
  tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.1,
  duration = 0.9,
  immediate = false,
  ease = [0.19, 1, 0.22, 1],
  from = "110%",
  margin,
  accent = false,
  rotate = 0,
  fade = false,
  separateLines = false,
}: MaskedLineRevealProps) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<string[] | null>(null);
  const inView = useInView(ref, margin ? { once: true, margin: margin as NonNullable<Parameters<typeof useInView>[1]>["margin"] } : { once: true, amount: 0.2 });
  const reduce = useReducedMotion();
  const ready = Boolean(lines || measured) && (immediate || inView);
  const [go, setGo] = useState(false);
  const visible = ready && go;

  useEffect(() => {
    if (!ready) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setGo(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [ready]);
  const tokens = toTokens(text, accent);

  useEffect(() => {
    if (lines || !measureRef.current) return;
    const box = measureRef.current;
    let frame = 0;
    const measure = () => {
      const groups: string[] = [];
      let lastTop = Number.NaN;
      let spaceBefore = false;
      Array.from(box.children).forEach((child) => {
        const el = child as HTMLElement;
        const part = el.dataset.raw ?? el.textContent ?? "";
        if (!groups.length || Math.abs(el.offsetTop - lastTop) > 2) {
          groups.push(part);
          lastTop = el.offsetTop;
        } else {
          groups[groups.length - 1] += spaceBefore ? ` ${part}` : part;
        }
        spaceBefore = el.dataset.space === "true";
      });
      setMeasured((prev) => (prev && prev.join("\n") === groups.join("\n") ? prev : groups));
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    let ready = false;
    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      ready = true;
      schedule();
    });
    const observer = new ResizeObserver(() => ready && schedule());
    observer.observe(box);
    document.fonts.addEventListener("loadingdone", schedule);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", schedule);
    };
  }, [lines, text, accent]);

  const rows = lines ?? measured ?? [text];
  const label = lines ? lines.join(" ") : text;
  let accentIndex = 0;
  const renderRow = (row: string, rowIndex: number) =>
    accent
      ? splitAccent(row).map((segment, j) => {
          if (!segment.startsWith("*")) return segment;
          const order = accentIndex++;
          const lit = reduce || visible;
          return (
            <b
              key={j}
              style={{
                fontWeight: "inherit",
                color: lit ? "var(--accent)" : undefined,
                transitionProperty: "color",
                transitionDuration: reduce ? "0s" : "1.2s",
                transitionTimingFunction: "var(--ease-in-out, ease)",
                transitionDelay: reduce ? "0s" : `${delay + rowIndex * stagger + 0.5 + order * 0.12}s`,
              }}
            >
              {segment.slice(1, -1)}
            </b>
          );
        })
      : row;
  const Tag = tag === "p" ? "div" : tag;
  const curve = `cubic-bezier(${ease.join(",")})`;

  return (
    <Tag
      ref={ref}
      aria-label={separateLines ? undefined : label}
      className={cn("relative", !/(^|\s)(md:|lg:)?w-/.test(className) && "w-full", className, !/(^|\s)leading-/.test(className) && "leading-[1.1]")}
    >
      {!lines && (
        <div ref={measureRef} aria-hidden="true" className="pointer-events-none invisible absolute inset-x-0 top-0 [padding-inline:inherit]">
          {tokens.flatMap((token, i) => [
            <div key={i} data-space={String(token.space)} data-raw={token.raw} className="inline-block indent-0">
              {token.part}
            </div>,
            token.space && i < tokens.length - 1 ? " " : null,
          ])}
        </div>
      )}
      {rows.map((row, i) => (
        <div key={i} aria-hidden={separateLines ? undefined : true} className={cn("block overflow-hidden pb-[0.12em] -mb-[0.12em]", i > 0 && "indent-0")}>
          <div
            className={cn("block", !lines && measured && "whitespace-nowrap")}
            style={{
              transformOrigin: rotate ? "0 50%" : undefined,
              transform: reduce || visible ? "translateY(0%) rotate(0deg)" : `translateY(${from}) rotate(${rotate}deg)`,
              opacity: fade && !(reduce || visible) ? 0 : 1,
              transition: reduce ? "none" : `transform ${duration}s ${curve} ${delay + i * stagger}s${fade ? `, opacity ${duration}s ${curve} ${delay + i * stagger}s` : ""}`,
            }}
          >
            {renderRow(row, i)}
          </div>
        </div>
      ))}
    </Tag>
  );
};

export default MaskedLineReveal;
