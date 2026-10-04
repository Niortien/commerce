"use client";

import type { ReactNode } from "react";
import { Skeleton } from "@heroui/react";
import {
  IconAlertTriangle,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconBoxSeam,
  IconCoin,
  IconReceipt2,
  IconReportMoney,
  IconTrendingDown,
  IconTrendingUp,
  type Icon,
} from "@tabler/icons-react";
import { CountUp } from "@/components/common/CountUp";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import type { Tone } from "@/components/common/tone";

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
  value: ReactNode;
  tone: Tone;
  icon: Icon;
  sub?: string;
  isLoading: boolean;
}

function KpiCard({ label, value, tone, icon: Icon, sub, isLoading }: KpiCardProps) {
  return (
    <SpotlightCard tone={tone} className="p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</p>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--tone)_14%,transparent)] text-[var(--tone-text)]">
          <Icon size={16} aria-hidden />
        </span>
      </div>
      <div className="mt-2 min-h-[2rem]">
        {isLoading ? <Skeleton className="h-7 w-28 rounded-lg" /> : <div className="text-xl font-bold text-text">{value}</div>}
      </div>
      {sub && !isLoading && <p className="mt-1 text-xs text-text-muted">{sub}</p>}
    </SpotlightCard>
  );
}

const amount = "font-display font-extrabold tabular-nums";

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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      <KpiCard
        label="Ventes"
        icon={IconCoin}
        tone="cash"
        value={<CurrencyDisplay montant={String(totalVentes)} tone="cash" size="lg" className={amount} />}
        sub={`${totalTransactions} transaction${totalTransactions !== 1 ? "s" : ""}`}
        isLoading={isLoading}
      />
      <KpiCard
        label="Transactions"
        icon={IconReceipt2}
        tone="accent"
        value={<CountUp value={totalTransactions} className="font-display text-2xl font-extrabold text-accent-text" />}
        isLoading={isLoading}
      />
      <KpiCard
        label="Cash entrant"
        icon={IconArrowDownLeft}
        tone="in"
        value={<CurrencyDisplay montant={String(cashIn)} tone="in" size="lg" className={amount} />}
        isLoading={isLoading}
      />
      <KpiCard
        label="Cash sortant"
        icon={IconArrowUpRight}
        tone="out"
        value={<CurrencyDisplay montant={String(cashOut)} tone="out" size="lg" className={amount} />}
        isLoading={isLoading}
      />
      <KpiCard
        label={beneficePositif ? "Bénéfice net" : "Déficit"}
        icon={beneficePositif ? IconTrendingUp : IconTrendingDown}
        tone={beneficePositif ? "in" : "out"}
        value={<CurrencyDisplay montant={String(Math.abs(benefice))} tone={beneficePositif ? "in" : "out"} size="lg" className={amount} />}
        sub={beneficePositif ? "Entrées − sorties de cash" : "Plus de sorties que d'entrées"}
        isLoading={isLoading}
      />
      <KpiCard
        label="Valeur du stock"
        icon={IconBoxSeam}
        tone="accent"
        value={<CurrencyDisplay montant={String(valeurStock)} size="lg" className={amount} />}
        sub={nbAlertes > 0 ? `${nbAlertes} alerte${nbAlertes !== 1 ? "s" : ""} de stock` : "Aucune alerte"}
        isLoading={isLoading}
      />
      <KpiCard
        label="Dépenses"
        icon={IconReportMoney}
        tone="return"
        value={<CurrencyDisplay montant={String(totalDepenses)} tone="return" size="lg" className={amount} />}
        sub={`${nombreDepenses} dépense${nombreDepenses !== 1 ? "s" : ""}`}
        isLoading={isLoading}
      />
      <KpiCard
        label="Alertes stock"
        icon={IconAlertTriangle}
        tone={nbAlertes > 0 ? "out" : "in"}
        value={<CountUp value={nbAlertes} className={`font-display text-2xl font-extrabold ${nbAlertes > 0 ? "text-out-text" : "text-in-text"}`} />}
        sub={nbAlertes > 0 ? "À réapprovisionner" : "Tout est en ordre"}
        isLoading={isLoading}
      />
    </div>
  );
}
