"use client";

import { useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useCart } from "@/lib/cart";
import {
  INDIAN_STATES,
  customerErrors,
  emptyCustomer,
  normalizeCustomer,
  type ApiError,
  type Customer,
  type OrderResponse,
} from "@/lib/checkout";
import { inr } from "@/lib/pricing";
import { loadRazorpay, openRazorpay, type RazorpaySuccess } from "@/lib/razorpay-client";

export type PaidOrder = { orderId: string; paymentId: string; amount: number; name: string };

type Status = "idle" | "creating" | "paying" | "verifying";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({ error: "Unexpected response from the server." }))) as T | ApiError;
  if (!res.ok || (data as ApiError).error) throw new Error((data as ApiError).error ?? "Request failed.");
  return data as T;
}

export function CheckoutPanel({ onPaid }: { onPaid: (order: PaidOrder) => void }) {
  const { lines, subtotal, clear } = useCart();
  const [form, setForm] = useState<Customer>(emptyCustomer);
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const busy = status !== "idle";

  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setMessage(null);

    const customer = normalizeCustomer(form);
    const found = customerErrors(customer);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      (formRef.current?.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    try {
      setStatus("creating");
      const [order] = await Promise.all([
        postJson<OrderResponse>("/api/checkout/order", {
          items: lines.map((l) => ({ id: l.id, qty: l.qty })),
          customer,
        }),
        loadRazorpay(),
      ]);

      setStatus("paying");
      openRazorpay(
        {
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: "JMA Herbals",
          description: `${lines.reduce((n, l) => n + l.qty, 0)} item order`,
          prefill: { name: customer.name, email: customer.email, contact: `+91${customer.phone}` },
          theme: { color: "#1f5a2e" },
          handler: (res: RazorpaySuccess) => void confirm(res, order.amount, customer.name),
          modal: {
            confirm_close: true,
            ondismiss: () => {
              setStatus((s) => (s === "paying" ? "idle" : s));
              setMessage((msg) => msg ?? "Payment cancelled. Your cart is saved, so you can try again.");
            },
          },
        },
        (failure) => setMessage(failure.error.description || "The payment failed. Please try another method."),
      );
    } catch (err) {
      setStatus("idle");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const confirm = async (res: RazorpaySuccess, amount: number, name: string) => {
    setStatus("verifying");
    try {
      await postJson("/api/checkout/verify", {
        orderId: res.razorpay_order_id,
        paymentId: res.razorpay_payment_id,
        signature: res.razorpay_signature,
      });
      clear();
      onPaid({ orderId: res.razorpay_order_id, paymentId: res.razorpay_payment_id, amount, name });
    } catch (err) {
      setStatus("idle");
      setMessage(
        `${err instanceof Error ? err.message : "We couldn't confirm your payment."} Payment ID: ${res.razorpay_payment_id}`,
      );
    }
  };

  const field = (k: keyof Customer) => ({
    id: `co-${k}`,
    name: k,
    value: form[k],
    onChange: set(k),
    disabled: busy,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `co-${k}-err` : undefined,
    className: `mt-1.5 w-full rounded-xl border bg-surface px-4 py-3 text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none disabled:opacity-60 ${
      errors[k] ? "border-tea-rose" : "border-border"
    }`,
  });

  return (
    <form ref={formRef} onSubmit={pay} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
        <Field label="Full name" k="name" error={errors.name}>
          <input {...field("name")} autoComplete="name" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" k="email" error={errors.email}>
            <input {...field("email")} type="email" autoComplete="email" inputMode="email" />
          </Field>
          <Field label="Mobile number" k="phone" error={errors.phone}>
            <input {...field("phone")} type="tel" autoComplete="tel-national" inputMode="tel" placeholder="10-digit number" />
          </Field>
        </div>
        <Field label="Delivery address" k="address" error={errors.address}>
          <textarea {...field("address")} rows={2} autoComplete="street-address" placeholder="House no., street, area, landmark" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" k="city" error={errors.city}>
            <input {...field("city")} autoComplete="address-level2" />
          </Field>
          <Field label="PIN code" k="pincode" error={errors.pincode}>
            <input {...field("pincode")} autoComplete="postal-code" inputMode="numeric" maxLength={6} />
          </Field>
        </div>
        <Field label="State" k="state" error={errors.state}>
          <select {...field("state")} autoComplete="address-level1">
            <option value="">Choose your state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>

        <div className="rounded-2xl bg-muted p-4 text-sm">
          <p className="font-semibold">Order summary</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {lines.map((l) => (
              <li key={l.id} className="flex justify-between gap-3">
                <span className="truncate">
                  {l.name} × {l.qty}
                </span>
                <span className="shrink-0 tabular-nums">{inr.format(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="border-t border-border bg-surface px-5 pt-4 pb-6 sm:px-6">
        <AnimatePresence>
          {message && (
            <m.p
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-3 rounded-xl border border-tea-rose/30 bg-tea-rose/10 px-4 py-2.5 text-sm text-[#8a2433]"
            >
              {message}
            </m.p>
          )}
        </AnimatePresence>
        <div className="flex items-baseline justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="font-serif text-2xl font-semibold">{inr.format(subtotal)}</span>
        </div>
        <button
          type="submit"
          disabled={busy || lines.length === 0}
          className="mt-4 flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70"
        >
          {busy && <Spinner />}
          {status === "creating" ? "Starting payment…" : status === "paying" ? "Complete payment in the Razorpay window" : status === "verifying" ? "Confirming payment…" : `Pay ${inr.format(subtotal)}`}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          Payments are processed securely by Razorpay
        </p>
      </footer>
    </form>
  );
}

function Field({ label, k, error, children }: { label: string; k: keyof Customer; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`co-${k}`} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`co-${k}-err`} className="mt-1 text-sm text-[#a3283a]">
          {error}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
