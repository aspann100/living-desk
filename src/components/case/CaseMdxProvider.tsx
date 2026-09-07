"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

const CaseMdxContext = createContext<Record<string, MDXRemoteSerializeResult>>(
  {}
);

export function CaseMdxProvider({
  sources,
  children,
}: {
  sources: Record<string, MDXRemoteSerializeResult>;
  children: ReactNode;
}) {
  return (
    <CaseMdxContext.Provider value={sources}>{children}</CaseMdxContext.Provider>
  );
}

export function useCaseMdxSource(
  slug: string
): MDXRemoteSerializeResult | undefined {
  return useContext(CaseMdxContext)[slug];
}
