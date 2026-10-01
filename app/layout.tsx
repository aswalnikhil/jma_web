import type { Metadata, Viewport } from "next";
import { Lora, Raleway } from "next/font/google";
import { LazyCartDrawer } from "@/components/cart-drawer-lazy";
import { MotionProvider } from "@/components/motion-provider";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JMA Herbals — The Real Taste of Himalayan Herbs",
  description:
    "Hand-picked Himalayan herbal teas: nettle, tulsi, hibiscus, blue pea, lavender and more. Caffeine-light, naturally dried, packed in glass.",
};

export const viewport: Viewport = {
  themeColor: "#fbf8f1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${lora.variable} ${raleway.variable} h-full antialiased`}
    >
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) inject attributes
          on <body> before React hydrates; ignore those attribute-only mismatches. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <MotionProvider>
          <CartProvider>
            {children}
            <LazyCartDrawer />
          </CartProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
