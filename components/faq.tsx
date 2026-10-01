"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { faqs, type Faq as FaqItem } from "@/lib/faq";
import { ease, inViewOnce, reveal, revealItem } from "./section-heading";
import { ArrowIcon } from "./ui/icons";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="defer-render py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          transition={{ staggerChildren: 0.06 }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <m.p variants={reveal} className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
            FAQ
          </m.p>
          <m.h2
            id="faq-title"
            variants={reveal}
            className="mt-3 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]"
          >
            Questions, steeped and answered
          </m.h2>
          <m.p variants={reveal} className="mt-4 text-lg text-pretty text-muted-foreground">
            Everything about brewing, storing and ordering. Can&apos;t find what
            you&apos;re looking for? We&apos;re happy to help.
          </m.p>
          <m.a
            variants={reveal}
            href="#contact"
            whileHover={{ y: -2 }}
            className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full border border-primary/25 bg-surface px-6 font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-on-primary"
          >
            Contact us
            <ArrowIcon />
          </m.a>
        </m.div>

        <ul className="divide-y divide-border rounded-3xl border border-border bg-surface px-5 shadow-[0_8px_30px_-18px_rgb(31_90_46/0.25)] sm:px-8">
          {faqs.map((f, i) => (
            <FaqRow
              key={f.q}
              faq={f}
              index={i}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </ul>
      </div>

      <FaqJsonLd />
    </section>
  );
}

function FaqRow({
  faq,
  index,
  open,
  onToggle,
}: {
  faq: FaqItem;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();

  return (
    <m.li variants={revealItem} custom={Math.min(index, 4) * 0.5} initial="hidden" whileInView="show" viewport={inViewOnce}>
      <h3 className="font-sans text-wrap">
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-semibold text-foreground transition-colors hover:text-primary sm:py-6 sm:text-lg"
        >
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {faq.q}
            {faq.confirm && (
              <span className="rounded-full border border-dashed border-muted-foreground/60 px-2 py-0.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                To confirm
              </span>
            )}
          </span>
          <m.span
            aria-hidden="true"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
              open ? "bg-primary text-on-primary" : "bg-muted text-primary group-hover:bg-primary/10"
            }`}
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </m.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.3, ease }, opacity: { duration: 0.2 } }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pr-12 pb-6 text-muted-foreground">
              {faq.a.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.li>
  );
}

/** FAQPage structured data. Only confirmed answers are published. */
function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((f) => !f.confirm)
      .map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a.join(" ") },
      })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
