"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { LABELS } from "@/lib/labels";
import { getCase } from "@/lib/cases";
import { AboutBody, WorkFolderBody, ExperimentsFolderBody, CaseBody } from "@/components/case/WindowBodies";
import { openDeskObject, useWindowStore } from "@/store/windowStore";
import { spring } from "@/lib/motion";

type Sheet = "work" | "experiments" | "about" | "warm-intake" | null;

export function MobileDesk() {
  const [sheet, setSheet] = useState<Sheet>(null);
  const reduce = useReducedMotion();
  const openBySlug = useWindowStore((s) => s.openBySlug);

  const cards: { id: Sheet; label: string }[] = [
    { id: "work", label: LABELS.folders.work },
    { id: "experiments", label: LABELS.folders.experiments },
    { id: "about", label: LABELS.folders.about },
    { id: "warm-intake", label: "Warm Intake" },
  ];

  return (
    <div className="relative flex min-h-[100dvh] flex-col desk-wash desk-grain md:hidden">
      <div className="relative z-[1] flex-1 space-y-3 px-4 pb-28 pt-8">
        <p className="mb-4 font-display text-[22px] text-ink">Living Desk</p>
        <div
          className="mb-4 rounded-md bg-sticky p-4 font-hand text-[20px] text-graphite"
          style={{ transform: "rotate(-1deg)", boxShadow: "var(--shadow-paper)" }}
        >
          {LABELS.sticky}
        </div>
        {cards.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSheet(c.id)}
            className="flex w-full items-center justify-between rounded-md bg-folder px-4 py-4 text-left"
            style={{ boxShadow: "var(--shadow-paper)" }}
          >
            <span className="text-[14px] font-medium text-ink">{c.label}</span>
            <span className="text-ink-muted">→</span>
          </button>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-graphite/10 bg-paper-raised p-3">
        <button
          type="button"
          className="w-full rounded-md bg-stamp px-4 py-3 text-[14px] font-medium text-paper"
          onClick={() => {
            openBySlug("warm-intake");
            setSheet("warm-intake");
          }}
        >
          {LABELS.mobile.sendToInterview}
        </button>
      </div>

      <AnimatePresence>
        {sheet && (
          <motion.div
            className="fixed inset-0 z-30 flex flex-col bg-paper"
            initial={reduce ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reduce ? undefined : { y: "100%" }}
            transition={reduce ? { duration: 0 } : spring}
          >
            <div className="flex h-12 items-center justify-between border-b border-graphite/10 px-4">
              <span className="text-[14px] font-medium text-ink">
                {sheet === "warm-intake"
                  ? getCase("warm-intake")?.title
                  : cards.find((c) => c.id === sheet)?.label}
              </span>
              <button
                type="button"
                className="text-[14px] text-graphite"
                aria-label={LABELS.window.close}
                onClick={() => setSheet(null)}
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {sheet === "work" && <WorkFolderBody />}
              {sheet === "experiments" && <ExperimentsFolderBody />}
              {sheet === "about" && <AboutBody />}
              {sheet === "warm-intake" && <CaseBody slug="warm-intake" />}
            </div>
            {sheet === "warm-intake" && (
              <div className="border-t border-graphite/10 p-3">
                <button
                  type="button"
                  className="w-full rounded-md bg-stamp px-4 py-3 text-[14px] font-medium text-paper"
                  onClick={() => {
                    openDeskObject("warm-intake");
                    setSheet(null);
                  }}
                >
                  {LABELS.mobile.sendToInterview}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
