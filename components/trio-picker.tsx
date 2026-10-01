"use client";

import Image from "next/image";
import { useState } from "react";
import { m } from "framer-motion";
import { bySlug, products, teaBg } from "@/lib/products";
import { inr, type Tier } from "@/lib/pricing";
import { BuyButtons } from "./buy-buttons";
import { CheckIcon } from "./ui/icons";
import { CloseButton, Sheet } from "./ui/sheet";

const PICK = 3;

export function TrioPicker({
  tier,
  open,
  onClose,
}: {
  tier: Tier;
  open: boolean;
  onClose: () => void;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const full = picked.length === PICK;
  const regular = picked.reduce((n, s) => n + bySlug(s).price, 0);

  const toggle = (slug: string) =>
    setPicked((cur) =>
      cur.includes(slug) ? cur.filter((s) => s !== slug) : cur.length < PICK ? [...cur, slug] : cur,
    );

  const sorted = [...picked].sort();
  const line = {
    id: `trio:${sorted.join("+")}`,
    name: tier.name,
    detail: sorted.map((s) => bySlug(s).name.replace("Himalayan ", "")).join(", "),
    price: tier.price,
    image: bySlug(picked[0] ?? "blue-pea").image,
  };

  const done = () => {
    onClose();
    setPicked([]);
  };

  return (
    <Sheet open={open} onClose={onClose} labelledBy="trio-title" side="center">
      <header className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
        <div>
          <h2 id="trio-title" className="text-2xl font-semibold sm:text-3xl">
            Build your {tier.name}
          </h2>
          <p className="mt-1 text-muted-foreground">
            Pick any {PICK} teas.{" "}
            <span className="font-semibold text-primary" aria-live="polite">
              {picked.length} of {PICK} chosen
            </span>
          </p>
        </div>
        <CloseButton onClick={onClose} label="Close trio builder" />
      </header>

      <ul className="grid flex-1 grid-cols-3 gap-2.5 overflow-y-auto px-5 py-5 sm:grid-cols-4 sm:gap-3 sm:px-7">
        {products.map((p) => {
          const on = picked.includes(p.slug);
          const locked = full && !on;
          return (
            <li key={p.slug}>
              <m.button
                type="button"
                aria-pressed={on}
                disabled={locked}
                onClick={() => toggle(p.slug)}
                whileTap={locked ? undefined : { scale: 0.96 }}
                className={`relative flex h-full w-full cursor-pointer flex-col items-center rounded-2xl border-2 px-2 pt-3 pb-2.5 text-center transition-[border-color,background-color,opacity] duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                  on ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-primary/40"
                }`}
              >
                {on && (
                  <m.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-on-primary"
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                  </m.span>
                )}
                <Image src={p.image.src} width={p.image.width} height={p.image.height} alt="" sizes="40px" className="h-20 w-auto sm:h-24" />
                <span className="mt-2 flex items-center gap-1 text-[0.8rem] leading-tight font-semibold sm:text-sm">
                  <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${teaBg[p.color]}`} />
                  {p.name.replace("Himalayan ", "")}
                </span>
              </m.button>
            </li>
          );
        })}
      </ul>

      <footer className="flex flex-col gap-4 border-t border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:rounded-b-3xl sm:px-7">
        <div className="flex items-baseline gap-2.5">
          <span className="font-serif text-3xl font-semibold">{inr.format(tier.price)}</span>
          {full && regular > tier.price && (
            <span className="text-muted-foreground line-through">
              <span className="sr-only">Regular price </span>
              {inr.format(regular)}
            </span>
          )}
        </div>
        <div className="sm:w-80">
          <BuyButtons line={line} disabled={!full} onDone={done} />
        </div>
      </footer>
    </Sheet>
  );
}
