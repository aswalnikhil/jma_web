// SAMPLE CONTENT. Replace with real customer reviews before launch.
// While `sample` is true the card shows a visible "Sample review" badge,
// so placeholder text can't ship unnoticed. Set it to false (or remove it)
// once a real, attributable review is pasted in.

export type Testimonial = {
  quote: string;
  name: string;
  place: string;
  product: string; // product slug from lib/products.ts
  rating: 1 | 2 | 3 | 4 | 5;
  sample?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "The blue pea tea turns the most beautiful deep blue, and a squeeze of lemon makes it go purple. My kids ask for it every evening. The jar looks lovely on the kitchen shelf too.",
    name: "Customer name",
    place: "City",
    product: "blue-pea",
    rating: 5,
    sample: true,
  },
  {
    quote:
      "You can actually see whole hibiscus petals in the jar. It brews a rich ruby colour and tastes tart and fresh, nothing like tea bags.",
    name: "Customer name",
    place: "City",
    product: "hibiscus",
    rating: 5,
    sample: true,
  },
  {
    quote:
      "Nettle tea with a spoon of honey has become my morning ritual. Earthy, clean and very smooth.",
    name: "Customer name",
    place: "City",
    product: "nettle",
    rating: 5,
    sample: true,
  },
  {
    quote:
      "The lavender buds smell incredible the moment you open the lid. I use a pinch in my chamomile at night.",
    name: "Customer name",
    place: "City",
    product: "lavender-buds",
    rating: 5,
    sample: true,
  },
  {
    quote:
      "Tulsi green is my favourite. Fresh and a little peppery. Glass packaging keeps it fragrant down to the last spoon.",
    name: "Customer name",
    place: "City",
    product: "tulsi-green",
    rating: 4,
    sample: true,
  },
];
