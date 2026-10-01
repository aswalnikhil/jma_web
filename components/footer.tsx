"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { products } from "@/lib/products";
import { contact, legal, siteDetailsAreSample, socials } from "@/lib/site";
import { Logo } from "./logo";
import { inViewOnce, reveal } from "./section-heading";
import { ArrowIcon } from "./ui/icons";

const help = [
  { label: "FAQ", href: "#faq" },
  { label: "Pricing & bundles", href: "#pricing" },
  { label: "Why JMA Herbals", href: "#why" },
  { label: "Reviews", href: "#reviews" },
];

export function Footer() {
  return (
    <footer id="contact" aria-labelledby="footer-title" className="defer-render relative overflow-hidden bg-[#143d20] text-on-primary">
      <h2 id="footer-title" className="sr-only">
        Contact and site information
      </h2>

      {/* Mountain ridge, mirroring the hero */}
      <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute top-0 left-0 h-16 w-full text-background md:h-20">
        <path d="M0 0h1440v40l-150 55-110-30-130 60-140-65-100 25-120-50-150 60-90-30-110 45-130-60-90 25L0 30Z" fill="currentColor" />
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 pt-28 sm:px-6 md:pt-32">
        {/* Closing call to action */}
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          transition={{ staggerChildren: 0.08 }}
          className="flex flex-col items-start justify-between gap-8 border-b border-white/15 pb-14 md:flex-row md:items-end"
        >
          <div className="max-w-xl">
            <m.p variants={reveal} className="text-sm font-semibold tracking-[0.18em] text-accent uppercase">
              From the mountains to your mug
            </m.p>
            <m.p variants={reveal} className="mt-3 font-serif text-3xl leading-tight font-semibold sm:text-4xl">
              Brew something good today.
            </m.p>
          </div>
          <m.a
            variants={reveal}
            href="#teas"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex min-h-13 items-center gap-2 rounded-full bg-accent px-7 font-semibold text-on-accent transition-colors hover:bg-[#e6b43a]"
          >
            Shop the collection
            <ArrowIcon />
          </m.a>
        </m.div>

        {siteDetailsAreSample && (
          <p className="mt-8 w-fit rounded-full border border-dashed border-white/40 px-4 py-1 text-xs font-semibold tracking-wide text-on-primary/70 uppercase">
            Contact, social and legal details are placeholders
          </p>
        )}

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.4fr] lg:gap-10">
          <div className="col-span-2 lg:col-span-1">
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-on-primary/75">
              The real taste of Himalayan herbs. Hand-picked leaves, flowers and
              buds, sealed in glass.
            </p>
            <ul className="mt-6 flex gap-2" aria-label="Social media">
              {socials.map((s) => (
                <li key={s.name}>
                  <m.a
                    href={s.href}
                    aria-label={`JMA Herbals on ${s.name}`}
                    whileHover={{ y: -3 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-on-primary/85 transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
                  >
                    <SocialIcon name={s.name} />
                  </m.a>
                </li>
              ))}
            </ul>
          </div>

          <FooterLinks title="Shop" links={products.slice(0, 6).map((p) => ({ label: p.name.replace("Himalayan ", ""), href: "#teas" }))} />
          <FooterLinks title="Help" links={help} />

          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-sans text-sm font-semibold tracking-[0.14em] text-accent uppercase">Get in touch</h3>
            <ul className="mt-5 space-y-3 text-on-primary/80">
              <li>
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-accent">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-accent">
                  {contact.phone}
                </a>
              </li>
              <li>{contact.address}</li>
            </ul>
            <Newsletter />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 py-7 text-sm text-on-primary/65 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {legal.company}. {legal.fssai}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="transition-colors hover:text-accent">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <h3 className="font-sans text-sm font-semibold tracking-[0.14em] text-accent uppercase">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="group inline-flex items-center text-on-primary/80 transition-colors hover:text-on-primary">
              <span className="h-px w-0 bg-accent transition-[width,margin] duration-300 group-hover:mr-1.5 group-hover:w-3" aria-hidden="true" />
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Newsletter() {
  const [note, setNote] = useState<string | null>(null);

  return (
    <form
      className="mt-8"
      onSubmit={(e) => {
        e.preventDefault();
        // Not wired to a mailing list yet. Say so rather than faking success.
        setNote("Newsletter sign-up isn't connected yet.");
      }}
    >
      <label htmlFor="newsletter-email" className="text-sm font-semibold">
        New blends and brewing tips, now and then
      </label>
      <div className="mt-3 flex gap-2 rounded-full border border-white/20 bg-white/5 p-1.5 focus-within:border-accent">
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          // Browser autofill paints its own light background and dark text; the inset
          // shadow + text-fill override keep a saved email on-theme (#20472b = white/5 on the footer green).
          className="min-w-0 flex-1 rounded-full bg-transparent px-4 text-on-primary caret-on-primary placeholder:text-on-primary/45 focus:outline-none autofill:shadow-[inset_0_0_0_1000px_#20472b] autofill:[-webkit-text-fill-color:var(--color-on-primary)] autofill:[transition:background-color_9999s_ease-out]"
        />
        <m.button
          type="submit"
          whileTap={{ scale: 0.96 }}
          className="min-h-11 shrink-0 cursor-pointer rounded-full bg-accent px-5 text-sm font-semibold text-on-accent transition-colors hover:bg-[#e6b43a]"
        >
          Subscribe
        </m.button>
      </div>
      <div aria-live="polite" className="min-h-6">
        <AnimatePresence>
          {note && (
            <m.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-sm text-on-primary/75"
            >
              {note}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function SocialIcon({ name }: { name: string }) {
  const common = { viewBox: "0 0 24 24", className: "h-5 w-5", "aria-hidden": true } as const;
  if (name === "Instagram")
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  if (name === "Facebook")
    return (
      <svg {...common} fill="currentColor">
        <path d="M13.5 21v-7.5H16l.4-3H13.5V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.4V21h3.1Z" />
      </svg>
    );
  return (
    <svg {...common} fill="currentColor">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  );
}
