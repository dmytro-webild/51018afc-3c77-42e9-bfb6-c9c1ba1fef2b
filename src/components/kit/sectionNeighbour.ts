"use client";

import { useEffect, useState, type RefObject } from "react";

type Side = "prev" | "next";

export const sideOf = (el: Element, side: Side) => {
  for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
    const found = side === "prev" ? node.previousElementSibling : node.nextElementSibling;
    if (found) return found as HTMLElement;
  }
  return null;
};

const edgeHas = (el: Element | null, side: Side, attr: string) => {
  for (let node = el; node; node = side === "prev" ? node.lastElementChild : node.firstElementChild) {
    if (node.hasAttribute(attr)) return true;
  }
  return false;
};

const watchPage = (check: () => void) => {
  check();
  const observer = new MutationObserver(check);
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
};

export const useNeighbourHas = (ref: RefObject<Element | null>, side: Side, attr: string) => {
  const [has, setHas] = useState(false);
  useEffect(
    () =>
      watchPage(() => {
        const el = ref.current;
        setHas(el ? edgeHas(sideOf(el, side), side, attr) : false);
      }),
    [ref, side, attr],
  );
  return has;
};

export const useCoverNext = (ref: RefObject<Element | null>) => {
  useEffect(() => {
    let covered: HTMLElement | null = null;
    let set: string[] = [];
    const release = () => {
      set.forEach((prop) => covered?.style.removeProperty(prop));
      covered = null;
      set = [];
    };
    const stop = watchPage(() => {
      const el = ref.current;
      const next = el ? sideOf(el, "next") : null;
      if (next === covered) return;
      release();
      if (!next) return;
      const style = getComputedStyle(next);
      if (style.position === "static") set.push("position");
      if (style.zIndex === "auto") set.push("z-index");
      if (style.backgroundColor === "rgba(0, 0, 0, 0)" || style.backgroundColor === "transparent") set.push("background-color");
      const values: Record<string, string> = { position: "relative", "z-index": "2", "background-color": "var(--background)" };
      set.forEach((prop) => next.style.setProperty(prop, values[prop]));
      covered = next;
    });
    return () => {
      stop();
      release();
    };
  }, [ref]);
};
