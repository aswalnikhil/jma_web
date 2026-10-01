"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { bySlug } from "@/lib/products";
import { SectionHeading, ease } from "./section-heading";

const steps = [
  {
    title: "Grown in the Himalayas",
    body: "Every herb comes from the Himalayan foothills, where cool air and slow growth give leaves and flowers a deeper, cleaner flavour.",
    Visual: MountainVisual,
  },
  {
    title: "Whole leaves & flowers",
    body: "Open a jar and you can see it: whole buds, petals and leaves, never dust or fannings. That's what gives each cup its full colour and aroma.",
    Visual: LeavesVisual,
  },
  {
    title: "Sealed in glass",
    body: "Glass keeps light, moisture and plastic taste out, so the last spoonful is as fresh as the first. And the jar is yours to reuse.",
    Visual: GlassVisual,
  },
];

/**
 * Scroll-told story. Desktop: steps scroll on the left while a sticky stage on
 * the right swaps to the matching illustration. Mobile: each step carries its
 * own illustration inline.
 */
export function Features() {
  const [active, setActive] = useState(0);
  const stepsRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ["start center", "end center"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const ActiveVisual = steps[active].Visual;

  return (
    <section id="why" aria-labelledby="why-title" className="defer-render relative bg-muted py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="why-title" eyebrow="Why JMA Herbals" title="From the mountain to your cup">
          Just Himalayan leaves, flowers and buds, dried and packed in glass the
          way they grew.
        </SectionHeading>

        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            {/* Progress rail */}
            <div aria-hidden="true" className="absolute top-2 bottom-2 left-[1.15rem] hidden w-0.5 rounded-full bg-border lg:block">
              <m.div style={{ scaleY: progress }} className="h-full w-full origin-top rounded-full bg-primary" />
            </div>

            <ol ref={stepsRef} className="space-y-16 lg:space-y-0">
              {steps.map((s, i) => (
                <m.li
                  key={s.title}
                  onViewportEnter={() => setActive(i)}
                  viewport={{ margin: "-45% 0px -45% 0px" }}
                  className="relative lg:flex lg:min-h-[70vh] lg:items-center lg:pl-16"
                >
                  {/* Mobile: inline illustration */}
                  <div className="mb-7 aspect-[5/4] overflow-hidden rounded-3xl lg:hidden">
                    <s.Visual />
                  </div>

                  <m.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20% 0px" }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute top-1/2 left-0 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 font-serif text-lg font-semibold transition-colors duration-500 lg:flex ${
                        active >= i ? "border-primary bg-primary text-on-primary" : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <p className="font-serif text-5xl font-semibold text-accent/80 lg:hidden" aria-hidden="true">
                      0{i + 1}
                    </p>
                    <h3 className="mt-2 text-3xl leading-tight font-semibold sm:text-4xl">{s.title}</h3>
                    <p className="mt-4 max-w-md text-lg text-muted-foreground">{s.body}</p>
                  </m.div>
                </m.li>
              ))}
            </ol>
          </div>

          {/* Desktop: sticky stage */}
          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-15rem)] aspect-[5/4] w-full overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgb(31_90_46/0.45)]">
              <AnimatePresence initial={false}>
                <m.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease }}
                >
                  <ActiveVisual />
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Illustrations ---------- */

function MountainVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#2d4a2a]">
      {/* Slow push-in while the step is on screen */}
      <m.div
        className="absolute inset-0"
        initial={{ scale: 1.14 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 6, ease: "easeOut" }}
      >
        <Image
          src="/story/himalayas.webp"
          alt="A green Himalayan valley with wildflowers, forested slopes and clouds over the peaks"
          fill
          sizes="(min-width: 1024px) 540px, 100vw"
          className="object-cover object-[50%_55%]"
        />
      </m.div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
      <Caption dark>Himalayan foothills</Caption>
    </div>
  );
}

function LeavesVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#3b2a1c]">
      {/* Slow push-in while the step is on screen */}
      <m.div
        className="absolute inset-0"
        initial={{ scale: 1.14 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 6, ease: "easeOut" }}
      >
        <Image
          src="/story/herbs.webp"
          alt="Bowls of dried herbs, petals and flower buds on a wooden table"
          fill
          sizes="(min-width: 1024px) 540px, 100vw"
          className="object-cover object-[50%_65%]"
        />
      </m.div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
      <Caption dark>Leaves · Petals · Buds</Caption>
    </div>
  );
}

function GlassVisual() {
  const jar = bySlug("nettle");
  const reduce = useReducedMotion();
  const pathId = useId();
  return (
    <div aria-hidden="true" className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#2f7a3f,#143d20_75%)]">
      {/* Rotating badge */}
      <m.svg
        viewBox="0 0 200 200"
        className="absolute h-[92%] text-white/30"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path id={pathId} d="M100 100m-86 0a86 86 0 1 1 172 0a86 86 0 1 1-172 0" />
        </defs>
        <text fill="currentColor" fontSize="11" letterSpacing="6" fontWeight="600">
          <textPath href={`#${pathId}`}>SEALED IN GLASS · FRESH TO THE LAST SPOON · SEALED IN GLASS · FRESH TO THE LAST SPOON ·</textPath>
        </text>
      </m.svg>

      <m.div
        className="relative h-[56%]"
        initial={{ y: 40, opacity: 0, rotate: -6 }}
        whileInView={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
      >
        <Image
          src={jar.image.src}
          width={jar.image.width}
          height={jar.image.height}
          alt=""
          sizes="180px"
          className="h-full w-auto drop-shadow-[0_28px_30px_rgb(0_0_0/0.4)]"
        />
        {/* Light glint, clipped to the jar's shape */}
        {!reduce && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              maskImage: `url(${jar.image.src})`,
              WebkitMaskImage: `url(${jar.image.src})`,
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            }}
          >
            <m.div
              className="absolute inset-y-0 w-1/2 bg-[linear-gradient(100deg,transparent,rgb(255_255_255/0.55),transparent)]"
              animate={{ transform: ["translateX(-120%) skewX(-12deg)", "translateX(260%) skewX(-12deg)"] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
            />
          </div>
        )}
      </m.div>
      <Caption dark>Sealed fresh in glass</Caption>
    </div>
  );
}

function Caption({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`absolute bottom-4 left-4 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm ${
        dark ? "bg-white/15 text-white" : "bg-white/80 text-primary"
      }`}
    >
      {children}
    </span>
  );
}
