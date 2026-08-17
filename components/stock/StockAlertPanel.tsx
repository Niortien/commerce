import type { StockAlerte } from "@/types";

interface StockAlertPanelProps {
  alertes: StockAlerte[];
}

export function StockAlertPanel({ alertes }: StockAlertPanelProps) {
  if (!alertes.length) return null;

  return (
    <aside className="rounded-xl border border-out/60 bg-[color:rgba(255,77,109,0.10)] p-4">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-out">⚠ Alertes stock ({alertes.length})</p>
      <ul className="flex flex-wrap gap-2">
        {alertes.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-1.5 rounded-lg border border-out/30 bg-[color:rgba(255,77,109,0.08)] px-2.5 py-1 text-xs"
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
