"use client";

import { Chip } from "@heroui/react";
import { FeedDensityToggle } from "@/components/common/FeedDensityToggle";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useStockAlertes, useStockList } from "@/features/stock/query/stock-queries";
import { useUiStore } from "@/stores/uiStore";
import { StockAlertPanel } from "./StockAlertPanel";
import { StockTimeline } from "./StockTimeline";

export function StockView() {
  const filters = useUiStore((state) => state.stockFiltre);
  const setStockFiltre = useUiStore((state) => state.setStockFiltre);
  const density = useUiStore((state) => state.feedDensity);
  const { data } = useStockList({
    alerte: filters.alerte,
    taille: filters.taille,
    categorieId: filters.categorieId,
  });
  const { data: alertes } = useStockAlertes();

  const items = data?.pages.flatMap((page) => page.data) ?? [];
  const total = items.length;
  const alertesCount = alertes?.data?.length ?? 0;

  return (
    <PageWrapper>
      <div className="rounded-xl border border-border/80 bg-[linear-gradient(120deg,var(--color-accent-dim),var(--color-cash-dim))] p-4 md:p-5">
        <div className="flex items-end justify-between">
          <h1 className="font-[var(--font-display)] text-2xl md:text-4xl text-text">Stock</h1>
          <span className="rounded-full border border-accent/40 bg-[var(--color-accent-dim)] px-3 py-1 font-[var(--font-mono)] text-accent">
            {total} variantes
          </span>
        </div>
      </div>
      <div className="flex gap-2 overflow-auto pb-1">
        <Chip
          variant="flat"
          className={`cursor-pointer transition-colors ${!filters.alerte ? "bg-accent text-white" : "bg-[var(--color-surface-high)] text-text"}`}
          onClick={() => setStockFiltre({ ...filters, alerte: undefined })}
        >
          Tous
        </Chip>
        <Chip
          variant="flat"
          className={`cursor-pointer transition-colors ${filters.alerte ? "bg-[var(--color-out)] text-white" : "bg-[var(--color-out-dim)] text-out"}`}
          onClick={() => setStockFiltre({ ...filters, alerte: true })}
        >
          Alerte{alertesCount > 0 ? ` (${alertesCount})` : ""}
        </Chip>
      </div>
      <StockAlertPanel alertes={alertes?.data ?? []} />
      <FeedDensityToggle />
      <StockTimeline items={items} density={density} />
    </PageWrapper>
  );
}
