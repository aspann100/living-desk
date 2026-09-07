"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WindowKind = "folder" | "case" | "about";
export type WindowPhase =
  | "closed"
  | "opening"
  | "open"
  | "focused"
  | "minimized"
  | "closing";

export type DeskWindow = {
  id: string;
  kind: WindowKind;
  title: string;
  slug?: string;
  phase: WindowPhase;
  zIndex: number;
  x: number;
  y: number;
};

type WindowState = {
  windows: DeskWindow[];
  nextZ: number;
  openWindow: (w: Omit<DeskWindow, "phase" | "zIndex" | "x" | "y"> & Partial<Pick<DeskWindow, "x" | "y">>) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  setPhase: (id: string, phase: WindowPhase) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  closeFocused: () => void;
  cycleFocus: (direction?: 1 | -1) => void;
  openBySlug: (slug: string) => void;
  getFocused: () => DeskWindow | undefined;
};

const MAX_OPEN = 3;

const defaults: Record<string, { title: string; kind: WindowKind; slug?: string }> = {
  work: { title: "Work/", kind: "folder" },
  experiments: { title: "Experiments/", kind: "folder" },
  about: { title: "About/", kind: "about" },
  "warm-intake": { title: "Warm Intake", kind: "case", slug: "warm-intake" },
};

export const useWindowStore = create<WindowState>()(
  persist(
    (set, get) => ({
      windows: [],
      nextZ: 10,

      openWindow: (partial) => {
        const existing = get().windows.find((w) => w.id === partial.id);
        if (existing) {
          if (existing.phase === "minimized" || existing.phase === "closed") {
            set((s) => ({
              windows: s.windows.map((w) =>
                w.id === partial.id
                  ? { ...w, phase: "opening", zIndex: s.nextZ }
                  : w.phase === "focused"
                    ? { ...w, phase: "open" }
                    : w
              ),
              nextZ: s.nextZ + 1,
            }));
            setTimeout(() => get().setPhase(partial.id, "focused"), 20);
          } else {
            get().focusWindow(partial.id);
          }
          return;
        }

        const openCount = get().windows.filter(
          (w) => w.phase === "open" || w.phase === "focused" || w.phase === "opening"
        ).length;

        let windows = [...get().windows];
        if (openCount >= MAX_OPEN) {
          const oldest = windows
            .filter((w) => w.phase === "open" || w.phase === "focused")
            .sort((a, b) => a.zIndex - b.zIndex)[0];
          if (oldest) {
            windows = windows.map((w) =>
              w.id === oldest.id ? { ...w, phase: "minimized" } : w
            );
          }
        }

        const z = get().nextZ;
        const win: DeskWindow = {
          id: partial.id,
          kind: partial.kind,
          title: partial.title,
          slug: partial.slug,
          phase: "opening",
          zIndex: z,
          x: partial.x ?? 80 + (z % 5) * 28,
          y: partial.y ?? 60 + (z % 5) * 24,
        };

        set({
          windows: [
            ...windows.map((w) =>
              w.phase === "focused" ? { ...w, phase: "open" as const } : w
            ),
            win,
          ],
          nextZ: z + 1,
        });

        setTimeout(() => {
          get().setPhase(partial.id, "focused");
        }, 280);
      },

      focusWindow: (id) => {
        const z = get().nextZ;
        set((s) => ({
          windows: s.windows.map((w) => {
            if (w.id === id) {
              return {
                ...w,
                phase: w.phase === "minimized" ? "opening" : "focused",
                zIndex: z,
              };
            }
            if (w.phase === "focused") return { ...w, phase: "open" };
            return w;
          }),
          nextZ: z + 1,
        }));
        const w = get().windows.find((x) => x.id === id);
        if (w?.phase === "minimized" || get().windows.find((x) => x.id === id)?.phase === "opening") {
          setTimeout(() => get().setPhase(id, "focused"), 280);
        }
      },

      minimizeWindow: (id) => {
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === id ? { ...w, phase: "minimized" } : w
          ),
        }));
      },

      closeWindow: (id) => {
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === id ? { ...w, phase: "closing" } : w
          ),
        }));
        setTimeout(() => {
          set((s) => ({
            windows: s.windows.filter((w) => w.id !== id),
          }));
        }, 220);
      },

      setPhase: (id, phase) => {
        set((s) => ({
          windows: s.windows.map((w) => (w.id === id ? { ...w, phase } : w)),
        }));
      },

      moveWindow: (id, x, y) => {
        set((s) => ({
          windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
        }));
      },

      closeFocused: () => {
        const focused = get().getFocused();
        if (focused) get().closeWindow(focused.id);
      },

      cycleFocus: (direction = 1) => {
        const open = get()
          .windows.filter(
            (w) =>
              w.phase === "open" ||
              w.phase === "focused" ||
              w.phase === "opening"
          )
          .sort((a, b) => a.zIndex - b.zIndex);
        if (!open.length) return;
        if (open.length === 1) {
          get().focusWindow(open[0].id);
          return;
        }
        const focused = get().getFocused();
        const idx = focused ? open.findIndex((w) => w.id === focused.id) : -1;
        const next = open[(idx + direction + open.length) % open.length];
        get().focusWindow(next.id);
      },

      openBySlug: (slug) => {
        const def = defaults[slug] ?? {
          title: slug,
          kind: "case" as const,
          slug,
        };
        get().openWindow({
          id: slug,
          title: def.title,
          kind: def.kind,
          slug: def.slug ?? slug,
        });
      },

      getFocused: () => {
        const wins = get().windows.filter(
          (w) => w.phase === "focused" || w.phase === "open"
        );
        if (!wins.length) return undefined;
        return wins.sort((a, b) => b.zIndex - a.zIndex)[0];
      },
    }),
    {
      name: "living-desk-windows",
      partialize: (s) => ({
        windows: s.windows
          .filter((w) => w.phase !== "closing" && w.phase !== "closed")
          .map((w) => ({
            ...w,
            phase:
              w.phase === "opening" || w.phase === "focused" || w.phase === "open"
                ? ("open" as const)
                : w.phase,
          })),
        nextZ: s.nextZ,
      }),
    }
  )
);

export function openDeskObject(id: string) {
  const def = defaults[id];
  if (!def) return;
  useWindowStore.getState().openWindow({
    id,
    title: def.title,
    kind: def.kind,
    slug: def.slug,
  });
}
