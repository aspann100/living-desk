import { Suspense } from "react";
import { Desk } from "@/components/desk/Desk";
import { HydrationGate } from "@/components/desk/HydrationGate";
import { CaseMdxProvider } from "@/components/case/CaseMdxProvider";
import { loadAllCaseMdxSources } from "@/lib/loadCaseMdx";

export default async function Home() {
  const caseMdxSources = await loadAllCaseMdxSources();

  return (
    <CaseMdxProvider sources={caseMdxSources}>
      <HydrationGate fallback={<div className="os-root min-h-[100dvh]" />}>
        <Suspense fallback={<div className="os-root min-h-[100dvh]" />}>
          <Desk />
        </Suspense>
      </HydrationGate>
    </CaseMdxProvider>
  );
}
