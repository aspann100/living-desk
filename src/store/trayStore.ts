"use client";

import { create } from "zustand";

export type TrayPhase = "idle" | "hover" | "armed" | "accepted";

type TrayState = {
  phase: TrayPhase;
  shaking: boolean;
  setPhase: (p: TrayPhase) => void;
  shake: () => void;
  accept: () => void;
  reset: () => void;
};

export const useTrayStore = create<TrayState>((set, get) => ({
  phase: "idle",
  shaking: false,
  setPhase: (phase) => set({ phase }),
  shake: () => {
    set({ shaking: true });
    setTimeout(() => set({ shaking: false, phase: "idle" }), 420);
  },
  accept: () => {
    set({ phase: "accepted" });
    setTimeout(() => get().reset(), 900);
  },
  reset: () => set({ phase: "idle", shaking: false }),
}));
