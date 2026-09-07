"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { LABELS } from "@/lib/labels";
import { openDeskObject } from "@/store/windowStore";

const iconOutline =
  "inset 0 1px 0 rgb(255 255 255 / 70%), inset 0 0 0 1.5px color-mix(in srgb, var(--os-graphite) 70%, transparent)";

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
        {/* App/folder tile — tabbed cream (distinct from document sheet) */}
        <div
          className="absolute left-1 top-0 h-3.5 w-11 rounded-t-sm"
          style={{
            background: "var(--folder-cream)",
            boxShadow: iconOutline,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 top-2.5 rounded-sm"
          style={{
            background: "var(--folder-cream)",
            boxShadow: `var(--os-shadow-icon), ${iconOutline}`,
          }}
        />
        {/* Inner pocket cue */}
        <div
          className="absolute inset-x-2 bottom-2.5 top-6 rounded-[2px]"
          style={{
            background: "color-mix(in srgb, var(--os-panel-raised) 70%, transparent)",
            borderTop: "1px solid color-mix(in srgb, var(--os-graphite) 12%, transparent)",
          }}
        />
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
      {/* Document app icon — taller paper sheet (not a cream folder tile) */}
      <div
        className="relative h-[92px] w-[64px] rounded-[2px]"
        style={{
          background: "var(--os-panel-raised)",
          boxShadow: "var(--os-shadow-icon)",
          border: "1.5px solid color-mix(in srgb, var(--os-graphite) 55%, transparent)",
        }}
      >
        {/* Stamp-red accent tab */}
        <div
          className="absolute -left-px top-3 h-6 w-[8px] rounded-r-[1px]"
          style={{ background: "var(--os-accent)" }}
          aria-hidden
        />
        {/* Folded corner — document dog-ear */}
        <div
          className="absolute right-0 top-0 h-5 w-5"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, color-mix(in srgb, var(--os-desktop-deep) 80%, white) 50%)",
            boxShadow: "inset 1px -1px 0 color-mix(in srgb, var(--os-graphite) 25%, transparent)",
          }}
        />
        <div className="absolute inset-x-2.5 top-7 space-y-1.5">
          <div className="h-[3px] rounded-sm bg-ink/20" />
          <div className="h-[3px] w-[85%] rounded-sm bg-ink/14" />
          <div className="h-[3px] w-[70%] rounded-sm bg-ink/14" />
          <div className="h-[3px] w-[55%] rounded-sm bg-ink/10" />
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
      className="absolute z-[2] flex h-[96px] w-[120px] items-center justify-center p-3 text-center"
      style={{
        ...style,
        background: "var(--sticky-manila)",
        transform: `${style?.transform ?? ""} rotate(-2deg)`.trim(),
        boxShadow: "var(--os-shadow-icon)",
        border: "1px solid color-mix(in srgb, var(--os-graphite) 22%, transparent)",
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
