"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useCart, type CartLine } from "@/lib/cart";
import { ArrowIcon, BagIcon, CheckIcon } from "./ui/icons";

type Line = Omit<CartLine, "qty">;

/**
 * "Add to cart" + "Buy now" pair. Add shows a brief confirmation state;
 * Buy now adds the item and opens the cart straight away.
 * `tone="dark"` styles the pair for use on the green (primary) background.
 */
export function BuyButtons({
  line,
  tone = "light",
  layout = "row",
  disabled = false,
  onDone,
}: {
  line: Line;
  tone?: "light" | "dark";
  layout?: "row" | "stack";
  disabled?: boolean;
  onDone?: () => void;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  const dark = tone === "dark";
  const base =
    "relative flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full px-4 text-[0.95rem] font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-45";

  return (
    <div className={`flex gap-2.5 ${layout === "stack" ? "flex-col" : "flex-col sm:flex-row"}`}>
      <m.button
        type="button"
        disabled={disabled}
        onClick={() => {
          add(line);
          setAdded(true);
          onDone?.();
        }}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        className={`${base} ${
          dark
            ? "border border-white/35 text-on-primary hover:bg-white/10"
            : "border border-primary/30 bg-surface text-primary hover:border-primary hover:bg-primary/5"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <m.span
              key="added"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="flex items-center gap-2"
            >
              <CheckIcon />
              Added
            </m.span>
          ) : (
            <m.span
              key="add"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="flex items-center gap-2"
            >
              <BagIcon className="h-[1.1rem] w-[1.1rem]" />
              Add to cart
            </m.span>
          )}
        </AnimatePresence>
      </m.button>

      <m.button
        type="button"
        disabled={disabled}
        onClick={() => {
          add(line, { buyNow: true });
          onDone?.();
        }}
        whileHover={disabled ? undefined : { y: -2 }}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`${base} ${
          dark
            ? "bg-accent text-on-accent hover:bg-[#e6b43a]"
            : "bg-primary text-on-primary shadow-[0_10px_22px_-12px_rgb(31_90_46/0.9)] hover:bg-primary-hover"
        }`}
      >
        Buy now
        <ArrowIcon />
      </m.button>
    </div>
  );
}
