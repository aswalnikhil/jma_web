"use client";

import { m } from "framer-motion";
import { bySlug, teaBg } from "@/lib/products";
import { testimonials, type Testimonial } from "@/lib/testimonials";
import { SectionHeading, ease, reveal } from "./section-heading";

export function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="defer-render py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="reviews-title"
          eyebrow="Loved by tea drinkers"
          title="Poured, sipped and re-ordered"
        >
          What people say once they&apos;ve opened their first jar.
        </SectionHeading>
      </div>

      {/* Swipeable row on mobile, bento grid from md up */}
      <m.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.08 }}
        aria-label="Customer reviews"
        className="mx-auto mt-12 flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] sm:scroll-px-6 sm:px-6 md:mt-16 md:grid md:snap-none md:grid-cols-2 md:gap-5 lg:grid-cols-3 md:overflow-visible md:pb-0"
      >
        <ReviewCard t={featured} featured />
        {rest.map((t, i) => (
          <ReviewCard key={i} t={t} />
        ))}
      </m.ul>
    </section>
  );
}

function ReviewCard({ t, featured = false }: { t: Testimonial; featured?: boolean }) {
  const product = bySlug(t.product);

  return (
    <m.li
      variants={reveal}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`relative flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border p-7 sm:w-[60%] md:w-auto ${
        featured
          ? "border-transparent bg-primary text-on-primary md:row-span-2 md:p-9"
          : "border-border bg-surface shadow-[0_8px_30px_-18px_rgb(31_90_46/0.25)] transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-[0_20px_40px_-20px_rgb(31_90_46/0.35)]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Stars rating={t.rating} light={featured} />
        {t.sample && (
          <span className="rounded-full border border-dashed border-current px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase opacity-70">
            Sample review
          </span>
        )}
      </div>

      <blockquote
        className={`mt-5 flex-1 ${
          featured
            ? "font-serif text-xl leading-snug md:text-2xl"
            : "text-[1.05rem] text-foreground/90"
        }`}
      >
        <p>&ldquo;{t.quote}&rdquo;</p>
      </blockquote>

      <footer className="mt-7 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`flex h-11 w-11 items-center justify-center rounded-full font-serif text-lg font-semibold ${
              featured ? "bg-white/15 text-on-primary" : "bg-muted text-primary"
            }`}
          >
            {t.name.charAt(0)}
          </span>
          <div className="leading-tight">
            <p className="font-semibold">{t.name}</p>
            <p
              className={`mt-0.5 flex items-center gap-1.5 text-sm ${
                featured ? "text-on-primary/75" : "text-muted-foreground"
              }`}
            >
              <span aria-hidden="true" className={`h-2 w-2 rounded-full ${teaBg[product.color]} ${featured ? "ring-2 ring-white/40" : ""}`} />
              {t.place} · {product.name.replace("Himalayan ", "")}
            </p>
          </div>
        </div>
      </footer>

      {featured && (
        <m.span
          aria-hidden="true"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
          className="pointer-events-none absolute -right-2 -bottom-24 font-serif text-[16rem] leading-none text-accent/20 select-none"
        >
          &rdquo;
        </m.span>
      )}
    </m.li>
  );
}

function Stars({ rating, light }: { rating: number; light: boolean }) {
  return (
    <m.div
      className="flex gap-1"
      role="img"
      aria-label={`${rating} out of 5 stars`}
      variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <m.svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          variants={{
            hidden: { scale: 0.4, opacity: 0 },
            show: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 15 } },
          }}
          className={`h-5 w-5 ${i < rating ? "text-accent" : light ? "text-white/25" : "text-border"}`}
          fill="currentColor"
        >
          <path d="M10 1.8l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.4l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.8z" />
        </m.svg>
      ))}
    </m.div>
  );
}
