"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { CartButton } from "./cart-button";
import { Logo } from "./logo";

const links = [
  { href: "#teas", label: "Shop" },
  { href: "#why", label: "Why JMA" },
  { href: "#reviews", label: "Reviews" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        solid
          ? "border-b border-border bg-background/85 shadow-[0_6px_24px_-18px_rgb(31_90_46/0.5)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:h-18"
      >
        <a href="#top" aria-label="JMA Herbals home" className="rounded-md">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative rounded-full px-4 py-2 text-[0.95rem] font-medium text-foreground/80 transition-colors duration-200 hover:text-primary"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-4 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-accent transition-transform duration-250 ease-out-soft group-hover:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <m.a
            href="#teas"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="hidden min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-on-primary shadow-[0_8px_20px_-10px_rgb(31_90_46/0.8)] transition-colors hover:bg-primary-hover sm:inline-flex md:hidden lg:inline-flex"
          >
            Shop Teas
            <ArrowIcon />
          </m.a>

          <CartButton />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted md:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-border bg-background md:hidden"
          >
            <m.ul
              className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6"
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {links.map((link) => (
                <m.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center rounded-xl px-3 text-lg font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    {link.label}
                  </a>
                </m.li>
              ))}
              <m.li
                className="pt-2 pb-1"
                variants={{
                  hidden: { opacity: 0, x: -8 },
                  show: { opacity: 1, x: 0 },
                }}
              >
                <a
                  href="#teas"
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-on-primary transition-colors hover:bg-primary-hover"
                >
                  Shop Teas
                  <ArrowIcon />
                </a>
              </m.li>
            </m.ul>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M4 10h11m-4-4 4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <m.path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ d: open ? "M6 6l12 12" : "M4 8h16" }}
        transition={{ duration: 0.2 }}
      />
      <m.path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ d: open ? "M6 18L18 6" : "M4 16h16" }}
        transition={{ duration: 0.2 }}
      />
    </svg>
  );
}
