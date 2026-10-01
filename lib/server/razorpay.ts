// Server-only Razorpay helpers. Import these from Route Handlers only, never
// from client components: they read RAZORPAY_KEY_SECRET.
import { createHmac, timingSafeEqual } from "node:crypto";
import { products, bySlug } from "@/lib/products";
import { tiers } from "@/lib/pricing";
import { MAX_QTY } from "@/lib/cart-limits";
import { customerErrors, normalizeCustomer, type Customer } from "@/lib/checkout";

export class CheckoutError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

export function getCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

/* ---------- Cart pricing (server is the source of truth for prices) ---------- */

export type PricedLine = { id: string; label: string; qty: number; unit: number };

export function priceCart(items: unknown): { lines: PricedLine[]; total: number } {
  if (!Array.isArray(items) || items.length === 0) throw new CheckoutError("Your cart is empty.");
  if (items.length > 30) throw new CheckoutError("Too many items in the cart.");

  const lines = items.map((raw): PricedLine => {
    const { id, qty } = (raw ?? {}) as { id?: unknown; qty?: unknown };
    if (typeof id !== "string" || !Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > MAX_QTY) {
      throw new CheckoutError("One of the cart items is invalid. Please refresh and try again.");
    }
    return { ...priceItem(id), qty: qty as number };
  });

  const total = lines.reduce((sum, l) => sum + l.unit * l.qty, 0);
  return { lines, total };
}

function priceItem(id: string): Omit<PricedLine, "qty"> {
  const product = products.find((p) => p.slug === id);
  if (product) return { id, label: `${product.name} ${product.weight}`, unit: product.price };

  if (id.startsWith("trio:")) {
    const slugs = id.slice(5).split("+");
    const unique = new Set(slugs);
    if (slugs.length !== 3 || unique.size !== 3 || !slugs.every((s) => products.some((p) => p.slug === s))) {
      throw new CheckoutError("The Discovery Trio in your cart is invalid. Please rebuild it.");
    }
    const tier = tiers.find((t) => t.id === "trio")!;
    const names = slugs.map((s) => bySlug(s).name.replace("Himalayan ", "")).join(", ");
    return { id, label: `${tier.name} (${names})`, unit: tier.price };
  }

  const bundle = tiers.find((t) => t.id === id && t.action === "bundle");
  if (bundle) return { id, label: `${bundle.name} (all ${products.length} teas)`, unit: bundle.price };

  throw new CheckoutError("An item in your cart is no longer available. Please refresh and try again.");
}

export function validateCustomer(raw: unknown): Customer {
  const customer = normalizeCustomer(raw);
  const first = Object.values(customerErrors(customer))[0];
  if (first) throw new CheckoutError(first);
  return customer;
}

/* ---------- Razorpay API ---------- */

/** Razorpay notes: max 15 keys, 256 chars per value. */
function buildNotes(customer: Customer, lines: PricedLine[]) {
  const clip = (s: string) => s.slice(0, 256);
  const notes: Record<string, string> = {
    customer_name: clip(customer.name),
    customer_email: clip(customer.email),
    customer_phone: clip(customer.phone),
    ship_address: clip(customer.address),
    ship_city: clip(customer.city),
    ship_state: clip(customer.state),
    ship_pincode: clip(customer.pincode),
  };
  const summary = lines.map((l) => `${l.label} x${l.qty}`).join("; ");
  for (let i = 0; i * 256 < summary.length && i < 8; i++) {
    notes[`items_${i + 1}`] = summary.slice(i * 256, (i + 1) * 256);
  }
  return notes;
}

export async function createRazorpayOrder(amountPaise: number, customer: Customer, lines: PricedLine[]) {
  const creds = getCredentials();
  if (!creds) throw new CheckoutError("Payments aren't set up yet. Please try again later.", 503);

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt: `jma_${Date.now()}`,
      notes: buildNotes(customer, lines),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    // Log Razorpay's reason server-side; don't leak it to the shopper.
    console.error("Razorpay order creation failed", res.status, await res.text().catch(() => ""));
    throw new CheckoutError("We couldn't start the payment. Please try again in a moment.", 502);
  }

  const order = (await res.json()) as { id: string; amount: number; currency: string };
  return { order, keyId: creds.keyId };
}

/** Checks the signature Razorpay returns to the browser after a successful payment. */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const creds = getCredentials();
  if (!creds) throw new CheckoutError("Payments aren't set up yet.", 503);
  const expected = createHmac("sha256", creds.keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
