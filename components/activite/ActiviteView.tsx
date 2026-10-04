"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Spinner } from "@heroui/react";
import { IconArrowRight, IconChartHistogram } from "@tabler/icons-react";
import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { PeriodFilter } from "@/components/common/PeriodFilter";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { dvToISO, type DateRange } from "@/lib/dateRange";
import { useVentes, useFluxTresorerie, useTopProduits, useStockValeur, useDepenses } from "@/features/rapports/query/rapports-queries";
import { useStockAlertes } from "@/features/stock/query/stock-queries";
import { useResumeJour } from "@/features/caisse/query/caisse-queries";
import { useUiStore, type RapportGroupBy } from "@/stores/uiStore";
import { ActiviteKpiCards } from "./ActiviteKpiCards";
import { ActiviteTopProduits } from "./ActiviteTopProduits";
import { ActivitePaiementBreakdown } from "./ActivitePaiementBreakdown";

const ActiviteFluxChart = dynamic(
  () => import("./ActiviteFluxChart").then((m) => m.ActiviteFluxChart),
  {
    loading: () => (
      <div className="flex h-60 items-center justify-center">
        <Spinner size="sm" />
      </div>
    ),
    ssr: false,
  }
);

const ActiviteVentesChart = dynamic(
  () => import("./ActiviteVentesChart").then((m) => m.ActiviteVentesChart),
  {
    loading: () => (
      <div className="flex h-52 items-center justify-center">
        <Spinner size="sm" />
      </div>
    ),
    ssr: false,
  }
);

const GROUP_BYS: { key: RapportGroupBy; label: string }[] = [
  { key: "jour", label: "Par jour" },
  { key: "semaine", label: "Par semaine" },
  { key: "mois", label: "Par mois" },
];

function formatRange(range: DateRange): string {
  const fmt = (dv: DateValue) =>
    dv.toDate(getLocalTimeZone()).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const s = fmt(range.start);
  const e = fmt(range.end);
  return s === e ? s : `${s} — ${e}`;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4 shadow-card md:p-5">
      <h2 className="mb-4 text-sm font-semibold text-text">{title}</h2>
      {children}
    </section>
  );
}

