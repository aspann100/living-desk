export const spring = { type: "spring" as const, stiffness: 180, damping: 22 };

export const windowOpen = {
  initial: { opacity: 0, scale: 0.96, y: 6 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 6 },
  transition: { ...spring, duration: 0.28 },
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
