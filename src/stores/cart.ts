"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { addCartLine, sanitizeLines, MAX_QUANTITY, type CartLine } from "@/lib/cart";
export { resolveLine, MAX_QUANTITY } from "@/lib/cart";
export type { CartLine } from "@/lib/cart";

type CartState = {
  lines: CartLine[]; hydrated: boolean; storageWarning: string;
  setHydrated: () => void; setStorageWarning: (message: string) => void;
  add: (line: CartLine) => { ok: boolean; message: string };
  update: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
};
const storageFailure = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("section88-storage-error"));
};
const safeStorage = {
  getItem: (name: string) => { try { return localStorage.getItem(name); } catch { storageFailure(); return null; } },
  setItem: (name: string, value: string) => { try { localStorage.setItem(name, value); } catch { storageFailure(); } },
  removeItem: (name: string) => { try { localStorage.removeItem(name); } catch { storageFailure(); } },
};

export const useCart = create<CartState>()(persist((set, get) => ({
  lines: [], hydrated: false, storageWarning: "",
  setHydrated: () => set({ hydrated: true }),
  setStorageWarning: (message) => { if (get().storageWarning !== message) set({ storageWarning: message }); },
  add: (line) => {
    if (!get().hydrated) return { ok: false, message: "Your bag is still loading. Please try again." };
    const result = addCartLine(get().lines, line);
    if (result.ok) set({ lines: result.lines });
    return { ok: result.ok, message: result.message };
  },
  update: (variantId, quantity) => {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return;
    set({ lines: get().lines.map((line) => line.variantId === variantId ? { ...line, quantity } : line) });
  },
  remove: (variantId) => set({ lines: get().lines.filter((line) => line.variantId !== variantId) }),
}), {
  name: "section88-demo-bag", version: 1, skipHydration: true,
  storage: createJSONStorage(() => safeStorage),
  partialize: (state) => ({ lines: state.lines }),
  merge: (persisted, current) => ({ ...current, lines: sanitizeLines((persisted as { lines?: unknown } | undefined)?.lines) }),
}));
