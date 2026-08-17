"use client";

import { Skeleton } from "@heroui/react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";

interface ActiviteKpiCardsProps {
  totalVentes: number;
  totalTransactions: number;
  cashIn: number;
  cashOut: number;
  valeurStock: number;
  nbAlertes: number;
  totalDepenses: number;
  nombreDepenses: number;
  isLoading: boolean;
}

interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  accent: string;
  sub?: string;
  isLoading: boolean;
}

function KpiCard({ label, value, accent, sub, isLoading }: KpiCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border/60 bg-[var(--color-surface)] p-4 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-xl before:content-[''] ${accent}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{label}</p>
      <div className="mt-2 min-h-[2rem]">
        {isLoading ? (
          <Skeleton className="h-7 w-28 rounded-lg" />
        ) : (
          <div className="text-xl font-bold text-text">{value}</div>
        )}
      </div>
      {sub && !isLoading && (
        <p className="mt-1 text-[11px] text-text-dim">{sub}</p>
      )}
    </div>
  );
}

export function ActiviteKpiCards({
  totalVentes,
  totalTransactions,
  cashIn,
  cashOut,
  valeurStock,
  nbAlertes,
  totalDepenses,
  nombreDepenses,
  isLoading,
}: ActiviteKpiCardsProps) {
  const benefice = cashIn - cashOut;
  const beneficePositif = benefice >= 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      <KpiCard
        label="Ventes"
        value={<CurrencyDisplay montant={String(totalVentes)} tone="cash" size="sm" />}
        accent="before:bg-[var(--color-cash)]"
        sub={`${totalTransactions} transaction${totalTransactions !== 1 ? "s" : ""}`}
        isLoading={isLoading}
      />
      <KpiCard
        label="Transactions"
        value={<span className="font-[var(--font-mono)] text-accent">{totalTransactions}</span>}
        accent="before:bg-accent"
        isLoading={isLoading}
      />
      <KpiCard
        label="Cash entrant"
        value={<CurrencyDisplay montant={String(cashIn)} tone="in" size="sm" />}
        accent="before:bg-[var(--color-in)]"
        isLoading={isLoading}
      />
      <KpiCard
        label="Cash sortant"
        value={<CurrencyDisplay montant={String(cashOut)} tone="out" size="sm" />}
        accent="before:bg-[var(--color-out)]"
        isLoading={isLoading}
      />
      <KpiCard
        label="Bénéfice net"
        value={
          <CurrencyDisplay
            montant={String(Math.abs(benefice))}
            tone={beneficePositif ? "in" : "out"}
            size="sm"
          />
        }
        accent={beneficePositif ? "before:bg-[var(--color-in)]" : "before:bg-[var(--color-out)]"}
        sub={beneficePositif ? "Positif" : "Déficit"}
        isLoading={isLoading}
      />
      <KpiCard
        label="Valeur stock"
        value={<CurrencyDisplay montant={String(valeurStock)} tone="default" size="sm" />}
        accent="before:bg-[var(--color-border-active)]"
        sub={nbAlertes > 0 ? `⚠ ${nbAlertes} alerte${nbAlertes !== 1 ? "s" : ""}` : "Aucune alerte"}
        isLoading={isLoading}
      />
      <KpiCard
        label="Dépenses"
        value={<CurrencyDisplay montant={String(totalDepenses)} tone="out" size="sm" />}
        accent="before:bg-[var(--color-out)]"
        sub={`${nombreDepenses} dépense${nombreDepenses !== 1 ? "s" : ""}`}
        isLoading={isLoading}
      />
    </div>
  );
}
