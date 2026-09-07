import { Suspense } from "react";
import { Desk } from "@/components/desk/Desk";
import { HydrationGate } from "@/components/desk/HydrationGate";

export default function Home() {
  return (
    <HydrationGate fallback={<div className="min-h-[100dvh] desk-wash desk-grain" />}>
      <Suspense fallback={<div className="min-h-[100dvh] desk-wash" />}>
        <Desk />
      </Suspense>
    </HydrationGate>
  );
}
