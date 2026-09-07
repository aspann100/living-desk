import type { ReactNode } from "react";

/** Art pack v1 desk plane: plate + grain / lamp-wash / scuff overlays. */
export function DeskSurface({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={["desk-root", className].filter(Boolean).join(" ")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="desk-plate"
        src="/desk/living-desk-plate-v1.png"
        alt=""
        draggable={false}
      />
      <div className="desk-overlay grain" aria-hidden />
      <div className="desk-overlay lamp-wash" aria-hidden />
      <div className="desk-overlay scuffs" aria-hidden />
      {children}
    </div>
  );
}
