"use client";

import { useMemo } from "react";
import { useCaisseStore } from "@/stores/caisseStore";
import { useResumeJour } from "@/features/caisse/query/caisse-queries";

export function useCaisse() {
  const sessionActive = useCaisseStore((state) => state.sessionActive);
  const soldeLocal = useCaisseStore((state) => state.soldeLocal);
  const transactionsLive = useCaisseStore((state) => state.transactionsLive);
  const resumeJour = useResumeJour();

  return useMemo(
    () => ({
      sessionActive,
      soldeLocal,
      transactionsLive,
      resumeJour,
    }),
    [sessionActive, soldeLocal, transactionsLive, resumeJour]
  );
}
