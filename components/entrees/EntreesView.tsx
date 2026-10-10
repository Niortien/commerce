"use client";

import { useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { IconCoins, IconFileSpreadsheet, IconPackageImport, IconPlus, IconTruckDelivery } from "@tabler/icons-react";
import { ImportCatalogueModal } from "@/components/common/ImportCatalogueModal";
import { useAuthStore } from "@/stores/authStore";
import { Role } from "@/types";
import { CountUp } from "@/components/common/CountUp";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { PeriodFilter } from "@/components/common/PeriodFilter";
import { StatTile } from "@/components/common/StatTile";
import { useEntreesList } from "@/features/entrees/query/entrees-queries";
import { dvToISO, type DateRange } from "@/lib/dateRange";
import { EntreesTable } from "./EntreesTable";
import { EntreeCreatePanel } from "./EntreeCreatePanel";

const isAnnulee = (notes: string | null | undefined) => notes?.includes("[ANNULEE]") ?? false;

export function EntreesView() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const estAdmin = useAuthStore((s) => s.user?.role === Role.ADMIN);
  const now = useMemo(() => today(getLocalTimeZone()), []);
  const [dateRange, setDateRange] = useState<DateRange>({ start: now, end: now });

  const params = useMemo(
    () => ({
      limit: 50,
      dateDebut: dvToISO(dateRange.start, false),
      dateFin: dvToISO(dateRange.end, true),
    }),
    [dateRange]
  );

  const { data } = useEntreesList(params);
  const items = data?.pages.flatMap((page) => page.data) ?? [];
  const actives = items.filter((e) => !isAnnulee(e.notes));
  const totalCout = actives.reduce((sum, e) => sum + (Number.parseFloat(e.totalCout) || 0), 0);
  const fournisseurs = new Set(actives.map((e) => e.fournisseur)).size;

  return (
    <>
      <EntreeCreatePanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
      {estAdmin && <ImportCatalogueModal isOpen={importOpen} onClose={() => setImportOpen(false)} />}

      <PageWrapper>
        <PageHero
          tone="in"
          icon={IconPackageImport}
          eyebrow="Réapprovisionnement"
          title="Entrées"
          description="Chaque réception de marchandise, avec son fournisseur et son coût. Le stock se met à jour à l'enregistrement."
          actions={
            <div className="flex flex-wrap gap-2">
              {estAdmin && (
                <Button
                  variant="flat"
                  className="min-h-11 font-semibold"
                  startContent={<IconFileSpreadsheet size={18} aria-hidden />}
                  onPress={() => setImportOpen(true)}
                >
                  Importer depuis Excel
                </Button>
              )}
              <Button
                className="min-h-11 bg-in font-semibold text-white"
                startContent={<IconPlus size={18} aria-hidden />}
                onPress={() => setPanelOpen(true)}
              >
                Nouvelle entrée
              </Button>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatTile
              tone="in"
              icon={IconPackageImport}
              label="Entrées sur la période"
              value={<CountUp value={actives.length} />}
              hint={items.length > actives.length ? `${items.length - actives.length} annulée(s)` : "Aucune annulation"}
            />
            <StatTile
              tone="in"
              icon={IconCoins}
              label="Coût d'achat total"
              value={<CurrencyDisplay montant={String(totalCout)} size="md" className="font-display text-xl font-extrabold" />}
              delay={0.05}
            />
            <StatTile
              tone="accent"
              icon={IconTruckDelivery}
              label="Fournisseurs"
              value={<CountUp value={fournisseurs} />}
              delay={0.1}
            />
          </div>
        </PageHero>

        <PeriodFilter ariaLabel="Période des entrées" tone="in" value={dateRange} onChange={setDateRange} />

        <EntreesTable data={items} />
      </PageWrapper>
    </>
  );
}
