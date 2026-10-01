"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  m,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { bySlug } from "@/lib/products";
import { HeroMountains } from "./hero-mountains";

const ease = [0.22, 1, 0.36, 1] as const;

// Above-the-fold content is never hidden (no opacity: 0 in the server HTML),
// so it paints before JavaScript loads. Once hydrated, pieces glide into place.
const rise: Variants = {
  hidden: { y: 16 },
  show: (i: number = 0) => ({
    y: 0,
    transition: { duration: 0.5, ease, delay: 0.1 + i * 0.08 },
  }),
};

// Fan of jars: x = centre point (% of width), w = width (% of width),
// lift = distance from the floor (% of height).
const jars = [
  { product: bySlug("lavender-buds"), x: 13, w: 19, lift: 12, rotate: -9, z: 10, delay: 0.5, float: 6 },
  { product: bySlug("hibiscus"), x: 31, w: 23, lift: 6, rotate: -4, z: 20, delay: 0.35, float: 8 },
  { product: bySlug("nettle"), x: 50, w: 28, lift: 0, rotate: 0, z: 30, delay: 0.2, float: 10, lcp: true },
  { product: bySlug("blue-pea"), x: 69, w: 23, lift: 6, rotate: 4, z: 20, delay: 0.4, float: 7 },
  { product: bySlug("lemon-green"), x: 87, w: 19, lift: 12, rotate: 9, z: 10, delay: 0.55, float: 6 },
];

const perks = ["11 herbal blends", "Packed in glass jars", "Caffeine-free options"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  // 0 when the hero's top is at the viewport top, 1 when the hero has scrolled out.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const reduce = useReducedMotion();
  const jarsY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate -mt-16 overflow-hidden pt-16 md:-mt-18 md:pt-18"
    >
      <Backdrop progress={scrollYProgress} />

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-10 pb-20 sm:px-6 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pt-20 lg:pb-28">
        <m.div initial="hidden" animate="show" className="text-center lg:text-left">
          <m.p
            variants={rise}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            Hand-picked in the Himalayas
          </m.p>

          <h1
            id="hero-title"
            className="mt-6 text-[2.6rem] leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.75rem]"
          >
            The real taste of{" "}
            <span className="relative inline-block whitespace-nowrap text-primary">
              Himalayan
              <svg
                viewBox="0 0 300 20"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute -bottom-2 left-0 h-3 w-full text-accent"
              >
                <m.path
                  d="M4 14 C 80 4, 200 2, 296 10"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease, delay: 0.4 }}
                />
              </svg>
            </span>{" "}
            herbs
          </h1>

          <m.p
            variants={rise}
            custom={1}
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground lg:mx-0"
          >
            Small-batch herbal teas, from nettle and tulsi to hibiscus and blue
            pea. Naturally dried and sealed in glass, so every cup tastes like
            the mountains.
          </m.p>

          <m.div
            variants={rise}
            custom={2}
            className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start"
          >
            <m.a
              href="#teas"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-on-primary shadow-[0_12px_28px_-12px_rgb(31_90_46/0.9)] transition-colors hover:bg-primary-hover"
            >
              Shop the collection
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </m.a>
            <m.a
              href="#why"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="inline-flex min-h-13 items-center justify-center rounded-full border border-primary/25 bg-surface/60 px-7 text-base font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-surface"
            >
              Why JMA Herbals
            </m.a>
          </m.div>

          <m.ul
            variants={rise}
            custom={3}
            className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground lg:justify-start"
          >
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" className="h-4 w-4 text-primary" fill="none" aria-hidden="true">
                  <path d="m5 10.5 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {perk}
              </li>
            ))}
          </m.ul>
        </m.div>

        {/* Jars are the nearest layer: they drift up faster than the page */}
        <m.div style={{ y: jarsY }}>
          <JarGroup />
        </m.div>
      </div>
    </section>
  );
}

function JarGroup() {
  return (
    <div className="mx-auto w-full max-w-[540px]">
      <div className="relative aspect-[6/5] w-full">
        {/* Soft halo behind the jars */}
        <m.div
          aria-hidden="true"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.9, ease }}
          className="absolute inset-x-[4%] top-[4%] bottom-0 rounded-full bg-[radial-gradient(closest-side,#eee3c8,#f5eedd_55%,transparent)]"
        />

        {jars.map(({ product, x, w, lift, rotate, z, delay, float, lcp }) => (
          <m.div
            key={product.slug}
            className="absolute -translate-x-1/2"
            style={{ left: `${x}%`, width: `${w}%`, bottom: `${6 + lift}%`, zIndex: z }}
            initial={lcp ? false : { y: 40 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease, delay }}
          >
            {/* Contact shadow */}
            <span
              aria-hidden="true"
              className="absolute -bottom-[4%] left-1/2 h-[7%] w-[90%] -translate-x-1/2 rounded-[50%] bg-primary/25 blur-md"
            />
            <m.div
              animate={{ transform: ["translateY(0px)", `translateY(${-float}px)`, "translateY(0px)"] }}
              transition={{ duration: 5 + float / 4, repeat: Infinity, ease: "easeInOut", delay: delay + 0.7 }}
            >
              <m.div
                style={{ rotate }}
                whileHover={{ y: -10, rotate: 0, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src={product.image.src}
                  width={product.image.width}
                  height={product.image.height}
                  alt={`JMA Herbals ${product.name} ${product.kind}, ${product.weight} glass jar`}
                  sizes="(min-width: 1024px) 160px, 30vw"
                  loading={lcp ? "eager" : "lazy"}
                  fetchPriority={lcp ? "high" : "auto"}
                  draggable={false}
                  className="relative h-auto w-full drop-shadow-[0_18px_22px_rgb(26_42_30/0.18)] select-none"
                />
              </m.div>
            </m.div>
          </m.div>
        ))}
      </div>

      <m.div
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.9 }}
        className="mx-auto -mt-2 flex w-fit items-center gap-3 rounded-2xl border border-border bg-surface/90 px-4 py-2.5 shadow-[0_12px_30px_-16px_rgb(31_90_46/0.45)]"
      >
        <span className="flex -space-x-1.5" aria-hidden="true">
          {["bg-tea-nettle", "bg-tea-hibiscus", "bg-tea-bluepea", "bg-tea-lemon"].map((c) => (
            <span key={c} className={`h-5 w-5 rounded-full border-2 border-surface ${c}`} />
          ))}
        </span>
        <span className="text-sm font-semibold whitespace-nowrap text-foreground">
          Hand-picked · Small batch
        </span>
      </m.div>
    </div>
  );
}


function Backdrop({ progress }: { progress: MotionValue<number> }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-56 -right-56 h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(31_90_46/0.08),transparent)]" />
      <div className="absolute top-1/4 -left-64 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgb(217_162_27/0.12),transparent)]" />
      <HeroMountains progress={progress} />
      {/* Foreground ridge: static, so it lines up with the next section */}
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 z-10 h-24 w-full text-muted md:h-32"
      >
        <path
          d="M0 160V110l120-40 90 30 130-70 110 55 90-35 150 75 120-60 100 30 140-80 130 70 110-35 150 60v60Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
