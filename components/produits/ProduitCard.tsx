"use client";

import { useState } from "react";
import Image from "next/image";
import { IconPhoto } from "@tabler/icons-react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import { cn } from "@/lib/utils";
import type { Produit } from "@/types";

interface ProduitCardProps {
  produit: Produit;
  onPress: () => void;
}

export function ProduitCard({ produit, onPress }: ProduitCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = produit.imageUrl ?? produit.images?.[0]?.url ?? null;
  const totalStock = produit.variantes?.reduce((sum, v) => sum + v.quantiteStock, 0) ?? 0;
  const isPromo = produit.enPromo && !!produit.prixPromo;
  const prixVente = parseFloat(produit.prixVente);
  const tauxReduction = isPromo
    ? Math.round(((prixVente - parseFloat(produit.prixPromo!)) / prixVente) * 100)
    : null;
  const rupture = totalStock <= 0;

  return (
    <SpotlightCard as="article" tone={isPromo ? "return" : "accent"} className="group mb-3 break-inside-avoid hover:-translate-y-0.5">
      <button
        type="button"
        onClick={onPress}
        aria-label={`Ouvrir la fiche de ${produit.nom}`}
        className="block w-full cursor-pointer text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--tone)]"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-high">
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={produit.nom}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-muted">
              <IconPhoto size={36} aria-hidden />
            </div>
          )}
          {isPromo && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-return px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
              -{tauxReduction}%
            </span>
          )}
          <span
            className={cn(
              "absolute right-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm",
              rupture ? "bg-out text-white" : "bg-surface/90 text-text"
            )}
          >
            {rupture ? "Rupture" : `${totalStock} en stock`}
          </span>
        </div>

        <div className="p-3.5">
          <p className="truncate text-sm font-semibold text-text">{produit.nom}</p>
          <p className="truncate font-mono text-xs text-text-muted">{produit.sku}</p>
          <div className="mt-2.5 flex items-baseline justify-between gap-2">
            {isPromo ? (
              <>
                <span className="font-mono text-sm font-bold text-return-text">
                  {Number(produit.prixPromo).toLocaleString("fr-FR")} FCFA
                </span>
                <span className="font-mono text-xs text-text-muted line-through">
                  {prixVente.toLocaleString("fr-FR")}
                </span>
              </>
            ) : (
              <CurrencyDisplay montant={produit.prixVente} size="md" className="font-semibold" />
            )}
          </div>
        </div>
      </button>
    </SpotlightCard>
  );
}
