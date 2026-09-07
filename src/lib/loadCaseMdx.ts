import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { CASES } from "@/lib/cases";

export type CaseFrontmatter = {
  title: string;
  summary: string;
  year: string;
  role: string;
};

const CASES_DIR = path.join(process.cwd(), "src/content/cases");

/** Read case MDX from disk — single source of prose (frontmatter + body). */
export function readCaseFile(slug: string): {
  frontmatter: CaseFrontmatter;
  content: string;
} {
  const fullPath = path.join(CASES_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as CaseFrontmatter,
    content,
  };
}

/** Serialize case body for client <MDXRemote /> (desk windows). */
export async function serializeCaseMdx(
  slug: string
): Promise<MDXRemoteSerializeResult> {
  const { content } = readCaseFile(slug);
  return serialize(content);
}

/** Preload all known cases for the desk (serializable props). */
export async function loadAllCaseMdxSources(): Promise<
  Record<string, MDXRemoteSerializeResult>
> {
  const entries = await Promise.all(
    CASES.map(async (c) => [c.slug, await serializeCaseMdx(c.slug)] as const)
  );
  return Object.fromEntries(entries);
}
