import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import type { StockItem } from "@/types";

interface StockFlowRowProps {
  item: StockItem;
}

/** Une variante en stock : identité à gauche, niveau (jauge relative au seuil d'alerte) à droite. */
export function StockFlowRow({ item }: StockFlowRowProps) {
  const isRupture = item.quantiteStock <= 0;
  const isAlerte = item.quantiteStock <= item.seuilAlerte;
  // La jauge est pleine à 3× le seuil : au-delà, le stock est confortable.
  const ratio = Math.min(1, item.quantiteStock / Math.max(item.seuilAlerte * 3, 1));
  const tone = isAlerte ? "out" : "in";

  return (
    <SpotlightCard as="article" tone={tone} className="p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text">{item.produit?.nom ?? "—"}</p>
          <p className="mt-0.5 truncate font-mono text-xs text-text-muted">{item.produit?.sku}</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="rounded bg-surface-high px-1.5 py-0.5 font-medium text-text">{item.taille}</span>
            <span className="rounded bg-surface-high px-1.5 py-0.5 text-text-muted">{item.couleur}</span>
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className={cn("font-display text-2xl font-extrabold leading-none tabular-nums", isAlerte ? "text-out-text" : "text-text")}>
            {item.quantiteStock}
          </p>
          <p className={cn("mt-1 text-[11px] font-semibold", isAlerte ? "text-out-text" : "text-text-muted")}>
            {isRupture ? "Rupture" : isAlerte ? "Stock bas" : "En stock"}
          </p>
        </div>
      </div>

      <div
        role="meter"
        aria-label={`Niveau de stock de ${item.produit?.nom ?? "la variante"}`}
        aria-valuemin={0}
        aria-valuemax={item.seuilAlerte * 3}
        aria-valuenow={item.quantiteStock}
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-high"
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-500 ease-out", isAlerte ? "bg-out" : "bg-in")}
          style={{ width: `${Math.max(ratio * 100, item.quantiteStock > 0 ? 4 : 0)}%` }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-text-muted">Seuil d&apos;alerte : {item.seuilAlerte}</p>
    </SpotlightCard>
  );
}
