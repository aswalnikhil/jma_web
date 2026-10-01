"use client";

import { m } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;

export const reveal = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <m.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: 0.06 }}
      className="mx-auto max-w-2xl text-center"
    >
      <m.p
        variants={reveal}
        className="text-sm font-semibold tracking-[0.18em] text-primary uppercase"
      >
        {eyebrow}
      </m.p>
      <m.h2
        id={id}
        variants={reveal}
        className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]"
      >
        {title}
      </m.h2>
      {children && (
        <m.p variants={reveal} className="mt-4 text-lg text-pretty text-muted-foreground">
          {children}
        </m.p>
      )}
    </m.div>
  );
}

/**
 * For items that set their own variant label (e.g. whileHover="hover"):
 * they stop inheriting from the parent, so they run their own in-view reveal
 * and stagger by index via `custom`.
 */
export const revealItem = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease, delay: i * 0.1 },
  }),
};

export const inViewOnce = { once: true, margin: "-80px" } as const;
