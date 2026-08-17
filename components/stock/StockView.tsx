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
  const density = useUiStore((state) => state.feedDensity);
  const { data } = useStockList({
    alerte: filters.alerte,
    taille: filters.taille,
    categorieId: filters.categorieId,
  });
  const { data: alertes } = useStockAlertes();

  const items = data?.pages.flatMap((page) => page.data) ?? [];
  const total = items.length;

  return (
    <PageWrapper>
      <div className="rounded-xl border border-border/80 bg-[linear-gradient(120deg,rgba(74,122,255,0.14),rgba(143,126,245,0.08))] p-4 md:p-5">
        <div className="flex items-end justify-between">
          <h1 className="font-[var(--font-display)] text-2xl md:text-4xl">Stock</h1>
          <span className="rounded-full border border-accent/40 bg-[color:rgba(74,122,255,0.16)] px-3 py-1 font-[var(--font-mono)] text-accent">
            {total} variantes
          </span>
        </div>
      </div>
      <div className="flex gap-2 overflow-auto pb-1">
        <Chip variant="flat" className="bg-[var(--color-surface-high)] text-text">Tous</Chip>
        <Chip variant="flat" className="bg-[var(--color-out-dim)] text-out">Alerte</Chip>
      </div>
      <StockAlertPanel alertes={alertes?.data ?? []} />
      <FeedDensityToggle />
      <StockTimeline items={items} density={density} />
    </PageWrapper>
  );
}
