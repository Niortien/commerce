import { PulseIndicator } from "@/components/common/PulseIndicator";
import { StockBadge } from "@/components/common/StockBadge";
import type { StockItem } from "@/types";

interface StockFlowRowProps {
  item: StockItem;
}

export function StockFlowRow({ item }: StockFlowRowProps) {
  const isAlerte = item.quantiteStock <= item.seuilAlerte;

  return (
    <article className="flex items-center justify-between rounded-lg border border-border/80 bg-[linear-gradient(145deg,rgba(45,69,103,0.34),rgba(34,54,81,0.7))] p-3 transition hover:border-border-active hover:shadow-md">
      <div className="flex items-center gap-3">
        <PulseIndicator mode={isAlerte ? "critique" : "normal"} />
        <div>
          <p className="text-sm font-semibold text-text">{item.produit?.nom ?? "—"}</p>
          <p className="text-xs font-[var(--font-mono)] text-text-muted">
            {item.produit?.sku} · {item.taille} · {item.couleur}
          </p>
        </div>
      </div>
      <StockBadge value={item.quantiteStock} isAlert={isAlerte} />
    </article>
  );
}
