"use client";

import Link from "next/link";
import { LABELS } from "@/lib/labels";
import { getCase } from "@/lib/cases";

export function AboutBody() {
  return (
    <div className="space-y-4">
      <p className="font-serif text-[17px] leading-[1.55] text-ink">{LABELS.about.body}</p>
      <div className="flex items-center gap-3 rounded-md border border-graphite/10 bg-folder/60 px-3 py-2">
        <span className="flex h-9 w-9 items-center justify-center rounded bg-paper text-[11px] font-medium text-ink-muted">
          PDF
        </span>
        <span className="text-[13px] text-ink">{LABELS.about.resume}</span>
      </div>
      <p className="text-[13px] leading-relaxed text-ink-muted">{LABELS.contact}</p>
      {/* TODO(aj-disclosure): Aj-approved wording only */}
    </div>
  );
}

export function WorkFolderBody() {
  const c = getCase("warm-intake")!;
  return (
    <div className="space-y-3">
      <p className="text-[13px] text-ink-muted">Projects on this desk</p>
      <Link
        href="/work/warm-intake"
        className="block rounded-md border border-graphite/10 bg-paper-raised px-3 py-3 transition hover:border-stamp/30"
      >
        <p className="font-display text-[18px] text-ink">{c.title}</p>
        <p className="mt-1 font-serif text-[15px] leading-snug text-ink-muted">{c.summary}</p>
        <p className="mt-2 text-[12px] text-graphite-soft">
          {c.year} · {c.role}
        </p>
      </Link>
    </div>
  );
}

export function ExperimentsFolderBody() {
  return (
    <div className="space-y-2">
      <p className="font-serif text-[17px] leading-[1.55] text-ink">
        Small experiments live here. More soon.
      </p>
      <p className="text-[13px] text-ink-muted">Empty for v0 — by design.</p>
    </div>
  );
}

export function CaseBody({ slug }: { slug: string }) {
  const meta = getCase(slug);
  if (!meta) {
    return <p className="text-ink-muted">Case not found.</p>;
  }
  return (
    <article className="case-prose">
      <header className="mb-4 border-b border-graphite/10 pb-3">
        <h1 className="font-display text-[22px] text-ink">{meta.title}</h1>
        <p className="mt-1 font-serif text-[16px] leading-snug text-ink-muted">{meta.summary}</p>
        <p className="mt-2 text-[12px] text-graphite-soft">
          {meta.year} · {meta.role}
        </p>
      </header>
      <WarmIntakeInline />
      <p className="mt-4 text-[13px]">
        <Link href={`/work/${slug}`} className="text-stamp underline-offset-2 hover:underline">
          Open full case →
        </Link>
      </p>
    </article>
  );
}

function WarmIntakeInline() {
  return (
    <>
      <h2>Problem</h2>
      <p>
        Hiring flows often feel like forms — cold, linear, forgettable. Candidates jump through
        fields while the story of the work stays buried. We needed an intake that felt like sitting
        down at a desk: warm paper, clear folders, and a path into the work itself.
      </p>
      <h2>Approach</h2>
      <p>
        Treat the portfolio as a physical desk. Folders open into paper windows. A project file can
        be dropped into an Interview tray to become a guided walkthrough. Motion stays springy and
        brief; chrome stays graphite — never traffic-light kitsch. Copy stays short and human.
      </p>
      {/* TODO(amazon): Aj-approved Amazon case notes only */}
      <h2>Outcome</h2>
      <p>
        A desk that opens with oak wash and grain, where Work/, Experiments/, and About/ are real
        objects. Warm Intake opens as a case window; dropping it on the Interview tray starts the
        walkthrough. On mobile, folders become full-screen sheets with a sticky Send to Interview
        CTA — not a shrunk desktop.
      </p>
      {/* TODO(aj-disclosure): Aj-approved wording only */}
      <p className="!mt-4 !text-[13px] !text-ink-muted">{LABELS.contact}</p>
    </>
  );
}
