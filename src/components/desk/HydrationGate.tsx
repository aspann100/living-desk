"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Avoid Zustand persist hydration mismatch on first paint */
export function HydrationGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <>{fallback ?? null}</>;
  return <>{children}</>;
}
