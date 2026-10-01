"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";

const noop = () => () => {};
/** false during SSR and hydration, true afterwards, without a setState-in-effect. */
const useIsClient = () => useSyncExternalStore(noop, () => true, () => false);

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal surface: a right-hand drawer or a centred dialog
 * (bottom sheet on phones). Handles Escape, focus trap, focus restore
 * and background scroll lock.
 */
export function Sheet({
  open,
  onClose,
  labelledBy,
  side = "right",
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  side?: "right" | "center";
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const focusFirst = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(focusFirst);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previous?.focus?.();
    };
  }, [open]);

  const isClient = useIsClient();
  const right = side === "right";

  // Portal to <body> so the sheet never inherits text colour or a transformed
  // containing block from wherever it was declared (e.g. a hovered card).
  if (!isClient) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]" key="sheet">
          <m.div
            aria-hidden="true"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <div
            className={
              right
                ? "pointer-events-none absolute inset-y-0 right-0 flex w-full max-w-md"
                : "pointer-events-none absolute inset-0 flex items-end justify-center sm:items-center sm:p-6"
            }
          >
            <m.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledBy}
              initial={right ? { x: "100%" } : { y: 48, opacity: 0 }}
              animate={right ? { x: 0 } : { y: 0, opacity: 1 }}
              exit={right ? { x: "100%" } : { y: 48, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className={`pointer-events-auto flex w-full flex-col bg-background text-foreground shadow-2xl ${
                right
                  ? "h-full"
                  : "max-h-[92dvh] max-w-3xl rounded-t-3xl sm:rounded-3xl"
              }`}
            >
              {children}
            </m.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function CloseButton({ onClick, label = "Close" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
