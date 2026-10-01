// Per-tea content for the shop showcase. Descriptions are DRAFT tasting notes
// (flavour only, no health claims). Review and adjust to your own wording.
// `from` is the darker side of the background, behind the text: every `from`
// keeps white text above 4.5:1 contrast. `to` is the lighter glow behind the jar.

export type Showcase = {
  blurb: string;
  notes: string[];
  from: string;
  to: string;
};

export const showcase: Record<string, Showcase> = {
  nettle: {
    blurb: "Earthy, grassy and gently mineral. Himalayan nettle leaves brew a smooth, deep-green cup that's lovely plain or with a spoon of honey.",
    notes: ["Earthy", "Grassy", "Smooth"],
    from: "#1d4a28",
    to: "#4a9458",
  },
  hibiscus: {
    blurb: "Tart, fruity and ruby-red. Whole hibiscus petals brew a bright, cranberry-like cup that's just as good iced as it is hot.",
    notes: ["Tart", "Fruity", "Ruby-red"],
    from: "#5a1320",
    to: "#b53a4d",
  },
  "blue-pea": {
    blurb: "Mild, woody and famously blue. Watch the cup turn deep indigo, then add a squeeze of lemon and see it shift to violet.",
    notes: ["Mild", "Woody", "Colour-changing"],
    from: "#2b2563",
    to: "#6559c2",
  },
  "tulsi-green": {
    blurb: "Fresh and a little peppery, with the warm, clove-like aroma of holy basil. A bright, green everyday cup.",
    notes: ["Fresh", "Peppery", "Aromatic"],
    from: "#234e2b",
    to: "#5c9a47",
  },
  "lavender-buds": {
    blurb: "Sweet, floral and fragrant. Steep a pinch of buds on their own, or add them to chamomile or black tea for a floral lift.",
    notes: ["Floral", "Sweet", "Fragrant"],
    from: "#463a82",
    to: "#9585d0",
  },
  "shee-special": {
    blurb: "Our signature Himalayan house blend: balanced, aromatic and easy to love. A good cup for any time of day.",
    notes: ["Balanced", "Aromatic", "Signature"],
    from: "#7e1f2e",
    to: "#d45c70",
  },
  "lemon-green": {
    blurb: "Bright and zesty, with a clean citrus lift over soft green leaves. Refreshing hot, even better chilled.",
    notes: ["Zesty", "Citrus", "Refreshing"],
    from: "#5f5000",
    to: "#c9a400",
  },
  "ginger-green": {
    blurb: "Warming and gently spicy, with a friendly ginger kick. A comforting cup for cool mornings.",
    notes: ["Warming", "Spicy", "Comforting"],
    from: "#5a4020",
    to: "#b08850",
  },
  "raspberry-leaf": {
    blurb: "Smooth, mellow and lightly fruity, with a flavour a lot like a soft black tea, minus the caffeine.",
    notes: ["Mellow", "Smooth", "Lightly fruity"],
    from: "#723010",
    to: "#d27a40",
  },
  "raspberry-mint": {
    blurb: "Cool mint meets soft raspberry leaf for a fresh, rounded cup that's easy to sip all afternoon.",
    notes: ["Minty", "Fresh", "Rounded"],
    from: "#80263a",
    to: "#d46479",
  },
  "rosemary-green": {
    blurb: "Herbal and piney, with rosemary's fragrant, woodsy notes over a light green base.",
    notes: ["Herbal", "Piney", "Woodsy"],
    from: "#3b3669",
    to: "#8079bf",
  },
};
