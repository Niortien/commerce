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
        <IconCheck size={14} className="shrink-0 text-in" />
      ) : (
        <IconCircle size={14} className="shrink-0 text-text-dim" />
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
            <ul className="space-y-1.5 rounded-md border border-border/40 bg-[var(--color-surface)] px-3 py-2.5">
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
