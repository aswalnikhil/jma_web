// Checkout types and validation shared by the checkout form (browser) and the
// order route (server). No secrets here. Razorpay keys live in .env.local and
// are only read in lib/server/razorpay.ts.

export type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export const emptyCustomer: Customer = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

/** Accepts "+91 98765 43210", "098765-43210", etc. and returns the 10 digits. */
export const normalizePhone = (s: string) =>
  s.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");

export function normalizeCustomer(raw: unknown): Customer {
  const c = (raw ?? {}) as Record<string, unknown>;
  const str = (k: keyof Customer) => (typeof c[k] === "string" ? (c[k] as string).trim() : "");
  return {
    name: str("name"),
    email: str("email"),
    phone: normalizePhone(str("phone")),
    address: str("address"),
    city: str("city"),
    state: str("state"),
    pincode: str("pincode"),
  };
}

export function customerErrors(c: Customer): Partial<Record<keyof Customer, string>> {
  const e: Partial<Record<keyof Customer, string>> = {};
  if (c.name.length < 2 || c.name.length > 80) e.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email) || c.email.length > 120) e.email = "Please enter a valid email address.";
  if (!/^[6-9]\d{9}$/.test(c.phone)) e.phone = "Please enter a 10-digit Indian mobile number.";
  if (c.address.length < 8 || c.address.length > 200) e.address = "Please enter your full address (house, street, area).";
  if (c.city.length < 2 || c.city.length > 60) e.city = "Please enter your city.";
  if (!INDIAN_STATES.includes(c.state)) e.state = "Please choose your state.";
  if (!/^[1-9]\d{5}$/.test(c.pincode)) e.pincode = "Please enter a valid 6-digit PIN code.";
  return e;
}

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

/* ---------- API shapes ---------- */

export type OrderRequest = { items: { id: string; qty: number }[]; customer: Customer };
export type OrderResponse = { orderId: string; amount: number; currency: string; keyId: string };
export type VerifyRequest = { orderId: string; paymentId: string; signature: string };
export type ApiError = { error: string };
