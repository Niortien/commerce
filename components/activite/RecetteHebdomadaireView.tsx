"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Chip, DateRangePicker, Spinner } from "@heroui/react";
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
import { IconArrowLeft } from "@tabler/icons-react";
import { PageWrapper } from "@/components/common/PageWrapper";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
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
      { label: "Aujourd'hui", value: { start: now, end: now } },
      { label: "Cette semaine", value: { start: startOfWeek(now, locale), end: endOfWeek(now, locale) } },
      { label: "4 semaines", value: { start: now.subtract({ weeks: 3 }), end: now } },
      { label: "12 semaines", value: { start: now.subtract({ weeks: 11 }), end: now } },
      { label: "Ce mois", value: { start: startOfMonth(now), end: endOfMonth(now) } },
      { label: "52 semaines", value: { start: now.subtract({ weeks: 51 }), end: now } },
    ],
    [locale, now]
  );

  const [dateRange, setDateRange] = useState<DateRange>({
    start: now.subtract({ weeks: 11 }),
    end: now,
  });

  const isPresetActive = (p: DateRange) =>
    dateRange.start.compare(p.start) === 0 && dateRange.end.compare(p.end) === 0;

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
      <div className="flex flex-col gap-2">
        <Link
          href="/activite"
          className="flex w-fit items-center gap-1.5 text-xs text-text-muted hover:text-text"
        >
          <IconArrowLeft size={14} />
          Retour à l&apos;activité
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-[var(--font-display)] text-2xl text-[var(--color-cash)] md:text-3xl">
              Recettes par semaine
            </h1>
            <p className="mt-1 font-[var(--font-mono)] text-xs text-text-muted">{rangeLabel}</p>
          </div>

          <div className="flex flex-col gap-3">
            <DateRangePicker
              aria-label="Période d'analyse (choisir la même date pour un jour précis)"
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
            </div>
          </div>
        </div>
        <p className="text-xs text-text-muted">
          Recette nette = ventes de la semaine moins les dépenses enregistrées sur la même semaine. Choisis la
          même date de début et de fin dans le calendrier pour analyser un jour précis.
        </p>
      </div>

      {/* Totaux de la période */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-[var(--color-surface)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Total ventes</p>
          <CurrencyDisplay montant={String(totaux.ventes)} tone="in" size="lg" className="mt-1" />
        </div>
        <div className="rounded-xl border border-border/60 bg-[var(--color-surface)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Total dépenses</p>
          <CurrencyDisplay montant={String(totaux.depenses)} tone="out" size="lg" className="mt-1" />
        </div>
        <div className="rounded-xl border border-border/60 bg-[var(--color-surface)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Recette nette</p>
          <CurrencyDisplay montant={String(totaux.net)} tone="cash" size="lg" className="mt-1" />
        </div>
      </div>

      {/* Graphique */}
      <div className="rounded-xl border border-border/60 bg-[var(--color-surface)] p-4">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
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
      <div className="rounded-xl border border-border/60 bg-[var(--color-surface)] p-4">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
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
                <tr className="border-b border-border/60 text-left text-[11px] uppercase tracking-widest text-text-muted">
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
                    <tr key={s.semaine} className="border-b border-border/30 last:border-0">
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
        <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Dépenses détaillées — {rangeLabel} ({depenses.length})
        </h2>
        <SortiesTable data={depenses} />
      </div>
    </PageWrapper>
  );
}
