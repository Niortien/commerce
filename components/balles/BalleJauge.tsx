"use client";

import { formatCurrency } from "@/lib/formatCurrency";
import { etatRemboursement } from "@/lib/balles";
import { cn } from "@/lib/utils";
import type { Balle } from "@/types";

interface BalleJaugeProps {
  balle: Pick<Balle, "nbPieces" | "tauxRembourse" | "recetteVentes" | "coutTotal" | "marge">;
  /** lg : bilan de la balle ; sm : ligne de liste. */
  taille?: "sm" | "lg";
  className?: string;
}

/**
 * Ce que la balle a déjà rapporté face à ce qu'elle a coûté. Pleine et verte une fois rentabilisée :
 * au-delà, chaque vente est du bénéfice.
 */
export function BalleJauge({ balle, taille = "sm", className }: BalleJaugeProps) {
  const etat = etatRemboursement(balle);
  const taux = balle.tauxRembourse ?? 0;
  const rentabilisee = etat === "RENTABILISEE";

  const libelle =
    etat === "VIDE"
      ? "Pas encore déballée"
      : rentabilisee
        ? `Rentabilisée · ${formatCurrency(balle.marge)} de bénéfice`
        : `Remboursée à ${Math.floor(taux)} %`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <span className={cn("font-medium", taille === "lg" ? "text-sm" : "text-xs", rentabilisee ? "text-in-text" : "text-text")}>
          {libelle}
        </span>
        {taille === "lg" && etat !== "VIDE" && (
          <span className="tabular text-xs text-text-muted">
            {formatCurrency(balle.recetteVentes)} encaissés sur {formatCurrency(balle.coutTotal)}
          </span>
        )}
      </div>
      <div
        role="progressbar"
        aria-label="Part du coût de la balle déjà revenue en caisse"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(100, Math.round(taux))}
        aria-valuetext={libelle}
        className={cn(
          "overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-border)_70%,transparent)]",
          taille === "lg" ? "h-3" : "h-1.5"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none",
            rentabilisee ? "bg-in" : "bg-return"
          )}
          style={{ width: `${Math.min(100, taux)}%` }}
        />
      </div>
    </div>
  );
}
