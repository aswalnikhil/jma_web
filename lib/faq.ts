// Answers marked `confirm: true` contain business details we don't know yet
// (shipping, returns, shelf life, ingredients). They show a visible
// "To confirm" badge and are left out of the FAQ structured data until
// the flag is removed.

export type Faq = { q: string; a: string[]; confirm?: boolean };

export const faqs: Faq[] = [
  {
    q: "How do I brew the perfect cup?",
    a: [
      "Use 1–2 teaspoons per cup (about 250 ml). Pour water that has just come off the boil and steep for 5–7 minutes, covered to keep the aroma in. Strain and enjoy as is, or with honey or a squeeze of lemon.",
      "Flower teas like hibiscus and blue pea colour the water within a minute or two. Longer steeping gives a deeper flavour. Check the jar for any tea-specific directions.",
    ],
  },
  {
    q: "Which tea should I start with?",
    a: [
      "Floral and calming: Lavender or Blue Pea. Bright and tart: Hibiscus or Raspberry Mint. Earthy and grounding: Nettle or Raspberry Leaf. Fresh and zesty: Lemon Green, Tulsi Green or Ginger Green.",
      "Can't decide? The Discovery Trio lets you pick any three.",
    ],
  },
  {
    q: "Are the teas caffeine-free?",
    a: [
      "Pure herbal and flower teas such as Hibiscus, Blue Pea, Nettle, Lavender and Raspberry Leaf are naturally caffeine-free. Blends with “Green” in the name may include green tea leaves, which contain some caffeine. Check the ingredients on the jar.",
    ],
    confirm: true,
  },
  {
    q: "How should I store my tea, and how long does it last?",
    a: [
      "Keep the lid tightly closed and store the jar in a cool, dry place away from direct sunlight and strong smells. Use a dry spoon every time.",
      "[Shelf life, e.g. “Best within 12 months of packing. See the date on the jar.”]",
    ],
    confirm: true,
  },
  {
    q: "How do the bundles work?",
    a: [
      "The Discovery Trio lets you choose any three teas from the collection, in any combination. The Full Collection includes one jar of each of our 11 teas. Both are priced lower than buying the same jars individually.",
    ],
  },
  {
    q: "Is it safe for everyone?",
    a: [
      "Our teas are made only from herbs, flowers and leaves, but some herbs aren't suitable for everyone. If you're pregnant, breastfeeding, taking medication or have a health condition, please check with your doctor before trying a new herbal tea.",
    ],
  },
  {
    q: "Where do you ship, and how long does delivery take?",
    a: ["[Shipping regions, delivery times and any shipping charges.]"],
    confirm: true,
  },
  {
    q: "What if my order arrives damaged?",
    a: ["[Returns / replacement policy, e.g. how to report a broken jar and how quickly it's replaced.]"],
    confirm: true,
  },
];
