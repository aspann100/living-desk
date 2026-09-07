"use client";

import { useRef, useCallback, type ReactNode, type PointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LABELS } from "@/lib/labels";
import { spring } from "@/lib/motion";
import type { DeskWindow } from "@/store/windowStore";
import { useWindowStore } from "@/store/windowStore";

type Props = {
  win: DeskWindow;
  children: ReactNode;
  width?: number;
  height?: number;
};

export function PaperWindow({ win, children, width = 420, height = 480 }: Props) {
  const reduce = useReducedMotion();
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const moveWindow = useWindowStore((s) => s.moveWindow);

  const drag = useRef<{ ox: number; oy: number; sx: number; sy: number } | null>(null);
  const focused = win.phase === "focused";
  const visible =
    win.phase === "open" ||
    win.phase === "focused" ||
    win.phase === "opening" ||
    win.phase === "closing";

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-chrome-btn]")) return;
      focusWindow(win.id);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      drag.current = { ox: e.clientX, oy: e.clientY, sx: win.x, sy: win.y };
    },
    [focusWindow, win.id, win.x, win.y]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!drag.current) return;
      const dx = e.clientX - drag.current.ox;
      const dy = e.clientY - drag.current.oy;
      moveWindow(win.id, drag.current.sx + dx, drag.current.sy + dy);
    },
    [moveWindow, win.id]
  );

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  if (win.phase === "minimized" || win.phase === "closed") return null;
  if (!visible) return null;

  const instant = !!reduce;

  return (
    <motion.div
      role="dialog"
      aria-label={win.title}
      className="absolute flex flex-col overflow-hidden rounded-md bg-paper"
      style={{
        left: win.x,
        top: win.y,
        width,
        maxWidth: "min(420px, calc(100vw - 24px))",
        height,
        maxHeight: "min(520px, calc(100vh - 80px))",
        zIndex: win.zIndex,
        boxShadow: "var(--shadow-paper)",
        border: "1px solid color-mix(in srgb, var(--graphite) 18%, transparent)",
      }}
      initial={instant ? false : { opacity: 0, scale: 0.96, y: 6 }}
      animate={
        win.phase === "closing"
          ? { opacity: 0, scale: 0.96, y: 6 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      transition={instant ? { duration: 0 } : { ...spring, duration: 0.28 }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Paper tab title bar = drag handle (raised paper tab, not a plain strip) */}
      <div
        className="relative flex h-10 shrink-0 cursor-grab items-stretch active:cursor-grabbing"
        style={{
          background: "color-mix(in srgb, var(--paper) 80%, var(--folder-cream))",
          borderBottom: "1px solid color-mix(in srgb, var(--graphite) 12%, transparent)",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div
          className="relative z-[1] ml-2 mt-[3px] flex min-w-0 flex-1 items-center rounded-t-md px-3"
          style={{
            background:
              "linear-gradient(180deg, var(--paper-raised), color-mix(in srgb, var(--paper-raised) 65%, var(--folder-cream)))",
            boxShadow:
              "inset 0 1px 0 rgb(255 255 255 / 75%), 0 2px 4px rgb(30 58 95 / 6%)",
            borderLeft: "1px solid color-mix(in srgb, var(--graphite) 14%, transparent)",
            borderRight: "1px solid color-mix(in srgb, var(--graphite) 14%, transparent)",
            borderTop: "1px solid color-mix(in srgb, var(--graphite) 14%, transparent)",
          }}
        >
          <span
            className={`truncate text-[13px] font-medium ${
              focused ? "text-ink" : "text-ink-muted"
            }`}
          >
            {win.title}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1 px-2">
          <button
            type="button"
            data-chrome-btn
            aria-label={LABELS.window.minimize}
            title={LABELS.window.minimize}
            className="flex h-6 w-6 items-center justify-center rounded text-graphite-soft hover:bg-folder hover:text-graphite"
            onClick={() => minimizeWindow(win.id)}
          >
            <span className="block h-px w-3 bg-current" />
          </button>
          <button
            type="button"
            data-chrome-btn
            aria-label={LABELS.window.close}
            title={LABELS.window.close}
            className="flex h-6 w-6 items-center justify-center rounded text-graphite-soft hover:bg-folder hover:text-graphite"
            onClick={() => closeWindow(win.id)}
          >
            ✕
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 text-ink">{children}</div>
    </motion.div>
  );
}
