import Link from "next/link";
import { IconAlertTriangle, IconPackageImport } from "@tabler/icons-react";
import type { StockAlerte } from "@/types";

interface StockAlertPanelProps {
  alertes: StockAlerte[];
}

export function StockAlertPanel({ alertes }: StockAlertPanelProps) {
  if (!alertes.length) return null;

  return (
    <aside
      aria-label="Articles à réapprovisionner"
      className="rounded-xl border border-out-line bg-out-dim p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-out-text">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-md bg-out/15">
            <span aria-hidden className="live-ping absolute inset-0 rounded-md bg-out/30" />
            <IconAlertTriangle size={16} aria-hidden className="relative" />
          </span>
          {alertes.length} article{alertes.length > 1 ? "s" : ""} à réapprovisionner
        </p>
        <Link
          href="/entrees"
          className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md border border-out-line bg-surface px-3 text-xs font-semibold text-out-text transition-colors duration-150 hover:bg-out/10"
        >
          <IconPackageImport size={14} aria-hidden />
          Nouvelle entrée
        </Link>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {alertes.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs"
          >
            <span className="font-medium text-text">{item.produit?.nom ?? "—"}</span>
            <span className="text-text-muted">
              {item.taille} · {item.couleur}
            </span>
            <span className="font-mono font-bold text-out-text">{item.quantiteStock}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
