export type Product = {
  slug: string;
  name: string;
  kind: string;
  weight: string;
  /** INR */
  price: number;
  /** Tailwind color token from the label, e.g. "tea-hibiscus" */
  color: string;
  /** Transparent cut-outs made by scripts/cutout-products.mjs */
  image: { src: string; width: number; height: number };
};

// SAMPLE PRICE. Replace before launch (per product if prices differ).
export const JAR_PRICE = 299;
export const productPricesAreSample = true;

export const products: Product[] = [
  { slug: "nettle", name: "Himalayan Nettle", kind: "Tea", weight: "20g", price: JAR_PRICE, color: "tea-nettle", image: { src: "/products/nettle.webp", width: 162, height: 385 } },
  { slug: "hibiscus", name: "Hibiscus", kind: "Flower Tea", weight: "50g", price: JAR_PRICE, color: "tea-hibiscus", image: { src: "/products/hibiscus.webp", width: 160, height: 386 } },
  { slug: "blue-pea", name: "Blue Pea", kind: "Flower Tea", weight: "40g", price: JAR_PRICE, color: "tea-bluepea", image: { src: "/products/blue-pea.webp", width: 160, height: 386 } },
  { slug: "tulsi-green", name: "Himalayan Tulsi Green", kind: "Tea", weight: "20g", price: JAR_PRICE, color: "tea-nettle", image: { src: "/products/tulsi-green.webp", width: 161, height: 387 } },
  { slug: "lavender-buds", name: "Himalayan Lavender", kind: "Buds", weight: "50g", price: JAR_PRICE, color: "tea-lavender", image: { src: "/products/lavender-buds.webp", width: 161, height: 386 } },
  { slug: "shee-special", name: "Shee Special", kind: "Tea", weight: "60g", price: JAR_PRICE, color: "tea-rose", image: { src: "/products/shee-special.webp", width: 162, height: 384 } },
  { slug: "lemon-green", name: "Lemon Green", kind: "Tea", weight: "50g", price: JAR_PRICE, color: "tea-lemon", image: { src: "/products/lemon-green.webp", width: 161, height: 386 } },
  { slug: "ginger-green", name: "Ginger Green", kind: "Tea", weight: "50g", price: JAR_PRICE, color: "tea-ginger", image: { src: "/products/ginger-green.webp", width: 162, height: 387 } },
  { slug: "raspberry-leaf", name: "Himalayan Raspberry", kind: "Leaf Tea", weight: "20g", price: JAR_PRICE, color: "tea-raspberry", image: { src: "/products/raspberry-leaf.webp", width: 161, height: 387 } },
  { slug: "raspberry-mint", name: "Himalayan Raspberry Mint", kind: "Tea", weight: "50g", price: JAR_PRICE, color: "tea-rose", image: { src: "/products/raspberry-mint.webp", width: 166, height: 398 } },
  { slug: "rosemary-green", name: "Himalayan Rosemary", kind: "Green Tea", weight: "50g", price: JAR_PRICE, color: "tea-lavender", image: { src: "/products/rosemary-green.webp", width: 160, height: 386 } },
];

export const bySlug = (slug: string) => {
  const p = products.find((p) => p.slug === slug);
  if (!p) throw new Error(`Unknown product: ${slug}`);
  return p;
};

// Literal class names so Tailwind can see them at build time.
export const teaBg: Record<string, string> = {
  "tea-rose": "bg-tea-rose",
  "tea-lavender": "bg-tea-lavender",
  "tea-bluepea": "bg-tea-bluepea",
  "tea-hibiscus": "bg-tea-hibiscus",
  "tea-lemon": "bg-tea-lemon",
  "tea-nettle": "bg-tea-nettle",
  "tea-ginger": "bg-tea-ginger",
  "tea-raspberry": "bg-tea-raspberry",
};
