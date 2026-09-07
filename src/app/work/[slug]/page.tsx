import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getCase, CASES } from "@/lib/cases";
import { LABELS } from "@/lib/labels";
import { readCaseFile } from "@/lib/loadCaseMdx";

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

  let content: string;
  try {
    content = readCaseFile(slug).content;
  } catch {
    notFound();
  }

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

          <MDXRemote source={content} />

          <p className="!mt-8 !text-[13px] !text-ink-muted">{LABELS.contact}</p>
        </article>
      </div>
    </main>
  );
}
