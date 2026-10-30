"use client";
import { create } from "zustand";
type Overlay = "menu" | "search" | "cart" | null;
export const useUi = create<{ overlay: Overlay; setOverlay: (overlay: Overlay) => void }>((set) => ({ overlay: null, setOverlay: (overlay) => set({ overlay }) }));
