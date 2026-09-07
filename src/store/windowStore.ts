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

const isActivePhase = (phase: WindowPhase) =>
  phase === "open" || phase === "focused" || phase === "opening";

/** Minimize lowest-z active windows until fewer than `roomFor` slots are free (active < MAX_OPEN - roomFor + 1... → leave room for `incoming` new actives). */
function withCap(
  windows: DeskWindow[],
  incoming = 1,
  excludeId?: string
): DeskWindow[] {
  let next = windows;
  for (;;) {
    const active = next
      .filter((w) => isActivePhase(w.phase) && w.id !== excludeId)
      .sort((a, b) => a.zIndex - b.zIndex);
    // After adding `incoming` windows (or restoring excludeId), active count must be ≤ MAX_OPEN
    if (active.length + incoming <= MAX_OPEN) return next;
    const oldest = active[0];
    if (!oldest) return next;
    next = next.map((w) =>
      w.id === oldest.id ? { ...w, phase: "minimized" as const } : w
    );
  }
}

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
            const z = get().nextZ;
            const capped = withCap(
              get().windows.map((w) =>
                w.phase === "focused" ? { ...w, phase: "open" as const } : w
              ),
              1
            );
            set({
              windows: capped.map((w) =>
                w.id === partial.id
                  ? { ...w, phase: "opening" as const, zIndex: z }
                  : w
              ),
              nextZ: z + 1,
            });
            setTimeout(() => get().setPhase(partial.id, "focused"), 20);
          } else {
            get().focusWindow(partial.id);
          }
          return;
        }

        const z = get().nextZ;
        const prepared = withCap(
          get().windows.map((w) =>
            w.phase === "focused" ? { ...w, phase: "open" as const } : w
          ),
          1
        );

        const win: DeskWindow = {
          id: partial.id,
          kind: partial.kind,
          title: partial.title,
          slug: partial.slug,
          phase: "opening",
          zIndex: z,
          x: partial.x ?? 72 + (z % 5) * 56,
          y: partial.y ?? 48 + (z % 5) * 44,
        };

        set({
          windows: [...prepared, win],
          nextZ: z + 1,
        });

        setTimeout(() => {
          get().setPhase(partial.id, "focused");
        }, 280);
      },

      focusWindow: (id) => {
        const target = get().windows.find((w) => w.id === id);
        if (!target) return;
        const restoring = target.phase === "minimized" || target.phase === "closed";
        const z = get().nextZ;
        let windows = get().windows.map((w) =>
          w.phase === "focused" ? { ...w, phase: "open" as const } : w
        );
        if (restoring) {
          windows = withCap(windows, 1, id);
        }
        windows = windows.map((w) =>
          w.id === id
            ? {
                ...w,
                phase: restoring ? ("opening" as const) : ("focused" as const),
                zIndex: z,
              }
            : w
        );
        set({ windows, nextZ: z + 1 });
        if (restoring) {
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
