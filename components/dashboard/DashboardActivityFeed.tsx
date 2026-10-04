"use client";

import type { Entree, Sortie, TypeSortie } from "@/types";
import { formatDateFr } from "@/lib/dateUtils";
import { FlowTag } from "@/components/common/FlowTag";

function sortieFlowTag(type: TypeSortie): "vente" | "retour" | "sortie" {
  if (type === "VENTE") return "vente";
  if (type === "RETOUR_FOURNISSEUR") return "retour";
  return "sortie";
}

interface DashboardActivityFeedProps {
  entrees: Entree[];
  sorties: Sortie[];
  isLoading: boolean;
}

export function DashboardActivityFeed({ entrees, sorties, isLoading }: DashboardActivityFeedProps) {
  type ActivityItem =
    | { kind: "entree"; item: Entree }
    | { kind: "sortie"; item: Sortie };

  const items: ActivityItem[] = [
    ...entrees.slice(0, 3).map((e) => ({ kind: "entree" as const, item: e })),
    ...sorties.slice(0, 3).map((s) => ({ kind: "sortie" as const, item: s })),
  ].sort((a, b) => new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime());

  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Dernière activité</h2>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-md bg-surface-high" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-text-muted">Aucune activité récente</p>
      ) : (
        <ul className="space-y-2" aria-label="Activité récente">
          {items.map((a) => (
            <li
              key={`${a.kind}-${a.item.id}`}
              className="flex items-center justify-between gap-3 rounded-md bg-surface-high px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FlowTag
                  type={
                    a.kind === "entree"
                      ? "entree"
                      : sortieFlowTag((a.item as Sortie).type)
                  }
                />
                <div>
                  <p className="text-xs font-medium text-text">
                    {a.kind === "entree"
                      ? `Entrée — ${(a.item as Entree).fournisseur}`
                      : `Sortie — ${(a.item as Sortie).type}`}
                  </p>
                  <p className="text-xs text-text-muted">
                    {a.item.reference}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="tabular font-mono text-xs font-medium text-text">
                  {Number(
                    a.kind === "entree"
                      ? (a.item as Entree).totalCout
                      : (a.item as Sortie).totalMontant
                  ).toLocaleString("fr-FR")}{" "}
                  FCFA
                </p>
                <p className="text-xs text-text-muted">
                  {formatDateFr(a.item.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
