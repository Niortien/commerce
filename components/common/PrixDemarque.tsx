import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";
import type { Produit } from "@/types";

interface PrixDemarqueProps {
  produit: Pick<Produit, "prixVente" | "prixInitial">;
  className?: string;
}

/** Prix de vente, précédé du prix d'origine barré quand la pièce a été démarquée. */
export function PrixDemarque({ produit, className }: PrixDemarqueProps) {
  const demarquee = produit.prixInitial != null && Number(produit.prixInitial) > Number(produit.prixVente);

  return (
    <span className={cn("tabular inline-flex flex-wrap items-baseline justify-end gap-x-1.5", className)}>
      {demarquee && (
        <span className="text-xs text-text-muted line-through">
          <span className="sr-only">Prix d&apos;origine </span>
          {formatCurrency(produit.prixInitial ?? 0)}
        </span>
      )}
      <span className={cn("font-semibold", demarquee ? "text-return-text" : "text-text")}>
        {demarquee && <span className="sr-only">Prix démarqué </span>}
        {formatCurrency(produit.prixVente)}
      </span>
    </span>
  );
}
