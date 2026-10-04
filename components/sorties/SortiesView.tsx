"use client";

import { useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { IconCashBanknote, IconPackageExport, IconPlus, IconReceipt2 } from "@tabler/icons-react";
import { CountUp } from "@/components/common/CountUp";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { PeriodFilter } from "@/components/common/PeriodFilter";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { StatTile } from "@/components/common/StatTile";
import { useSortiesList } from "@/features/sorties/query/sorties-queries";
import { dvToISO, type DateRange } from "@/lib/dateRange";
import { useUiStore } from "@/stores/uiStore";
import { TypeSortie } from "@/types";
import { SortiesTable } from "./SortiesTable";
import { SortieCreatePanel } from "./SortieCreatePanel";

const TYPE_FILTERS: { key: TypeSortie | "ALL"; label: string }[] = [
  { key: "ALL", label: "Tous" },
  { key: TypeSortie.VENTE, label: "Ventes" },
  { key: TypeSortie.PERTE, label: "Pertes" },
  { key: TypeSortie.DON, label: "Dons" },
  { key: TypeSortie.RETOUR_FOURNISSEUR, label: "Retours" },
  { key: TypeSortie.DEPENSE, label: "Dépenses" },
];

const isAnnulee = (notes: string | null | undefined) => notes?.includes("[ANNULEE]") ?? false;

export function SortiesView() {
  const [panelOpen, setPanelOpen] = useState(false);
  const typeFilter = useUiStore((s) => s.sortieTypeFilter);
  const setTypeFilter = useUiStore((s) => s.setSortieTypeFilter);

  const now = useMemo(() => today(getLocalTimeZone()), []);
  const [dateRange, setDateRange] = useState<DateRange>({ start: now, end: now });

  const params = useMemo(
    () => ({
      limit: 50,
      dateDebut: dvToISO(dateRange.start, false),
      dateFin: dvToISO(dateRange.end, true),
      ...(typeFilter ? { type: typeFilter } : {}),
    }),
    [dateRange, typeFilter]
  );

  const { data } = useSortiesList(params);
  const items = data?.pages.flatMap((page) => page.data) ?? [];
  const actives = items.filter((s) => !isAnnulee(s.notes));
  const ventes = actives.filter((s) => s.type === TypeSortie.VENTE);
  const totalVentes = ventes.reduce((sum, s) => sum + (Number.parseFloat(s.totalMontant) || 0), 0);

  return (
    <>
      <SortieCreatePanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />

      <PageWrapper>
        <PageHero
          tone="out"
          icon={IconPackageExport}
          eyebrow="Ventes et pertes"
          title="Sorties"
          description="Ventes, pertes, dons, retours fournisseur et dépenses : chaque sortie diminue le stock et garde sa référence."
          actions={
            <Button
              className="min-h-11 bg-out font-semibold text-white"
              startContent={<IconPlus size={18} aria-hidden />}
              onPress={() => setPanelOpen(true)}
            >
              Nouvelle sortie
            </Button>
          }
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatTile
              tone="out"
              icon={IconPackageExport}
              label="Sorties sur la période"
              value={<CountUp value={actives.length} />}
              hint={items.length > actives.length ? `${items.length - actives.length} annulée(s)` : "Aucune annulation"}
            />
            <StatTile
              tone="cash"
              icon={IconCashBanknote}
              label="Montant des ventes"
              value={<CurrencyDisplay montant={String(totalVentes)} size="md" className="font-display text-xl font-extrabold" />}
              delay={0.05}
            />
            <StatTile
              tone="accent"
              icon={IconReceipt2}
              label="Nombre de ventes"
              value={<CountUp value={ventes.length} />}
              delay={0.1}
            />
          </div>
        </PageHero>

        <div className="flex flex-col gap-3">
          <PeriodFilter ariaLabel="Période des sorties" tone="out" value={dateRange} onChange={setDateRange} />
          <SegmentedControl
            ariaLabel="Type de sortie"
            tone="accent"
            value={typeFilter ?? "ALL"}
            onChange={(key) => setTypeFilter(key === "ALL" ? null : key)}
            options={TYPE_FILTERS}
          />
        </div>

        <SortiesTable data={items} />
      </PageWrapper>
    </>
  );
}
