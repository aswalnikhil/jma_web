"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { productPricesAreSample, products, type Product } from "@/lib/products";
import { inr } from "@/lib/pricing";
import { showcase } from "@/lib/showcase";
import { BuyButtons } from "./buy-buttons";
import { ease } from "./section-heading";

export const productLine = (p: Product) => ({
  id: p.slug,
  name: p.name,
  detail: `${p.kind} · ${p.weight}`,
  price: p.price,
  image: p.image,
});

const shortName = (p: Product) => p.name.replace("Himalayan ", "");

/**
 * Product showcase: one tea at a time on a full-bleed band in its label colour,
 * with a thumbnail rail to switch. Tabs pattern for keyboard/screen readers.
 */
export function Shop() {
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);

  const p = products[index];
  const look = showcase[p.slug];

  const go = (next: number, focusTab = false) => {
    const n = (next + products.length) % products.length;
    if (n === index) return;
    setState([n, n > index ? 1 : -1]);
    const tab = railRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[n];
    // Centre the active thumbnail by scrolling only the rail. (scrollIntoView would also
    // scroll the clipped section and page sideways, exposing a white strip.)
    const rail = railRef.current;
    if (rail && tab) {
      rail.scrollTo({
        left: tab.offsetLeft - rail.offsetLeft - (rail.clientWidth - tab.offsetWidth) / 2,
        behavior: reduce ? "auto" : "smooth",
      });
    }
    if (focusTab) tab?.focus({ preventScroll: true });
  };

  const onRailKey = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: products.length - 1 };
    if (e.key in keys) {
      e.preventDefault();
      go(keys[e.key], true);
    }
  };

  return (
    <section
      id="teas"
      aria-labelledby="teas-title"
      className="defer-render relative isolate touch-pan-y touch-pinch-zoom overflow-clip text-white"
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") swipeStart.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (swipeStart.current === null) return;
        const dx = e.clientX - swipeStart.current;
        swipeStart.current = null;
        if (Math.abs(dx) > 60 && !(e.target as HTMLElement).closest('[role="tablist"]')) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <h2 id="teas-title" className="sr-only">
        Shop our teas
      </h2>

      {/* Background: crossfades to each tea's label colour */}
      <AnimatePresence initial={false}>
        <m.div
          key={p.slug}
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ backgroundColor: look.from }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,var(--glow),transparent_62%)] lg:bg-[radial-gradient(circle_at_72%_42%,var(--glow),transparent_58%)]"
            style={{ ["--glow" as string]: look.to }}
          />
        </m.div>
      </AnimatePresence>

      <Decorations seed={index} reduce={!!reduce} />

      <div className="mx-auto grid max-w-6xl gap-6 px-4 pt-14 pb-8 sm:px-6 lg:min-h-[640px] lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-10 lg:pt-20">
        {/* Jar stage */}
        <div className="relative h-80 sm:h-96 lg:order-last lg:h-[520px]">
          <AnimatePresence initial={false}>
            <m.span
              key={`word-${p.slug}`}
              aria-hidden="true"
              initial={{ opacity: 0, x: 80 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 * direction }}
              transition={{ duration: 0.6, ease }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-[5.5rem] leading-none font-bold tracking-tight whitespace-nowrap text-white/[0.09] select-none sm:text-[8rem] lg:text-[9.5rem]"
            >
              {shortName(p).split(" ")[0]}
            </m.span>
          </AnimatePresence>

          {/* Ground glow */}
          <span aria-hidden="true" className="absolute bottom-[6%] left-1/2 h-8 w-48 -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl lg:w-64" />

          <AnimatePresence initial={false} custom={direction}>
            <m.div
              key={p.slug}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: 160 * d, rotate: 28 * d, scale: 0.85 }),
                center: { opacity: 1, x: 0, rotate: 12, scale: 1 },
                exit: (d: number) => ({ opacity: 0, x: -160 * d, rotate: -18 * d, scale: 0.85 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 120, damping: 18, opacity: { duration: 0.3 } }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <m.div
                animate={reduce ? undefined : { transform: ["translateY(0px)", "translateY(-12px)", "translateY(0px)"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="h-[88%]"
              >
                <Image
                  src={p.image.src}
                  width={p.image.width}
                  height={p.image.height}
                  alt={`${p.name} ${p.kind}, ${p.weight} glass jar`}
                  sizes="(min-width: 1024px) 200px, 150px"
                  className="h-full w-auto drop-shadow-[0_30px_35px_rgb(0_0_0/0.35)]"
                  draggable={false}
                />
              </m.div>
            </m.div>
          </AnimatePresence>
        </div>

        {/* Copy + buy */}
        <div id="tea-panel" role="tabpanel" aria-labelledby={`tab-${p.slug}`} className="relative">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={p.slug}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
                exit: { opacity: 0, transition: { duration: 0.15 } },
              }}
              className="text-center lg:text-left"
            >
              <m.p variants={item} className="text-sm font-semibold tracking-[0.18em] text-white/80 uppercase">
                Our collection · {index + 1} of {products.length}
              </m.p>
              <m.h3 variants={item} className="mt-3 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {p.name}
              </m.h3>
              <m.p variants={item} className="mt-2 text-lg font-medium text-white/85">
                {p.kind} · {p.weight}
              </m.p>
              <m.ul variants={item} className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start" aria-label="Tasting notes">
                {look.notes.map((n) => (
                  <li key={n} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-medium">
                    {n}
                  </li>
                ))}
              </m.ul>
              <m.p variants={item} className="mx-auto mt-5 max-w-lg text-[1.05rem] text-white/85 lg:mx-0">
                {look.blurb}
              </m.p>
              <m.div variants={item} className="mt-7 flex items-center justify-center gap-3 lg:justify-start">
                <span className="font-serif text-4xl font-semibold">{inr.format(p.price)}</span>
                {productPricesAreSample && (
                  <span className="rounded-full border border-dashed border-white/50 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white/80 uppercase">
                    Sample price
                  </span>
                )}
              </m.div>
              <m.div variants={item} className="mx-auto mt-6 max-w-md lg:mx-0">
                <BuyButtons line={productLine(p)} tone="dark" />
              </m.div>
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Thumbnail rail */}
      <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 pb-10 sm:px-6 lg:pb-14">
        <ArrowButton label="Previous tea" onClick={() => go(index - 1)} flip />
        <div
          ref={railRef}
          role="tablist"
          aria-label="Choose a tea"
          onKeyDown={onRailKey}
          className="flex flex-1 snap-x gap-1 overflow-x-auto scroll-px-4 py-3 [scrollbar-width:none] sm:gap-2 lg:justify-between"
        >
          {products.map((t, i) => {
            const active = i === index;
            return (
              <button
                key={t.slug}
                id={`tab-${t.slug}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="tea-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => go(i)}
                className="group relative flex w-16 shrink-0 cursor-pointer snap-center flex-col items-center rounded-xl pt-1 pb-3 sm:w-[4.5rem]"
              >
                <span className="sr-only">{t.name}</span>
                <m.span
                  animate={{ y: active ? -8 : 0, scale: active ? 1.12 : 1, opacity: active ? 1 : 0.7 }}
                  whileHover={{ y: active ? -8 : -4, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="block h-16 sm:h-20"
                >
                  <Image
                    src={t.image.src}
                    width={t.image.width}
                    height={t.image.height}
                    alt=""
                    sizes="36px"
                    className="h-full w-auto drop-shadow-[0_8px_8px_rgb(0_0_0/0.3)]"
                  />
                </m.span>
                <m.span
                  aria-hidden="true"
                  initial={false}
                  animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
                  transition={{ duration: 0.3, ease }}
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-white"
                />
              </button>
            );
          })}
        </div>
        <ArrowButton label="Next tea" onClick={() => go(index + 1)} />
      </div>
    </section>
  );
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

function ArrowButton({ label, onClick, flip = false }: { label: string; onClick: () => void; flip?: boolean }) {
  return (
    <m.button
      type="button"
      aria-label={label}
      aria-controls="tea-panel"
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/35 text-white transition-colors hover:bg-white/15 sm:flex"
    >
      <svg viewBox="0 0 20 20" className={`h-5 w-5 ${flip ? "rotate-180" : ""}`} fill="none" aria-hidden="true">
        <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </m.button>
  );
}

/* Floating leaves and petals, like the fruit in a juice ad. Positions shuffle
   gently per tea so each switch feels fresh. */
const LEAF = "M12 2C6 6 4 12 6 20c8-1 13-6 14-14-3-1-6-2-8-4Z";
const PETAL = "M12 3c4 3 6 7 4 12-1 3-3 5-4 6-1-1-3-3-4-6-2-5 0-9 4-12Z";
const BUD = "M12 4c3 2 4 6 3 10-1 3-2 5-3 6-1-1-2-3-3-6-1-4 0-8 3-10Z";

const decor = [
  { d: LEAF, x: "6%", y: "12%", size: 56, r: -20 },
  { d: PETAL, x: "38%", y: "6%", size: 40, r: 30 },
  { d: BUD, x: "88%", y: "10%", size: 46, r: 15 },
  { d: LEAF, x: "93%", y: "58%", size: 70, r: 140 },
  { d: PETAL, x: "52%", y: "78%", size: 34, r: -40 },
  { d: LEAF, x: "4%", y: "70%", size: 44, r: 60 },
  { d: BUD, x: "62%", y: "20%", size: 30, r: -10 },
];

function Decorations({ seed, reduce }: { seed: number; reduce: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[5]">
      {decor.map((o, i) => (
        <m.svg
          key={i}
          viewBox="0 0 24 24"
          width={o.size}
          height={o.size}
          className="absolute text-white"
          style={{ left: o.x, top: o.y }}
          initial={false}
          animate={{
            rotate: o.r + ((seed * 37 + i * 53) % 60) - 30,
            opacity: [0.1, 0.18][(seed + i) % 2],
            scale: 0.85 + (((seed + i) * 7) % 5) / 10,
          }}
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
        >
          <m.g
            animate={reduce ? undefined : { transform: ["translateY(0px)", `translateY(${i % 2 ? -6 : 6}px)`, "translateY(0px)"] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d={o.d} fill="currentColor" />
          </m.g>
        </m.svg>
      ))}
    </div>
  );
}
