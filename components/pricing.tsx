"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import { m } from "framer-motion";
import { bySlug, products } from "@/lib/products";
import { inr, pricingIsSample, tiers, type Tier } from "@/lib/pricing";
import { BuyButtons } from "./buy-buttons";
import { SectionHeading, inViewOnce, revealItem } from "./section-heading";

import { ArrowIcon } from "./ui/icons";

const TrioPicker = dynamic(() => import("./trio-picker").then((mod) => mod.TrioPicker), {
  ssr: false,
});

export function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="defer-render bg-muted py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="pricing-title"
          eyebrow="Pricing"
          title="Pick a jar, or pick them all"
        >
          Every tea is packed in glass. The more you try, the more you save.
        </SectionHeading>

        {pricingIsSample && (
          <p className="mx-auto mt-6 w-fit rounded-full border border-dashed border-muted-foreground/50 px-4 py-1 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Sample prices. Replace before launch
          </p>
        )}

        <ul
          className="mx-auto mt-12 grid max-w-xl items-stretch gap-6 md:mt-14 lg:max-w-none lg:grid-cols-3"
        >
          {tiers.map((tier, i) => (
            <TierCard key={tier.id} tier={tier} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function TierCard({ tier, index }: { tier: Tier; index: number }) {
  const popular = !!tier.popular;
  const saving = tier.compareAt ? tier.compareAt - tier.price : 0;
  const perJar = Math.round(tier.price / tier.jars);

  return (
    <m.li
      variants={revealItem}
      custom={index}
      initial="hidden"
      whileInView="show"
      whileHover="hover"
      viewport={inViewOnce}
      className={`relative flex flex-col rounded-3xl p-7 sm:p-8 ${
        popular
          ? "bg-primary text-on-primary shadow-[0_30px_60px_-25px_rgb(31_90_46/0.7)] lg:-my-4 lg:py-12"
          : "border border-border bg-surface shadow-[0_8px_30px_-18px_rgb(31_90_46/0.25)] transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-[0_20px_40px_-20px_rgb(31_90_46/0.35)]"
      }`}
    >
      {popular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold tracking-wide whitespace-nowrap text-on-accent uppercase shadow-md">
          Most popular
        </span>
      )}

      <JarStack slugs={tier.preview} />
      <h3 className="mt-4 text-2xl font-semibold">{tier.name}</h3>
      <p className={`mt-2 text-[0.95rem] lg:min-h-12 ${popular ? "text-on-primary/80" : "text-muted-foreground"}`}>
        {tier.tagline}
      </p>

      <div className="mt-7 flex items-end gap-3">
        <span className="font-serif text-5xl leading-none font-semibold tracking-tight">
          {inr.format(tier.price)}
        </span>
        {tier.compareAt && (
          <span className={`pb-1 text-lg line-through ${popular ? "text-on-primary/60" : "text-muted-foreground"}`}>
            <span className="sr-only">Regular price </span>
            {inr.format(tier.compareAt)}
          </span>
        )}
      </div>
      <p className={`mt-2 text-sm ${popular ? "text-on-primary/80" : "text-muted-foreground"}`}>
        {tier.jars === 1 ? "Per jar" : `${tier.jars} jars · ${inr.format(perJar)} per jar`}
        {saving > 0 && (
          <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${popular ? "bg-accent text-on-accent" : "bg-primary/10 text-primary"}`}>
            Save {inr.format(saving)}
          </span>
        )}
      </p>

      <ul className={`mt-7 space-y-3 border-t pt-7 ${popular ? "border-white/15" : "border-border"}`}>
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${popular ? "bg-accent text-on-accent" : "bg-primary/10 text-primary"}`}
            >
              <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none">
                <path d="m5 10.5 3 3 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className={popular ? "text-on-primary/90" : "text-foreground/85"}>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-9">
        {tier.action === "bundle" ? (
          <BuyButtons
            layout="stack"
            tone={popular ? "dark" : "light"}
            line={{
              id: tier.id,
              name: tier.name,
              detail: `All ${products.length} teas, one of each`,
              price: tier.price,
              image: bySlug("nettle").image,
            }}
          />
        ) : (
          <TierCta tier={tier} popular={popular} />
        )}
      </div>
    </m.li>
  );
}

function TierCta({ tier, popular }: { tier: Tier; popular: boolean }) {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const className = `flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 font-semibold transition-colors ${
    popular
      ? "bg-accent text-on-accent hover:bg-[#e6b43a]"
      : "border border-primary/25 text-primary hover:border-primary hover:bg-primary hover:text-on-primary"
  }`;
  const motionProps = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 400, damping: 25 },
  } as const;

  if (tier.action === "link") {
    return (
      <m.a href="#teas" className={className} {...motionProps}>
        {tier.cta}
        <ArrowIcon />
      </m.a>
    );
  }

  return (
    <>
      <m.button type="button" onClick={() => {
          setOpened(true);
          setOpen(true);
        }} aria-haspopup="dialog" className={className} {...motionProps}>
        {tier.cta}
        <ArrowIcon />
      </m.button>
      {/* Picker code loads the first time it is opened */}
      {opened && <TrioPicker tier={tier} open={open} onClose={() => setOpen(false)} />}
    </>
  );
}

/** Small fanned stack of jars; spreads out when the card is hovered. */
function JarStack({ slugs }: { slugs: string[] }) {
  const n = slugs.length;
  const mid = (n - 1) / 2;

  return (
    <div aria-hidden="true" className="relative -ml-2 h-24 w-28 shrink-0">
      {slugs.map((slug, i) => {
        const p = bySlug(slug);
        const offset = i - mid;
        return (
          <m.div
            key={slug}
            className="absolute bottom-0 left-[calc(50%-1.25rem)] w-10"
            style={{ zIndex: n - Math.abs(Math.round(offset)) }}
            variants={{
              hidden: { x: 0, rotate: 0 },
              show: { x: offset * 13, rotate: offset * 6 },
              hover: { x: offset * 20, rotate: offset * 10, y: -4 },
            }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <Image
              src={p.image.src}
              width={p.image.width}
              height={p.image.height}
              alt=""
              sizes="40px"
              className="h-auto w-full drop-shadow-[0_6px_8px_rgb(0_0_0/0.25)]"
            />
          </m.div>
        );
      })}
    </div>
  );
}
