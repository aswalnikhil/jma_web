"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { MAX_QTY } from "./cart-limits";

export type CartLine = {
  /** Product slug, or a bundle key such as "trio:blue-pea+hibiscus+nettle" */
  id: string;
  name: string;
  detail: string;
  price: number; // INR, per unit
  qty: number;
  image: { src: string; width: number; height: number };
};

export { MAX_QTY };

/* ---------- Persistent store (localStorage), read via useSyncExternalStore ---------- */

const KEY = "jma-cart-v1";
const EMPTY: CartLine[] = [];
let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) lines = JSON.parse(raw);
  } catch {
    lines = EMPTY;
  }
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode etc.): cart still works for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    load();
    cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => {
  load();
  return lines;
};
const getServerSnapshot = () => EMPTY;

/* ---------- Context: cart actions + drawer/toast UI state ---------- */

type Toast = { key: number; line: Omit<CartLine, "qty"> };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "qty">, opts?: { qty?: number; buyNow?: boolean }) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toast: Toast | null;
  dismissToast: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const add = useCallback<CartContextValue["add"]>((line, opts = {}) => {
    const qty = opts.qty ?? 1;
    const existing = lines.find((l) => l.id === line.id);
    commit(
      existing
        ? lines.map((l) => (l.id === line.id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
        : [...lines, { ...line, qty: Math.min(MAX_QTY, qty) }],
    );
    if (opts.buyNow) {
      setToast(null);
      setOpen(true);
    } else {
      setToast({ key: Date.now(), line });
    }
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    if (qty < 1) return commit(lines.filter((l) => l.id !== id));
    commit(lines.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)));
  }, []);

  const remove = useCallback((id: string) => commit(lines.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => commit(EMPTY), []);
  const openCart = useCallback(() => {
    setToast(null);
    setOpen(true);
  }, []);
  const closeCart = useCallback(() => setOpen(false), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: current,
      count: current.reduce((n, l) => n + l.qty, 0),
      subtotal: current.reduce((n, l) => n + l.qty * l.price, 0),
      add,
      setQty,
      remove,
      clear,
      isOpen,
      openCart,
      closeCart,
      toast,
      dismissToast,
    }),
    [current, add, setQty, remove, clear, isOpen, openCart, closeCart, toast, dismissToast],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
