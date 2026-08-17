"use client";

import { Skeleton } from "@heroui/react";

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

export function ActiviteTopProduits({ data, isLoading }: ActiviteTopProduitsProps) {
  const maxMontant = Math.max(...data.map((p) => parseFloat(p.montantTotal || "0")), 1);

  return (
    <div className="flex flex-col gap-3">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-3/4 rounded" />
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          ))
        : data.length === 0
        ? (
          <p className="py-6 text-center text-sm text-text-muted">Aucune vente sur cette période</p>
        )
        : data.map((produit, idx) => {
            const montant = parseFloat(produit.montantTotal || "0");
            const pct = (montant / maxMontant) * 100;
            const rankColors = ["text-accent", "text-[#c0c0c0]", "text-[#cd7f32]"];

            return (
              <div key={produit.produitId} className="flex items-center gap-3">
                <span
                  className={`w-5 text-center text-xs font-bold ${
                    rankColors[idx] ?? "text-text-dim"
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium text-text">{produit.nom}</span>
                    <span className="shrink-0 font-[var(--font-mono)] text-xs text-text-muted">
                      ×{produit.quantiteTotale}
                    </span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-[var(--color-surface-high)]">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${pct}%`, opacity: 0.6 + pct / 250 }}
                    />
                  </div>
                </div>
                <span className="shrink-0 font-[var(--font-mono)] text-xs font-semibold text-accent">
                  {Math.round(montant / 1000)}k
                </span>
              </div>
            );
          })}
    </div>
  );
}
