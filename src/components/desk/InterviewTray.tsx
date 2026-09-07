"use client";

import { useDroppable } from "@dnd-kit/core";
import { motion, useReducedMotion } from "motion/react";
import { LABELS } from "@/lib/labels";
import { useTrayStore, type TrayPhase } from "@/store/trayStore";

const labelFor = (phase: TrayPhase) => {
  switch (phase) {
    case "hover":
      return LABELS.tray.hover;
    case "armed":
      return LABELS.tray.armed;
    case "accepted":
      return LABELS.tray.accepted;
    default:
      return LABELS.tray.idle;
  }
};

export function InterviewTray() {
  const phase = useTrayStore((s) => s.phase);
  const shaking = useTrayStore((s) => s.shaking);
  const reduce = useReducedMotion();
  const { setNodeRef, isOver } = useDroppable({ id: "interview-tray" });

  const glow =
    phase === "idle"
      ? "0 0 0 1px var(--stamp-red), 0 0 0 2.5px color-mix(in srgb, var(--stamp-red) 55%, transparent), 0 0 18px var(--tray-glow)"
      : phase === "armed" || isOver
        ? "0 0 0 1px var(--stamp-red), 0 0 0 3px var(--stamp-red), 0 0 22px var(--tray-glow)"
        : "0 0 0 1px var(--stamp-red), 0 0 0 2.5px color-mix(in srgb, var(--stamp-red) 70%, transparent), 0 0 18px var(--tray-glow)";

  return (
    <motion.div
      ref={setNodeRef}
      className="absolute bottom-4 left-1/2 z-[5] w-[min(320px,90vw)] -translate-x-1/2 rounded-md bg-paper-raised px-4 py-3"
      style={{
        boxShadow: `var(--shadow-contact), ${glow}`,
        border: "2px solid color-mix(in srgb, var(--stamp-red) 72%, transparent)",
      }}
      animate={
        shaking && !reduce
          ? { x: [0, -6, 6, -4, 4, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.4 }}
      aria-label={labelFor(phase)}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium text-stamp">{labelFor(phase)}</p>
          <p className="mt-0.5 text-[12px] text-ink-muted">{LABELS.tray.emptyHint}</p>
        </div>
        <div
          className="h-8 w-8 shrink-0 rounded-full"
          style={{ background: "var(--stamp-red-soft)", boxShadow: "inset 0 0 0 2px var(--stamp-red)" }}
          aria-hidden
        />
      </div>
    </motion.div>
  );
}
