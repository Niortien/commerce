"use client";

import { useEffect } from "react";
import { Button, useDisclosure } from "@heroui/react";
import { IconCashRegister, IconFlag, IconReceipt2, IconWallet } from "@tabler/icons-react";
import { CountUp } from "@/components/common/CountUp";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { FeedDensityToggle } from "@/components/common/FeedDensityToggle";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { StatTile } from "@/components/common/StatTile";
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
  const modes = Object.entries(resume?.parModePaiement ?? {});

  return (
    <PageWrapper>
      <SessionGuard>
        <PageHero
          tone="cash"
          icon={IconCashRegister}
          eyebrow="Session en cours"
          title="Caisse"
          description="Les ventes de l'équipe arrivent ici en direct. Clôturez la journée quand la caisse est comptée."
          actions={
            <Button
              className="min-h-11 bg-cash font-semibold text-white"
              startContent={!closeSession.isPending && <IconFlag size={18} aria-hidden />}
              isDisabled={!sessionId || closeSession.isPending}
              isLoading={closeSession.isPending}
              onPress={onOpen}
            >
              Terminer la journée
            </Button>
          }
        >
          <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="rounded-lg border border-border bg-surface/80 p-4 backdrop-blur-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Recettes du jour</p>
              <CurrencyDisplay
                montant={resume?.totalVentes ?? "0"}
                size="xl"
                tone="cash"
                className="mt-1 block font-display text-4xl font-extrabold md:text-5xl"
              />
              <p className="mt-1 text-xs text-text-muted">
                <CountUp value={resume?.totalTransactions ?? 0} className="font-semibold text-text" /> transaction
                {(resume?.totalTransactions ?? 0) > 1 ? "s" : ""} aujourd&apos;hui
              </p>
            </div>
            <div className="grid gap-3">
              <StatTile
                tone="cash"
                icon={IconWallet}
                label="Montant à déposer"
                value={<CurrencyDisplay montant={resume?.montantADeposer ?? "0"} size="md" className="font-display text-xl font-extrabold" />}
                delay={0.05}
              />
              <StatTile
                tone="in"
                icon={IconReceipt2}
                label="Bénéfice net"
                value={<CurrencyDisplay montant={resume?.beneficeNet ?? "0"} size="md" className="font-display text-xl font-extrabold" />}
                delay={0.1}
              />
            </div>
          </div>
        </PageHero>

        {modes.length > 0 && (
          <ul aria-label="Recettes par mode de paiement" className="flex flex-wrap gap-2">
            {modes.map(([mode, montant]) => (
              <li
                key={mode}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs"
              >
                <span aria-hidden className="h-2 w-2 rounded-full bg-cash" />
                <span className="font-medium text-text-muted">{mode}</span>
                <CurrencyDisplay montant={String(montant)} size="sm" className="font-semibold" />
              </li>
            ))}
          </ul>
        )}

        <section aria-label="Transactions en direct" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-text">
              <span className="relative flex h-2.5 w-2.5">
                <span aria-hidden className="live-ping absolute inset-0 rounded-full bg-in" />
                <span aria-hidden className="relative h-2.5 w-2.5 rounded-full bg-in" />
              </span>
              En direct
            </h2>
            <FeedDensityToggle />
          </div>
          <CaisseStream transactions={transactionsLive} density={density} />
        </section>

        {resume ? <CaisseSummaryBar resume={resume} /> : null}
      </SessionGuard>

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
