"use client";

import Link from "next/link";
import { StatusChip } from "@/components/common/StatusChip";
import { useBalle } from "@/features/balles/query/balles-queries";
import { estEnRayon, libelleChoix, nomBalle } from "@/lib/balles";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Produit } from "@/types";

interface PieceUniqueOrigineProps {
  produit: Produit;
}

/** Friperie : une pièce unique est en rayon ou vendue, et vient d'une balle. */
export function PieceUniqueOrigine({ produit }: PieceUniqueOrigineProps) {
  const { data } = useBalle(produit.balleId ?? null);
  const balle = data?.data;
  const enRayon = estEnRayon(produit);

  return (
    <div className="rounded-xl border border-border/80 bg-surface p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Pièce unique</p>
        <StatusChip label={enRayon ? "En rayon" : "Vendue"} tone={enRayon ? "in" : "neutral"} />
      </div>
      <p className="text-sm text-text">
        <span className="font-mono">{produit.sku}</span>
        {libelleChoix(produit.choix) && <span className="text-text-muted"> · {libelleChoix(produit.choix)}</span>}
      </p>
      {produit.balleId && (
        <p className="mt-1 text-sm text-text-muted">
          Sortie de la{" "}
          <Link href={`/balles/${produit.balleId}`} className="font-medium text-text underline underline-offset-2 focus-visible:outline-accent">
            {balle ? `${nomBalle(balle).toLowerCase()} · ${balle.libelle}` : "balle"}
          </Link>
        </p>
      )}
      {(produit.nbDemarques ?? 0) > 0 && produit.prixInitial && (
        <p className="mt-1 text-sm text-return-text">
          Démarquée {produit.nbDemarques === 1 ? "une fois" : `${produit.nbDemarques} fois`} · prix d&apos;origine{" "}
          {formatCurrency(produit.prixInitial)}
        </p>
      )}
    </div>
  );
}
