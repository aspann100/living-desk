"use client";

import Link from "next/link";
import { LABELS } from "@/lib/labels";
import { getCase } from "@/lib/cases";
import { openDeskObject } from "@/store/windowStore";
import { CaseMdxRemote } from "@/components/case/CaseMdxRemote";
import { useCaseMdxSource } from "@/components/case/CaseMdxProvider";

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
    </div>
  );
}

export function WorkFolderBody({
  onOpenCase,
}: {
  /** Mobile sheet: switch to case without leaving `/`. */
  onOpenCase?: (slug: string) => void;
}) {
  const c = getCase("warm-intake")!;
  return (
    <div className="space-y-3">
      <p className="text-[13px] text-ink-muted">Projects on this desk</p>
      <button
        type="button"
        onClick={() => {
          openDeskObject("warm-intake");
          onOpenCase?.("warm-intake");
        }}
        className="block w-full rounded-md border border-graphite/10 bg-paper-raised px-3 py-3 text-left transition hover:border-stamp/30"
      >
        <p className="font-display text-[18px] text-ink">{c.title}</p>
        <p className="mt-1 font-serif text-[15px] leading-snug text-ink-muted">{c.summary}</p>
        <p className="mt-2 text-[12px] text-graphite-soft">
          {c.year} · {c.role}
        </p>
      </button>
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
  const mdxSource = useCaseMdxSource(slug);
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
      {mdxSource ? (
        <CaseMdxRemote source={mdxSource} />
      ) : (
        <p className="text-ink-muted">Loading case…</p>
      )}
      <p className="!mt-4 !text-[13px] !text-ink-muted">{LABELS.contact}</p>
      <p className="mt-4 text-[13px]">
        <Link href={`/work/${slug}`} className="text-stamp underline-offset-2 hover:underline">
          Open full case →
        </Link>
      </p>
    </article>
  );
}
