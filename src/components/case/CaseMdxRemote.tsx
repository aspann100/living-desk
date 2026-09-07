"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

/** Client renderer for pre-serialized case MDX (desk CaseBody). */
export function CaseMdxRemote({
  source,
}: {
  source: MDXRemoteSerializeResult;
}) {
  return <MDXRemote {...source} />;
}
