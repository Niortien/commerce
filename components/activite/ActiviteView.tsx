"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Chip, DateRangePicker, Spinner } from "@heroui/react";
import { IconArrowRight } from "@tabler/icons-react";
import {
  endOfMonth,
  endOfWeek,
  getLocalTimeZone,
  startOfMonth,
  startOfWeek,
  today,
  type DateValue,
} from "@internationalized/date";
import { useLocale } from "react-aria";
import { PageWrapper } from "@/components/common/PageWrapper";
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

type DateRange = { start: DateValue; end: DateValue };

const GROUP_BYS: { key: RapportGroupBy; label: string }[] = [
  { key: "jour", label: "/ Jour" },
  { key: "semaine", label: "/ Semaine" },
  { key: "mois", label: "/ Mois" },
];

function dvToISO(dv: DateValue, endOfDay: boolean): string {
  const d = dv.toDate(getLocalTimeZone());
  if (endOfDay) d.setHours(23, 59, 59, 0);
  else d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

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
    <div className="rounded-xl border border-border/60 bg-[var(--color-surface)] p-4">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function ActiviteView() {
  const { locale } = useLocale();
  const activiteGroupBy = useUiStore((s) => s.activiteGroupBy);
  const setActiviteGroupBy = useUiStore((s) => s.setActiviteGroupBy);

  const now = useMemo(() => today(getLocalTimeZone()), []);

  const presets = useMemo(
    () => [
      { label: "Aujourd'hui", value: { start: now, end: now } },
      { label: "Hier", value: { start: now.subtract({ days: 1 }), end: now.subtract({ days: 1 }) } },
      { label: "Cette semaine", value: { start: startOfWeek(now, locale), end: endOfWeek(now, locale) } },
      { label: "Semaine passée", value: { start: startOfWeek(now, locale).subtract({ weeks: 1 }), end: endOfWeek(now, locale).subtract({ weeks: 1 }) } },
      { label: "Ce mois", value: { start: startOfMonth(now), end: endOfMonth(now) } },
      { label: "Mois dernier", value: { start: startOfMonth(now.subtract({ months: 1 })), end: endOfMonth(now.subtract({ months: 1 })) } },
      { label: "30 jours", value: { start: now.subtract({ days: 29 }), end: now } },
      { label: "90 jours", value: { start: now.subtract({ days: 89 }), end: now } },
    ],
    [locale, now]
  );

  const [dateRange, setDateRange] = useState<DateRange>({ start: now, end: now });

  const isPresetActive = (preset: DateRange) =>
    dateRange.start.compare(preset.start) === 0 &&
    dateRange.end.compare(preset.end) === 0;

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
      {/* En-tête */}
      <div className="rounded-xl border border-border/80 bg-[linear-gradient(135deg,rgba(143,126,245,0.20),rgba(34,54,81,0.50))] p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-[var(--font-display)] text-2xl text-[var(--color-cash)] md:text-4xl">
              Activité
            </h1>
            <p className="mt-1 font-[var(--font-mono)] text-xs text-text-muted">{rangeLabel}</p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Date range picker */}
            <DateRangePicker
              aria-label="Période d'analyse"
              value={dateRange}
              onChange={(val) => val && setDateRange(val)}
              maxValue={now}
              visibleMonths={2}
              size="sm"
              classNames={{
                base: "max-w-[340px]",
                inputWrapper:
                  "border border-border/60 bg-[var(--color-surface-high)] shadow-none hover:border-accent/50 focus-within:!border-accent/70 h-9",
                segment: "text-text focus:bg-accent/20",
                separator: "text-text-dim",
                calendarContent: "bg-[var(--color-surface)] border border-border/60 rounded-xl shadow-xl",
              }}
            />

            {/* Raccourcis preset */}
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <Chip
                  key={p.label}
                  variant="flat"
                  className={
                    isPresetActive(p.value)
                      ? "cursor-pointer bg-[var(--color-cash)] font-semibold text-black"
                      : "cursor-pointer bg-[var(--color-surface-high)] text-text-muted hover:text-text"
                  }
                  onClick={() => setDateRange(p.value)}
                >
                  {p.label}
                </Chip>
              ))}
              <span className="mx-0.5 self-center text-border">|</span>
              {GROUP_BYS.map((g) => (
                <Chip
                  key={g.key}
                  variant="flat"
                  className={
                    activiteGroupBy === g.key
                      ? "cursor-pointer bg-[var(--color-surface-high)] font-semibold text-text"
                      : "cursor-pointer bg-[var(--color-surface)] text-text-dim hover:text-text-muted"
                  }
                  onClick={() => setActiviteGroupBy(g.key)}
                >
                  {g.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>

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
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-text-muted">Ventes : </span>
                <span className="[font-family:var(--font-mono)] font-semibold text-[var(--color-cash)]">
                  {parseFloat(resume.data.totalVentes || "0").toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <div>
                <span className="text-text-muted">Bénéfice : </span>
                <span
                  className={`[font-family:var(--font-mono)] font-semibold ${
                    parseFloat(resume.data.beneficeNet || "0") >= 0
                      ? "text-[var(--color-in)]"
                      : "text-[var(--color-out)]"
                  }`}
                >
                  {parseFloat(resume.data.beneficeNet || "0").toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <div>
                <span className="text-text-muted">Transactions : </span>
                <span className="[font-family:var(--font-mono)] font-semibold text-text">
                  {resume.data.totalTransactions}
                </span>
              </div>
              <div>
                <span className="text-text-muted">Dépenses : </span>
                <span className="[font-family:var(--font-mono)] font-semibold text-[var(--color-out)]">
                  {parseFloat(resume.data.totalDepenses || "0").toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <div>
                <span className="text-text-muted">À déposer en caisse : </span>
                <span className="[font-family:var(--font-mono)] font-semibold text-[var(--color-cash)]">
                  {parseFloat(resume.data.montantADeposer || "0").toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>
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
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        Voir les recettes par semaine
        <IconArrowRight size={15} />
      </Link>
    </PageWrapper>
  );
}