export function ActiviteView() {
  const activiteGroupBy = useUiStore((s) => s.activiteGroupBy);
  const setActiviteGroupBy = useUiStore((s) => s.setActiviteGroupBy);

  const now = useMemo(() => today(getLocalTimeZone()), []);

  const [dateRange, setDateRange] = useState<DateRange>({ start: now, end: now });

  const params = useMemo(
    () => ({
      dateDebut: dvToISO(dateRange.start, false),
      dateFin: dvToISO(dateRange.end, true),
      groupBy: activiteGroupBy,
    }),
    [dateRange, activiteGroupBy]
  );

  const { data: ventesData, isLoading: ventesLoading } = useVentes(params);
  const { data: fluxData, isLoading: fluxLoading } = useFluxTresorerie(params);
  const { data: topData, isLoading: topLoading } = useTopProduits(params);
  const { data: stockValeur } = useStockValeur();
  const { data: alertes } = useStockAlertes();
  const { data: resume } = useResumeJour();
  const { data: depensesData, isLoading: depensesLoading } = useDepenses(params);

  const ventes = Array.isArray(ventesData?.data) ? ventesData.data : [];
  const flux = Array.isArray(fluxData?.data) ? fluxData.data : [];
  const topProduits = Array.isArray(topData?.data) ? topData.data : [];

  const totalVentes = useMemo(
    () => ventes.reduce((acc, v) => acc + parseFloat(v.totalVentes || "0"), 0),
    [ventes]
  );
  const totalTransactions = useMemo(
    () => ventes.reduce((acc, v) => acc + v.nombreTransactions, 0),
    [ventes]
  );
  const cashIn = useMemo(
    () => flux.reduce((acc, f) => acc + parseFloat(f.sorties || "0"), 0),
    [flux]
  );
  const cashOut = useMemo(
    () => flux.reduce((acc, f) => acc + parseFloat(f.entrees || "0"), 0),
    [flux]
  );
  const valeurStock = parseFloat(stockValeur?.data?.valeurTotaleVente || "0");
  const nbAlertes = alertes?.data?.length ?? 0;
  const totalDepenses = parseFloat(depensesData?.data?.totalDepenses || "0");
  const nombreDepenses = depensesData?.data?.nombreDepenses ?? 0;
  const isKpiLoading = ventesLoading || fluxLoading || depensesLoading;
  const rangeLabel = formatRange(dateRange);

  return (
    <PageWrapper>
      <PageHero
        tone="cash"
        icon={IconChartHistogram}
        eyebrow="Analyse"
        title="Activité"
        description={<span className="font-mono text-xs">{rangeLabel}</span>}
      >
        <div className="flex flex-col gap-3">
          <PeriodFilter ariaLabel="Période d'analyse" tone="cash" extended value={dateRange} onChange={setDateRange} />
          <SegmentedControl
            ariaLabel="Regrouper les résultats"
            tone="accent"
            value={activiteGroupBy}
            onChange={setActiviteGroupBy}
            options={GROUP_BYS}
          />
        </div>
      </PageHero>

      {/* KPI Cards */}
      <ActiviteKpiCards
        totalVentes={totalVentes}
        totalTransactions={totalTransactions}
        cashIn={cashIn}
        cashOut={cashOut}
        valeurStock={valeurStock}
        nbAlertes={nbAlertes}
        totalDepenses={totalDepenses}
        nombreDepenses={nombreDepenses}
        isLoading={isKpiLoading}
      />

      {/* Flux de trésorerie + Top produits */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title={`Flux de trésorerie — ${rangeLabel}`}>
            <ActiviteFluxChart data={flux} groupBy={activiteGroupBy} />
          </SectionCard>
        </div>
        <SectionCard title={`Top produits — ${rangeLabel}`}>
          <ActiviteTopProduits data={topProduits} isLoading={topLoading} />
        </SectionCard>
      </div>

      {/* Ventes par période */}
      <SectionCard title={`Ventes par ${activiteGroupBy} — ${rangeLabel}`}>
        <ActiviteVentesChart data={ventes} groupBy={activiteGroupBy} />
      </SectionCard>

      {/* Session du jour — paiements */}
      <SectionCard title="Répartition paiements — session du jour">
        {resume?.data ? (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-5">
              {[
                { label: "Ventes", node: <CurrencyDisplay montant={resume.data.totalVentes || "0"} tone="cash" size="md" className="font-semibold" /> },
                { label: "Bénéfice", node: <CurrencyDisplay montant={resume.data.beneficeNet || "0"} tone={parseFloat(resume.data.beneficeNet || "0") >= 0 ? "in" : "out"} size="md" className="font-semibold" /> },
                { label: "Transactions", node: <span className="font-mono font-semibold text-text">{resume.data.totalTransactions}</span> },
                { label: "Dépenses", node: <CurrencyDisplay montant={resume.data.totalDepenses || "0"} tone="out" size="md" className="font-semibold" /> },
                { label: "À déposer en caisse", node: <CurrencyDisplay montant={resume.data.montantADeposer || "0"} tone="cash" size="md" className="font-semibold" /> },
              ].map((c) => (
                <div key={c.label}>
                  <dt className="text-xs text-text-muted">{c.label}</dt>
                  <dd>{c.node}</dd>
                </div>
              ))}
            </dl>
            <ActivitePaiementBreakdown resume={resume.data} />
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-text-muted">
            Aucune session ouverte aujourd&apos;hui
          </p>
        )}
      </SectionCard>

      {/* Lien vers le rapport hebdomadaire */}
      <Link
        href="/activite/hebdomadaire"
        className="flex min-h-11 w-fit cursor-pointer items-center gap-1.5 text-sm font-semibold text-accent-text hover:underline"
      >
        Voir les recettes par semaine
        <IconArrowRight size={15} aria-hidden />
      </Link>
    </PageWrapper>
  );
}
