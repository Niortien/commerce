import Link from "next/link";
import { IconAlertTriangle, IconPackageImport } from "@tabler/icons-react";
import type { StockAlerte } from "@/types";

interface StockAlertPanelProps {
  alertes: StockAlerte[];
}

export function StockAlertPanel({ alertes }: StockAlertPanelProps) {
  if (!alertes.length) return null;

  return (
    <aside className="rounded-xl border border-out/60 bg-[var(--color-out-dim)] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-out">
          <IconAlertTriangle size={14} />
          {alertes.length} article{alertes.length > 1 ? "s" : ""} à réapprovisionner
        </p>
        <Link
          href="/entrees"
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-out/40 bg-[var(--color-surface)] px-2.5 py-1 text-xs font-semibold text-out transition-colors hover:bg-out/10"
        >
          <IconPackageImport size={13} />
          Nouvelle entrée
        </Link>
      </div>
      <ul className="flex flex-wrap gap-2">
        {alertes.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-1.5 rounded-lg border border-out/30 bg-[var(--color-surface)] px-2.5 py-1 text-xs"
          >
            <span className="font-medium text-text">{item.produit?.nom ?? "—"}</span>
            <span className="text-text-muted">{item.taille} · {item.couleur}</span>
            <span className="font-[var(--font-mono)] font-bold text-out">{item.quantiteStock}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
