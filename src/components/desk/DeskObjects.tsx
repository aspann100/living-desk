"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { LABELS } from "@/lib/labels";
import { openDeskObject } from "@/store/windowStore";

export function FolderObject({
  id,
  label,
  style,
}: {
  id: string;
  label: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      className="group absolute z-[2] flex w-[88px] flex-col items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring"
      style={style}
      onClick={() => openDeskObject(id)}
      aria-label={label}
    >
      <div className="relative h-[72px] w-[80px] transition-transform group-hover:-translate-y-0.5">
        <div
          className="absolute left-1 top-0 h-3 w-10 rounded-t-sm bg-folder"
          style={{
            background: "#efe6d6",
            boxShadow:
              "inset 0 1px 0 rgb(255 255 255 / 65%), inset 0 0 0 1.5px color-mix(in srgb, var(--graphite) 65%, transparent)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 top-2 rounded-sm bg-folder"
          style={{
            background: "#efe6d6",
            boxShadow:
              "var(--shadow-contact), inset 0 1px 0 rgb(255 255 255 / 65%), inset 0 0 0 1.75px color-mix(in srgb, var(--graphite) 65%, transparent)",
          }}
        />
        <div className="absolute inset-x-2 bottom-2 top-5 rounded-[2px] bg-paper-raised/45" />
      </div>
      <span className="max-w-[96px] truncate text-center text-[13px] font-medium text-ink">
        {label}
      </span>
    </button>
  );
}

export function ProjectFile({
  id = "warm-intake",
  style,
}: {
  id?: string;
  style?: React.CSSProperties;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `file:${id}`,
    data: { type: "project-file", slug: id },
  });

  const dragStyle = {
    ...style,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.85 : 1,
    zIndex: isDragging ? 50 : 2,
  };

  return (
    <button
      ref={setNodeRef}
      type="button"
      className="absolute flex w-[100px] flex-col items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring"
      style={dragStyle}
      onDoubleClick={() => openDeskObject(id)}
      onClick={() => openDeskObject(id)}
      aria-label="Warm Intake"
      {...listeners}
      {...attributes}
    >
      <div
        className="relative h-[88px] w-[72px] bg-paper"
        style={{
          boxShadow: "var(--shadow-contact)",
          border: "1px solid color-mix(in srgb, var(--graphite) 18%, transparent)",
        }}
      >
        {/* Stamp-red tab */}
        <div
          className="absolute -left-px top-3 h-5 w-[7px] rounded-r-[1px]"
          style={{ background: "var(--stamp-red)" }}
          aria-hidden
        />
        {/* Folded corner */}
        <div
          className="absolute right-0 top-0 h-4 w-4 bg-folder"
          style={{
            clipPath: "polygon(0 0, 100% 100%, 0 100%)",
            transform: "rotate(180deg)",
            boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--graphite) 20%, transparent)",
          }}
        />
        <div className="absolute inset-x-2 top-5 space-y-1.5">
          <div className="h-1 rounded bg-ink/15" />
          <div className="h-1 w-[80%] rounded bg-ink/10" />
          <div className="h-1 w-[60%] rounded bg-ink/10" />
        </div>
      </div>
      <span className="max-w-[110px] text-center text-[12px] font-medium leading-tight text-ink">
        Warm Intake
      </span>
    </button>
  );
}

export function StickyNote({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      className="absolute z-[2] flex h-[96px] w-[120px] items-center justify-center bg-sticky p-3 text-center"
      style={{
        ...style,
        background: "#f5e6c8",
        transform: `${style?.transform ?? ""} rotate(-2deg)`.trim(),
        boxShadow: "var(--shadow-contact)",
      }}
      aria-label={LABELS.sticky}
    >
      <p className="font-hand text-[18px] leading-snug text-graphite">
        {LABELS.sticky}
      </p>
    </div>
  );
}

export function DeskObjects() {
  return (
    <>
      {/* Idle composition: stagger so Work/ + Experiments/ aren't buried under About */}
      <FolderObject id="work" label={LABELS.folders.work} style={{ left: "10%", top: "20%" }} />
      <FolderObject
        id="experiments"
        label={LABELS.folders.experiments}
        style={{ left: "26%", top: "42%" }}
      />
      <FolderObject id="about" label={LABELS.folders.about} style={{ left: "44%", top: "18%" }} />
      <ProjectFile style={{ left: "64%", top: "30%" }} />
      <StickyNote style={{ left: "74%", top: "54%" }} />
    </>
  );
}
