"use client";

import { Skeleton } from "@heroui/react";
import { cn } from "@/lib/utils";

interface TopProduit {
  produitId: string;
  nom: string;
  sku: string;
  quantiteTotale: number;
  montantTotal: string;
}

interface ActiviteTopProduitsProps {
  data: TopProduit[];
  isLoading: boolean;
}

// Le rang est porté par le chiffre ; la teinte ne fait que le renforcer (or, argent, bronze en tons du design system).
const RANK_CLASS = ["bg-return-dim text-return-text", "bg-surface-high text-text", "bg-cash-dim text-cash-text"];

export function ActiviteTopProduits({ data, isLoading }: ActiviteTopProduitsProps) {
  const maxMontant = Math.max(...data.map((p) => parseFloat(p.montantTotal || "0")), 1);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-3/4 rounded" />
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
            <Skeleton className="h-4 w-14 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="py-6 text-center text-sm text-text-muted">Aucune vente sur cette période</p>;
  }

  return (
    <ol className="flex flex-col gap-3.5">
      {data.map((produit, idx) => {
        const montant = parseFloat(produit.montantTotal || "0");
        const pct = (montant / maxMontant) * 100;

        return (
          <li key={produit.produitId} className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                RANK_CLASS[idx] ?? "bg-surface-high text-text-muted"
              )}
            >
              {idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-medium text-text">{produit.nom}</span>
                <span className="shrink-0 font-mono text-xs text-text-muted">×{produit.quantiteTotale}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-high">
                <div className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <span className="shrink-0 font-mono text-xs font-semibold text-accent-text">{Math.round(montant / 1000)}k</span>
          </li>
        );
      })}
    </ol>
  );
}
