export type CaseMeta = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  role: string;
};

export const CASES: CaseMeta[] = [
  {
    slug: "warm-intake",
    title: "Warm Intake",
    summary: "A hiring flow that feels like a desk, not a form.",
    year: "2026",
    role: "Design + build",
  },
];

export function getCase(slug: string): CaseMeta | undefined {
  return CASES.find((c) => c.slug === slug);
}
