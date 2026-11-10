"use client";

import { useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import useMenuDialog from "@/components/kit/useMenuDialog";
import HydraArrowPill from "@/components/kit/HydraArrowPill";

type NavItem = { name: string; href: string };
type Button = { text: string; href: string };

type NavbarBoxLinksProps = {
  brand?: string;
  logoSrc?: string;
  navItems?: NavItem[];
  primaryButton?: Button;
  menuText?: string;
  closeText?: string;
  introDelay?: number;
};

const EASE_OUT = [0.19, 1, 0.22, 1] as const;

const DEFAULT_ITEMS: NavItem[] = [
  { name: "Projects", href: "#projects" },
  { name: "Solutions", href: "#solutions" },
  { name: "Company", href: "#about" },
  { name: "News", href: "#news" },
];

const NavbarBoxLinks = ({
  brand = "©Solvar",
  logoSrc,
  navItems = DEFAULT_ITEMS,
  primaryButton = { text: "Contact us", href: "#contact" },
  menuText = "Menu",
  closeText = "Close",
  introDelay = 0,
}: NavbarBoxLinksProps) => {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useMenuDialog(open, panelRef, () => setOpen(false));

  const { scrollY } = useScroll();
  const shift = useMotionValue(0);
  const hidden = useRef(false);
  useMotionValueEvent(scrollY, "change", (value) => {
    const previous = scrollY.getPrevious() ?? 0;
    const hide = value > 120 && value > previous;
    if (hide === hidden.current) return;
    hidden.current = hide;
    animate(shift, hide ? -140 : 0, { duration: reduce ? 0 : 0.6, ease: EASE_OUT });
  });

  const logo = logoSrc ? (
    <img src={logoSrc} alt={brand} loading="eager" decoding="async" className="h-[1.5rem] w-auto max-w-[8rem] object-contain" />
  ) : (
    <p className="whitespace-nowrap font-[family-name:var(--font-heading)] text-[length:var(--text-body-lg)] leading-none tracking-[-0.05em]">{brand}</p>
  );

  return (
    <>
      <motion.nav
        aria-label="Main"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: introDelay }}
        style={{ y: shift }}
        className="fixed inset-x-0 top-[var(--gutter)] z-50"
      >
        <div className="mx-auto flex w-[var(--container)] items-start justify-between gap-[1rem]">
          <div className="flex min-w-0 flex-1 items-center justify-between gap-[2rem] rounded-[0.5rem] bg-card p-[1rem] text-card-foreground lg:flex-none lg:justify-start lg:py-[1.25rem]">
            <a href="#" className="flex min-w-0 shrink-0 items-center">
              {logo}
            </a>
            {navItems.length > 0 && (
              <ul className="hidden items-center gap-[1.75rem] lg:flex">
                {navItems.map((item, i) => (
                  <li key={`${i}-${item.href}`}>
                    <a href={item.href} className="btn-link whitespace-nowrap pb-[0.2rem] font-normal">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="whitespace-nowrap font-[family-name:var(--font-label)] text-[length:var(--text-label)] uppercase leading-none lg:hidden"
            >
              {menuText}
            </button>
          </div>
          {primaryButton && (
            <div className="hidden lg:block">
              <HydraArrowPill text={primaryButton.text} href={primaryButton.href} tone="deep" />
            </div>
          )}
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={menuText}
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[70] flex flex-col bg-background text-foreground lg:hidden"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-[var(--container)] -translate-x-1/2">
              {["0%", "25%", "50%", "75%"].map((left) => (
                <div key={left} style={{ left }} className="absolute inset-y-0 w-px bg-border" />
              ))}
              <div className="absolute inset-y-0 right-0 w-px bg-border" />
            </div>

            <div className="relative mx-auto mt-[var(--gutter)] flex w-[var(--container)] items-center justify-between gap-[1rem] rounded-[0.5rem] bg-card p-[1rem] text-card-foreground">
              <a href="#" onClick={() => setOpen(false)} className="flex min-w-0 shrink-0 items-center">
                {logo}
              </a>
              <button type="button" onClick={() => setOpen(false)} className="whitespace-nowrap font-[family-name:var(--font-label)] text-[length:var(--text-label)] uppercase leading-none">
                {closeText}
              </button>
            </div>

            <ul className="relative mx-auto mt-[3rem] flex w-[var(--container)] flex-col gap-[0.5rem]">
              {navItems.map((item, i) => (
                <li key={`${i}-${item.href}`} className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
                  <motion.a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={reduce ? false : { y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.3 + i * 0.05 }}
                    className="block font-[family-name:var(--font-heading)] text-[length:var(--text-h2)] leading-[1.1] tracking-[var(--heading-tracking)] [overflow-wrap:anywhere]"
                  >
                    {item.name}
                  </motion.a>
                </li>
              ))}
            </ul>

            {primaryButton && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: "1rem" }}
                animate={{ opacity: 1, y: "0rem" }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
                className="relative mx-auto mt-auto w-[var(--container)] pb-[2rem]"
              >
                <HydraArrowPill text={primaryButton.text} href={primaryButton.href} tone="deep" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarBoxLinks;
