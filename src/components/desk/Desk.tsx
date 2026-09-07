"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { DeskObjects, ProjectFile } from "@/components/desk/DeskObjects";
import { InterviewTray } from "@/components/desk/InterviewTray";
import { PaperWindow } from "@/components/desk/PaperWindow";
import { MobileDesk } from "@/components/desk/MobileDesk";
import { DeskSurface } from "@/components/desk/DeskSurface";
import {
  AboutBody,
  WorkFolderBody,
  ExperimentsFolderBody,
  CaseBody,
} from "@/components/case/WindowBodies";
import { useWindowStore } from "@/store/windowStore";
import { useTrayStore } from "@/store/trayStore";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return Boolean(target.closest("[contenteditable='true']"));
}

function WindowLayer() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <>
      {windows.map((win) => {
        if (win.phase === "minimized" || win.phase === "closed") return null;
        let body = null;
        if (win.kind === "about" || win.id === "about") body = <AboutBody />;
        else if (win.id === "work") body = <WorkFolderBody />;
        else if (win.id === "experiments") body = <ExperimentsFolderBody />;
        else if (win.kind === "case" || win.slug)
          body = <CaseBody slug={win.slug ?? win.id} />;

        return (
          <PaperWindow key={win.id} win={win}>
            {body}
          </PaperWindow>
        );
      })}
    </>
  );
}

function DesktopDesk() {
  const searchParams = useSearchParams();
  const openBySlug = useWindowStore((s) => s.openBySlug);
  const closeFocused = useWindowStore((s) => s.closeFocused);
  const cycleFocus = useWindowStore((s) => s.cycleFocus);
  const setTrayPhase = useTrayStore((s) => s.setPhase);
  const accept = useTrayStore((s) => s.accept);
  const shake = useTrayStore((s) => s.shake);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    const open = searchParams.get("open");
    if (open) openBySlug(open);
  }, [searchParams, openBySlug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeFocused();
        return;
      }

      // ⌘W / Ctrl+W — close focused when not typing
      if ((e.key === "w" || e.key === "W") && (e.metaKey || e.ctrlKey)) {
        if (isTypingTarget(e.target)) return;
        e.preventDefault();
        closeFocused();
        return;
      }

      // Tab / Shift+Tab — cycle focus among open non-minimized windows
      if (e.key === "Tab") {
        if (isTypingTarget(e.target)) return;
        const openCount = useWindowStore
          .getState()
          .windows.filter(
            (w) =>
              w.phase === "open" ||
              w.phase === "focused" ||
              w.phase === "opening"
          ).length;
        if (openCount === 0) return;
        e.preventDefault();
        cycleFocus(e.shiftKey ? -1 : 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeFocused, cycleFocus]);

  const onDragStart = useCallback(
    (e: DragStartEvent) => {
      const type = e.active.data.current?.type;
      if (type === "project-file") setTrayPhase("hover");
    },
    [setTrayPhase]
  );

  const onDragOver = useCallback(
    (e: DragOverEvent) => {
      const type = e.active.data.current?.type;
      if (type !== "project-file") return;
      if (e.over?.id === "interview-tray") setTrayPhase("armed");
      else setTrayPhase("hover");
    },
    [setTrayPhase]
  );

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const type = e.active.data.current?.type;
      const slug = e.active.data.current?.slug as string | undefined;
      if (type !== "project-file") {
        setTrayPhase("idle");
        return;
      }
      if (e.over?.id === "interview-tray" && slug) {
        accept();
        openBySlug(slug);
        // Deep-link for shareability
        const url = new URL(window.location.href);
        url.searchParams.set("open", slug);
        window.history.replaceState({}, "", url.toString());
      } else if (e.over?.id === "interview-tray") {
        shake();
      } else {
        setTrayPhase("idle");
      }
    },
    [accept, openBySlug, setTrayPhase, shake]
  );

  const onDragCancel = useCallback(() => setTrayPhase("idle"), [setTrayPhase]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <DeskSurface className="hidden h-[100dvh] w-full overflow-hidden md:block">
        <div className="relative z-[2] h-full w-full">
          <DeskObjects />
          <InterviewTray />
          <WindowLayer />
        </div>
      </DeskSurface>
      <DragOverlay>
        <div className="pointer-events-none opacity-90">
          <ProjectFile style={{ position: "relative", left: 0, top: 0 }} />
        </div>
      </DragOverlay>
    </DndContext>
  );
}

export function Desk() {
  return (
    <>
      <MobileDesk />
      <DesktopDesk />
    </>
  );
}
