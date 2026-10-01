"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useCart } from "@/lib/cart";

const CartDrawer = dynamic(() => import("./cart-drawer").then((mod) => mod.CartDrawer), {
  ssr: false,
});

/** Loads the cart drawer + toast code the first time either is needed. */
export function LazyCartDrawer() {
  const { isOpen, toast } = useCart();
  const [needed, setNeeded] = useState(false);
  if ((isOpen || toast) && !needed) setNeeded(true);
  return needed ? <CartDrawer /> : null;
}
