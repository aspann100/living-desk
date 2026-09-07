import Link from "next/link";
import { notFound } from "next/navigation";
import { getCase, CASES } from "@/lib/cases";
import { LABELS } from "@/lib/labels";

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getCase(slug);
  if (!meta) return { title: "Case" };
  return {
    title: `${meta.title} · Living Desk`,
    description: meta.summary,
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getCase(slug);
  if (!meta) notFound();

  return (
    <main className="min-h-[100dvh] overflow-y-auto desk-wash">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Link
          href={`/?open=${slug}`}
          className="text-[13px] text-ink-muted hover:text-ink"
        >
          ← Back to desk
        </Link>

        <article
          className="case-prose mt-6 rounded-md bg-paper p-6 sm:p-8"
          style={{
            boxShadow: "var(--shadow-paper)",
            border: "1px solid color-mix(in srgb, var(--graphite) 14%, transparent)",
          }}
        >
          <header className="mb-6 border-b border-graphite/10 pb-4">
            <h1 className="font-display text-[28px] text-ink">{meta.title}</h1>
            <p className="mt-2 font-serif text-[17px] leading-[1.55] text-ink-muted">
              {meta.summary}
            </p>
            <p className="mt-3 text-[13px] text-graphite-soft">
              {meta.year} · {meta.role}
            </p>
          </header>

          <h2>Problem</h2>
          <p>
            Hiring flows often feel like forms — cold, linear, forgettable. Candidates jump
            through fields while the story of the work stays buried. We needed an intake that
            felt like sitting down at a desk: warm paper, clear folders, and a path into the
            work itself.
          </p>

          <h2>Approach</h2>
          <p>
            Treat the portfolio as a physical desk. Folders open into paper windows. A project
            file can be dropped into an Interview tray to become a guided walkthrough. Motion
            stays springy and brief; chrome stays graphite — never traffic-light kitsch. Copy
            stays short and human.
          </p>
          {/* TODO(amazon): Aj-approved Amazon case notes only */}

          <h2>Outcome</h2>
          <p>
            A desk that opens with oak wash and grain, where Work/, Experiments/, and About/
            are real objects. Warm Intake opens as a case window; dropping it on the Interview
            tray starts the walkthrough. On mobile, folders become full-screen sheets with a
            sticky Send to Interview CTA — not a shrunk desktop.
          </p>
          {/* TODO(aj-disclosure): Aj-approved wording only */}

          <p className="!mt-8 !text-[13px] !text-ink-muted">{LABELS.contact}</p>
        </article>
      </div>
    </main>
  );
}
