"use client";

import Link from "next/link";
import { IconCheck, IconCircle } from "@tabler/icons-react";
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

/** Étape d'une checklist de démarrage — chaque étape franchie prépare la suivante. */
function ChecklistStep({ done, label, href }: { done: boolean; label: string; href: string }) {
  const content = (
    <>
      {done ? (
        <IconCheck size={14} className="shrink-0 text-in-text" aria-hidden />
      ) : (
        <IconCircle size={14} className="shrink-0 text-text-muted" aria-hidden />
      )}
      <span className={done ? "text-text-muted line-through" : "text-text"}>{label}</span>
    </>
  );

  if (done) {
    return <li className="flex items-center gap-2 text-xs">{content}</li>;
  }

  return (
    <li>
      <Link href={href} className="group flex items-center gap-2 text-xs font-medium text-text hover:text-accent">
        {content}
      </Link>
    </li>
  );
}

export function DashboardTopProduits({ produits, isLoading, isError, diagnostic }: DashboardTopProduitsProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
      <h2 className="mb-3 text-sm font-semibold text-text">Top 5 produits — 7 jours</h2>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-md bg-surface-high" />
          ))}
        </div>
      ) : isError ? (
        <div role="alert" className="rounded-lg border border-out-line bg-out-dim px-3 py-3">
          <p className="text-xs font-semibold text-out-text">Impossible de charger le classement</p>
          <p className="mt-0.5 text-[11px] text-text-muted">Vérifie la connexion au serveur</p>
        </div>
      ) : produits.length === 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-text-muted">Aucune vente sur les 7 derniers jours</p>
          {diagnostic && (
            <ul className="space-y-2 rounded-md border border-border bg-surface-high px-3 py-3">
              <ChecklistStep
                done={diagnostic.totalProduits > 0}
                label="Ajouter des produits au catalogue"
                href="/produits"
              />
              <ChecklistStep
                done={diagnostic.totalEntrees > 0}
                label="Recevoir une entrée de stock"
                href="/entrees"
              />
              <ChecklistStep
                done={diagnostic.sessionsOuvertes > 0}
                label="Ouvrir une session caisse"
                href="/caisse"
              />
              <ChecklistStep
                done={diagnostic.totalVentesAllTime > 0}
                label="Enregistrer une première vente"
                href="/sorties"
              />
            </ul>
          )}
        </div>
      ) : (
        <ol className="space-y-3.5">
          {produits.slice(0, 5).map((p, i) => {
            const max = Math.max(...produits.slice(0, 5).map((x) => Number(x.montantTotal) || 0), 1);
            const pct = ((Number(p.montantTotal) || 0) / max) * 100;
            return (
              <li key={p.produitId} className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    i === 0 ? "bg-return-dim text-return-text" : "bg-surface-high text-text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium text-text">{p.nom}</span>
                    <span className="shrink-0 text-xs text-text-muted">{p.quantiteTotale} vendus</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-high">
                      <div
                        className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="tabular shrink-0 font-mono text-xs font-semibold text-accent-text">
                      {Number(p.montantTotal).toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
