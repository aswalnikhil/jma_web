"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { MAX_QTY, useCart, type CartLine } from "@/lib/cart";
import { inr } from "@/lib/pricing";
import { CheckoutPanel, type PaidOrder } from "./checkout-panel";
import { CloseButton, Sheet } from "./ui/sheet";
import { ArrowIcon, BagIcon, CheckIcon, MinusIcon, PlusIcon, TrashIcon } from "./ui/icons";

type Step = "cart" | "checkout" | "done";

export function CartDrawer() {
  const { lines, count, subtotal, isOpen, closeCart } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [paid, setPaid] = useState<PaidOrder | null>(null);

  // Every time the drawer closes, the next open starts back at the cart.
  const close = () => {
    closeCart();
    setStep("cart");
  };

  const titles: Record<Step, string> = { cart: "Your cart", checkout: "Delivery details", done: "Order confirmed" };

  const browse = () => {
    close();
    requestAnimationFrame(() => document.getElementById("teas")?.scrollIntoView());
  };

  return (
    <>
      <Sheet open={isOpen} onClose={close} labelledBy="cart-title">
        <header className="flex items-center justify-between gap-2 border-b border-border px-5 py-3 sm:px-6">
          {step === "checkout" && (
            <button
              type="button"
              onClick={() => setStep("cart")}
              aria-label="Back to cart"
              className="-ml-2 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-muted"
            >
              <ArrowIcon className="h-5 w-5 rotate-180" />
            </button>
          )}
          <h2 id="cart-title" className="flex-1 text-2xl font-semibold">
            {titles[step]}
            {step === "cart" && count > 0 && (
              <span className="ml-2 font-sans text-base font-medium text-muted-foreground">
                ({count} {count === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <CloseButton onClick={close} label="Close cart" />
        </header>

        {step === "done" && paid ? (
          <OrderConfirmed order={paid} onContinue={close} />
        ) : step === "checkout" && lines.length > 0 ? (
          <CheckoutPanel
            onPaid={(order) => {
              setPaid(order);
              setStep("done");
            }}
          />
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-primary">
              <BagIcon className="h-7 w-7" />
            </span>
            <p className="mt-5 font-serif text-xl font-semibold">Your cart is empty</p>
            <p className="mt-2 text-muted-foreground">Find a tea you&apos;ll love brewing.</p>
            <button
              type="button"
              onClick={browse}
              className="mt-7 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              Browse teas
              <ArrowIcon />
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5 sm:px-6">
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <CartRow key={line.id} line={line} />
                ))}
              </AnimatePresence>
            </ul>

            <footer className="border-t border-border bg-surface px-5 pt-5 pb-6 sm:px-6">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-serif text-2xl font-semibold">{inr.format(subtotal)}</span>
              </div>
              <m.button
                type="button"
                onClick={() => setStep("checkout")}
                whileTap={{ scale: 0.98 }}
                className="mt-5 flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary font-semibold text-on-primary transition-colors hover:bg-primary-hover"
              >
                Checkout
                <ArrowIcon />
              </m.button>
              <p className="mt-2 text-center text-xs text-muted-foreground">Enter delivery details, then pay securely with Razorpay.</p>
              <button
                type="button"
                onClick={close}
                className="mt-2 w-full cursor-pointer rounded-full py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-muted"
              >
                Continue shopping
              </button>
            </footer>
          </>
        )}
      </Sheet>

      <CartToast />
    </>
  );
}

function OrderConfirmed({ order, onContinue }: { order: PaidOrder; onContinue: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <m.span
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-on-primary"
      >
        <CheckIcon className="h-10 w-10" />
      </m.span>
      <p className="mt-6 font-serif text-2xl font-semibold">Thank you, {order.name.split(" ")[0]}!</p>
      <p className="mt-2 text-muted-foreground">
        We&apos;ve received your payment of {inr.format(order.amount / 100)}. Your teas will be packed and shipped to the address you gave.
      </p>
      <dl className="mt-6 w-full rounded-2xl bg-muted p-4 text-left text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Payment ID</dt>
          <dd className="font-mono font-semibold break-all">{order.paymentId}</dd>
        </div>
        <div className="mt-2 flex justify-between gap-3">
          <dt className="text-muted-foreground">Order ID</dt>
          <dd className="font-mono font-semibold break-all">{order.orderId}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">Keep your payment ID for any questions about your order.</p>
      <button
        type="button"
        onClick={onContinue}
        className="mt-7 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 font-semibold text-on-primary transition-colors hover:bg-primary-hover"
      >
        Continue shopping
        <ArrowIcon />
      </button>
    </div>
  );
}

function CartRow({ line }: { line: CartLine }) {
  const { setQty, remove } = useCart();

  return (
    <m.li
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-4 py-5"
    >
      <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-2xl bg-muted">
        <Image
          src={line.image.src}
          width={line.image.width}
          height={line.image.height}
          alt=""
          sizes="40px"
          className="h-20 w-auto"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold leading-snug">{line.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{line.detail}</p>
          </div>
          <p className="shrink-0 font-semibold">{inr.format(line.price * line.qty)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center rounded-full border border-border bg-surface" role="group" aria-label={`Quantity for ${line.name}`}>
            <button
              type="button"
              onClick={() => setQty(line.id, line.qty - 1)}
              aria-label={line.qty === 1 ? `Remove ${line.name}` : `Decrease quantity of ${line.name}`}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-muted"
            >
              <MinusIcon />
            </button>
            <span className="w-7 text-center font-semibold tabular-nums" aria-live="polite">
              {line.qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(line.id, line.qty + 1)}
              disabled={line.qty >= MAX_QTY}
              aria-label={`Increase quantity of ${line.name}`}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <PlusIcon />
            </button>
          </div>
          <button
            type="button"
            onClick={() => remove(line.id)}
            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-tea-rose"
          >
            <TrashIcon />
            Remove
          </button>
        </div>
      </div>
    </m.li>
  );
}

function CartToast() {
  const { toast, dismissToast, openCart } = useCart();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(dismissToast, 3500);
    return () => clearTimeout(t);
  }, [toast, dismissToast]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[55] flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {toast && (
          <m.div
            key={toast.key}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-4 rounded-2xl border border-border bg-surface p-3 pr-4 shadow-[0_20px_50px_-20px_rgb(26_42_30/0.45)]"
          >
            <div className="flex h-16 w-14 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Image src={toast.line.image.src} width={toast.line.image.width} height={toast.line.image.height} alt="" sizes="28px" className="h-13 w-auto" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                <CheckIcon />
                Added to cart
              </p>
              <p className="truncate font-semibold">{toast.line.name}</p>
            </div>
            <button
              type="button"
              onClick={openCart}
              className="min-h-10 shrink-0 cursor-pointer rounded-full bg-primary px-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              View cart
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
