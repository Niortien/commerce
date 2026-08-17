"use client";

import type { ResumeDashboardData } from "@/features/rapports/api/rapports-api";

interface TopProduit {
  produitId: string;
  nom: string;
  quantiteTotale: number;
  montantTotal: string;
}

interface DashboardTopProduitsProps {
  produits: TopProduit[];
  isLoading: boolean;
  isError?: boolean;
  diagnostic?: ResumeDashboardData["diagnostic"];
}

export function DashboardTopProduits({ produits, isLoading, isError, diagnostic }: DashboardTopProduitsProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-[var(--color-surface-high)] p-4">
      <p className="mb-3 text-xs uppercase tracking-wide text-text-muted">Top 5 produits — 7j</p>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-md bg-[var(--color-surface)]" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-out/30 bg-out/5 px-3 py-3">
          <p className="text-xs font-semibold text-out">Impossible de charger le classement</p>
          <p className="mt-0.5 text-[11px] text-text-muted">Vérifie la connexion au serveur</p>
        </div>
      ) : produits.length === 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-text-muted">Aucune vente sur les 7 derniers jours</p>
          {diagnostic && (
            <div className="rounded-md border border-border/40 bg-[var(--color-surface)] px-3 py-2.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Produits catalogue</span>
                <span className={`font-mono font-semibold ${diagnostic.totalProduits > 0 ? "text-in" : "text-out"}`}>
                  {diagnostic.totalProduits}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Entrées de stock</span>
                <span className={`font-mono font-semibold ${diagnostic.totalEntrees > 0 ? "text-in" : "text-out"}`}>
                  {diagnostic.totalEntrees}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Ventes (tous temps)</span>
                <span className={`font-mono font-semibold ${diagnostic.totalVentesAllTime > 0 ? "text-in" : "text-out"}`}>
                  {diagnostic.totalVentesAllTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Session caisse ouverte</span>
                <span className={`font-mono font-semibold ${diagnostic.sessionsOuvertes > 0 ? "text-in" : "text-out"}`}>
                  {diagnostic.sessionsOuvertes > 0 ? "Oui" : "Non"}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ol className="space-y-2">
          {produits.slice(0, 5).map((p, i) => (
            <li
              key={p.produitId}
              className="flex items-center justify-between rounded-md border border-border/60 bg-[var(--color-surface)] px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 text-center font-[var(--font-mono)] text-xs text-text-muted">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-text">{p.nom}</span>
              </div>
              <div className="text-right">
                <p className="font-[var(--font-mono)] text-xs text-accent">
                  {Number(p.montantTotal).toLocaleString("fr-FR")} FCFA
                </p>
                <p className="text-[10px] text-text-muted">{p.quantiteTotale} vendus</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
