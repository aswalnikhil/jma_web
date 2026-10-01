// SAMPLE PRICES. Replace before launch.
// While `sample` is true a visible "Sample prices" notice is shown above the
// tiers. Bundle prices are fixed; compare-at prices are derived from the
// single-jar price in lib/products.ts.

import { JAR_PRICE } from "./products";

export const pricingIsSample = true;

export type Tier = {
  id: string;
  name: string;
  tagline: string;
  jars: number;
  price: number; // INR
  compareAt?: number; // INR, shown struck through
  features: string[];
  cta: string;
  /** link: scroll to the shop · trio: open the picker · bundle: add straight to cart */
  action: "link" | "trio" | "bundle";
  popular?: boolean;
  /** Product slugs shown in the card's jar stack */
  preview: string[];
};

export const tiers: Tier[] = [
  {
    id: "single",
    name: "Single Jar",
    tagline: "Start with the one that calls to you.",
    jars: 1,
    price: JAR_PRICE,
    features: ["Any 1 tea from the collection", "Whole leaves, flowers & buds", "Reusable glass jar"],
    cta: "Choose your tea",
    action: "link",
    preview: ["hibiscus"],
  },
  {
    id: "trio",
    name: "Discovery Trio",
    tagline: "Three moods, one order. Our favourite way to begin.",
    jars: 3,
    price: 799,
    compareAt: 3 * JAR_PRICE,
    features: ["Any 3 teas, mix freely", "Whole leaves, flowers & buds", "Reusable glass jars"],
    cta: "Build your trio",
    action: "trio",
    popular: true,
    preview: ["blue-pea", "nettle", "lemon-green"],
  },
  {
    id: "collection",
    name: "Full Collection",
    tagline: "All 11 Himalayan teas, for the curious and the gifting.",
    jars: 11,
    price: 2799,
    compareAt: 11 * JAR_PRICE,
    features: ["All 11 teas, one of each", "Whole leaves, flowers & buds", "Reusable glass jars"],
    cta: "Get the collection",
    action: "bundle",
    preview: ["lavender-buds", "hibiscus", "nettle", "blue-pea", "shee-special"],
  },
];

export const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
