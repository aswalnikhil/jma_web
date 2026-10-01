"use client";

import { AnimatePresence, m } from "framer-motion";
import { useCart } from "@/lib/cart";
import { BagIcon } from "./ui/icons";

export function CartButton() {
  const { count, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-haspopup="dialog"
      aria-label={count ? `Open cart, ${count} ${count === 1 ? "item" : "items"}` : "Open cart"}
      className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
    >
      <BagIcon className="h-6 w-6" />
      <AnimatePresence>
        {count > 0 && (
          <m.span
            key={count}
            aria-hidden="true"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute top-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[0.7rem] font-bold text-on-accent tabular-nums"
          >
            {count > 99 ? "99+" : count}
          </m.span>
        )}
      </AnimatePresence>
    </button>
  );
}
