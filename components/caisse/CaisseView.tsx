"use client";

import { Chip, useDisclosure } from "@heroui/react";
import { useEffect } from "react";
import { Button } from "@heroui/react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { FeedDensityToggle } from "@/components/common/FeedDensityToggle";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useCaisse } from "@/hooks/useCaisse";
import { useActiveSession } from "@/features/caisse/query/caisse-queries";
import { useCaisseSocket, useFermerSession } from "@/features/caisse/mutation/caisse-mutations";
import { useUiStore } from "@/stores/uiStore";
import { CaisseCloseModal } from "./CaisseCloseModal";
import { CaisseStream } from "./CaisseStream";
import { CaisseSummaryBar } from "./CaisseSummaryBar";
import { SessionGuard } from "./SessionGuard";
import { SessionsList } from "./SessionsList";

export function CaisseView() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const density = useUiStore((state) => state.feedDensity);
  const { transactionsLive, resumeJour } = useCaisse();
  const { data: activeSessionData } = useActiveSession();
  const sessionId = activeSessionData?.data?.id ?? null;
  const { connect, disconnect } = useCaisseSocket();
  const closeSession = useFermerSession();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const resume = resumeJour.data?.data;

  return (
    <PageWrapper>
      {/* Caisse active */}
      <SessionGuard>
        {/* Header recettes + bouton terminer */}
        <div className="rounded-xl border border-border/80 bg-[linear-gradient(145deg,rgba(143,126,245,0.18),rgba(74,122,255,0.10))] p-4 md:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-text-muted">Recettes du jour</p>
                <CurrencyDisplay montant={resume?.totalVentes ?? "0"} size="xl" tone="accent" className="mt-2" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-text-muted">Montant à déposer</p>
                <CurrencyDisplay montant={resume?.montantADeposer ?? "0"} size="xl" tone="cash" className="mt-2" />
              </div>
            </div>
            <Button
              size="sm"
              variant="flat"
              className="w-full sm:w-auto shrink-0 border border-out/40 bg-out/10 text-out"
              isDisabled={!sessionId || closeSession.isPending}
              isLoading={closeSession.isPending}
              onPress={onOpen}
            >
              🔒 Terminer la journée
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(resume?.parModePaiement ?? {}).map(([mode, montant]) => (
            <Chip
              key={mode}
              variant="flat"
              className="border border-border/70 bg-[color:rgba(45,69,103,0.55)] text-text"
            >
              {mode}: {montant}
            </Chip>
          ))}
        </div>

        <FeedDensityToggle />
        <CaisseStream transactions={transactionsLive} density={density} />
        {resume ? <CaisseSummaryBar resume={resume} /> : null}
      </SessionGuard>

      {/* Séparateur */}
      <div className="border-t border-border/50" />

      {/* Historique */}
      <SessionsList />

      <CaisseCloseModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={() => {
          if (sessionId) {
            closeSession.mutate({ id: sessionId, montantFermeture: "0" });
          }
          onClose();
        }}
      />
    </PageWrapper>
  );
}
