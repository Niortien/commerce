"use client";

import { Button } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { FlowTag } from "@/components/common/FlowTag";
import type { Entree } from "@/types";

interface EntreeFeedItemProps {
  entree: Entree;
  onCancel: (id: string) => void;
}

export function EntreeFeedItem({ entree, onCancel }: EntreeFeedItemProps) {
  const isAnnulee = entree.notes?.includes("[ANNULEE]") ?? false;

  return (
    <article
      className={[
        "rounded-lg border p-3 transition",
        isAnnulee
          ? "border-border/40 bg-[var(--color-surface-high)] opacity-50"
          : "border-border/80 bg-[linear-gradient(145deg,rgba(57,211,83,0.12),rgba(34,54,81,0.7))] hover:border-[var(--color-in)]/50 hover:shadow-md",
      ].join(" ")}
    >
      {/* Type + date */}
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlowTag type="entree" />
          {isAnnulee && (
            <span className="rounded bg-[color:rgba(255,77,109,0.15)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-out)]">
              Annulée
            </span>
          )}
        </div>
        <span className="text-xs text-text-muted">
          {formatDistanceToNow(new Date(entree.createdAt), {
            addSuffix: true,
            locale: fr,
          })}
        </span>
      </div>

      {/* Fournisseur + référence + nombre d'articles */}
      <p className="text-sm font-semibold text-text">{entree.fournisseur}</p>
      <div className="flex items-center gap-3">
        <p className="font-[var(--font-mono)] text-xs text-text-muted">
          {entree.reference}
        </p>
        {entree.lignes !== undefined && (
          <span className="text-xs text-text-muted">
            · {entree.lignes.length} article{entree.lignes.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Notes (hors marqueur annulation) */}
      {entree.notes && !entree.notes.includes("[ANNULEE]") && (
        <p className="mt-0.5 truncate text-xs italic text-text-muted">
          {entree.notes}
        </p>
      )}

      {/* Montant + action */}
      <div className="mt-2 flex items-center justify-between">
        <CurrencyDisplay montant={entree.totalCout} size="lg" tone="in" />
        {!isAnnulee && (
          <Button
            size="sm"
            variant="flat"
            className="bg-[color:rgba(255,77,109,0.12)] text-[var(--color-out)]"
            onPress={() => onCancel(entree.id)}
          >
            Annuler
          </Button>
        )}
      </div>
    </article>
  );
}
