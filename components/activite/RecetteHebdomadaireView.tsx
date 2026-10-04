"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DateRangePicker, Spinner } from "@heroui/react";
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
import { IconArrowLeft, IconCalendarStats, IconCoin, IconReportMoney, IconWallet } from "@tabler/icons-react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { StatTile } from "@/components/common/StatTile";
import { useRecetteHebdomadaire } from "@/features/rapports/query/rapports-queries";
import { useSortiesList } from "@/features/sorties/query/sorties-queries";
import { TypeSortie } from "@/types";
import { SortiesTable } from "@/components/sorties/SortiesTable";
import { formatSemaineLabel } from "./formatSemaine";

const RecetteHebdomadaireChart = dynamic(
  () => import("./RecetteHebdomadaireChart").then((m) => m.RecetteHebdomadaireChart),
  {
    loading: () => (
      <div className="flex h-60 items-center justify-center">
        <Spinner size="sm" />
      </div>
    ),
    ssr: false,
  }
);

type DateRange = { start: DateValue; end: DateValue };

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

export function RecetteHebdomadaireView() {
  const { locale } = useLocale();
  const now = useMemo(() => today(getLocalTimeZone()), []);

  const presets = useMemo(
    () => [
      { key: "today", label: "Aujourd'hui", value: { start: now, end: now } },
      { key: "week", label: "Cette semaine", value: { start: startOfWeek(now, locale), end: endOfWeek(now, locale) } },
      { key: "4w", label: "4 semaines", value: { start: now.subtract({ weeks: 3 }), end: now } },
      { key: "12w", label: "12 semaines", value: { start: now.subtract({ weeks: 11 }), end: now } },
      { key: "month", label: "Ce mois", value: { start: startOfMonth(now), end: endOfMonth(now) } },
      { key: "52w", label: "52 semaines", value: { start: now.subtract({ weeks: 51 }), end: now } },
    ],
    [locale, now]
  );

  const [dateRange, setDateRange] = useState<DateRange>({
    start: now.subtract({ weeks: 11 }),
    end: now,
  });

  const activePreset = presets.find(
    (p) => dateRange.start.compare(p.value.start) === 0 && dateRange.end.compare(p.value.end) === 0
  );

  const params = useMemo(
    () => ({
      dateDebut: dvToISO(dateRange.start, false),
      dateFin: dvToISO(dateRange.end, true),
    }),
    [dateRange]
  );

  const { data, isLoading } = useRecetteHebdomadaire(params);
  const semaines = Array.isArray(data?.data) ? data.data : [];

  const { data: depensesData } = useSortiesList({
    type: TypeSortie.DEPENSE,
    dateDebut: params.dateDebut,
    dateFin: params.dateFin,
    limit: 100,
  });
  const depenses = depensesData?.pages.flatMap((page) => page.data) ?? [];

  const totaux = useMemo(
    () =>
      semaines.reduce(
        (acc, s) => ({
          ventes: acc.ventes + parseFloat(s.totalVentes || "0"),
          depenses: acc.depenses + parseFloat(s.totalDepenses || "0"),
          net: acc.net + parseFloat(s.recetteNette || "0"),
        }),
        { ventes: 0, depenses: 0, net: 0 }
      ),
    [semaines]
  );

  const rangeLabel = formatRange(dateRange);

  return (
    <PageWrapper>
      <Link
        href="/activite"
        className="flex min-h-9 w-fit cursor-pointer items-center gap-1.5 text-sm text-text-muted transition-colors duration-150 hover:text-text"
      >
        <IconArrowLeft size={16} aria-hidden />
        Retour à l&apos;activité
      </Link>

      <PageHero
        tone="cash"
        icon={IconCalendarStats}
        eyebrow="Analyse"
        title="Recettes par semaine"
        description={
          <>
            <span className="font-mono text-xs">{rangeLabel}</span>
            <span className="mt-1 block">
              Recette nette = ventes de la semaine moins les dépenses de la même semaine. Choisissez la même date de
              début et de fin pour analyser un jour précis.
            </span>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <SegmentedControl
            ariaLabel="Raccourcis de période"
            tone="cash"
            value={activePreset?.key ?? null}
            onChange={(key) => {
              const preset = presets.find((p) => p.key === key);
              if (preset) setDateRange(preset.value);
            }}
            options={presets.map(({ key, label }) => ({ key, label }))}
          />
          <DateRangePicker
            aria-label="Période d'analyse (choisir la même date pour un jour précis)"
            value={dateRange}
            onChange={(val) => val && setDateRange(val)}
            maxValue={now}
            visibleMonths={2}
            size="sm"
            classNames={{
              base: "w-full lg:max-w-[340px]",
              inputWrapper:
                "h-10 border border-border bg-surface shadow-none hover:border-[var(--color-cash)] focus-within:!border-[var(--color-cash)]",
              segment: "text-text",
              separator: "text-text-muted",
              calendarContent: "bg-surface border border-border rounded-xl shadow-lg",
            }}
          />
        </div>
      </PageHero>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile tone="in" icon={IconCoin} label="Total ventes" value={<CurrencyDisplay montant={String(totaux.ventes)} size="md" className="font-display text-xl font-extrabold" />} />
        <StatTile tone="out" icon={IconReportMoney} label="Total dépenses" value={<CurrencyDisplay montant={String(totaux.depenses)} size="md" className="font-display text-xl font-extrabold" />} delay={0.05} />
        <StatTile tone="cash" icon={IconWallet} label="Recette nette" value={<CurrencyDisplay montant={String(totaux.net)} size="md" className="font-display text-xl font-extrabold" />} delay={0.1} />
      </div>

      {/* Graphique */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-card md:p-5">
        <h2 className="mb-4 text-sm font-semibold text-text">
          Évolution par semaine
        </h2>
        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <Spinner size="sm" />
          </div>
        ) : (
          <RecetteHebdomadaireChart data={semaines} />
        )}
      </div>

      {/* Détail par semaine */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-card md:p-5">
        <h2 className="mb-4 text-sm font-semibold text-text">
          Détail par semaine
        </h2>
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner size="sm" />
          </div>
        ) : semaines.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-muted">Aucune donnée sur cette période</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-text-muted">
                  <th className="py-2 pr-4 font-semibold">Semaine</th>
                  <th className="py-2 pr-4 font-semibold">Ventes</th>
                  <th className="py-2 pr-4 font-semibold">Dépenses</th>
                  <th className="py-2 pr-4 font-semibold">Recette nette</th>
                </tr>
              </thead>
              <tbody>
                {[...semaines].reverse().map((s) => {
                  const net = parseFloat(s.recetteNette || "0");
                  return (
                    <tr key={s.semaine} className="border-b border-border last:border-0 hover:bg-surface-high">
                      <td className="py-2 pr-4 text-text">{formatSemaineLabel(s.semaine)}</td>
                      <td className="py-2 pr-4">
                        <CurrencyDisplay montant={s.totalVentes} size="sm" tone="in" />
                      </td>
                      <td className="py-2 pr-4">
                        <CurrencyDisplay montant={s.totalDepenses} size="sm" tone="out" />
                      </td>
                      <td className="py-2 pr-4">
                        <CurrencyDisplay montant={s.recetteNette} size="sm" tone={net >= 0 ? "cash" : "out"} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Détail des dépenses de la période */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text">
          Dépenses détaillées — {rangeLabel} ({depenses.length})
        </h2>
        <SortiesTable data={depenses} />
      </div>
    </PageWrapper>
  );
}
