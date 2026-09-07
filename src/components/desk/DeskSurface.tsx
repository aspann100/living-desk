import type { ReactNode } from "react";

/** Art pack v2 OS desktop surface: wallpaper + icons/windows/tray. */
export function DeskSurface({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={["os-root", className].filter(Boolean).join(" ")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="os-wallpaper"
        src="/desktop/living-os-wallpaper-v2.png"
        alt=""
        draggable={false}
      />
      {children}
    </div>
  );
}
