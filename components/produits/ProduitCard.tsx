"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardBody } from "@heroui/react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { StockBadge } from "@/components/common/StockBadge";
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

  return (
    <Card
      isPressable
      onPress={onPress}
      className="group mb-3 w-full overflow-hidden border border-border/80 bg-[linear-gradient(145deg,rgba(45,69,103,0.32),rgba(34,54,81,0.8))] text-left transition hover:scale-[1.02] hover:border-accent/40 hover:shadow-glow-yellow"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[color:rgba(20,32,50,0.9)]">
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={produit.nom}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[var(--color-surface-high)] via-[color:rgba(143,126,245,0.22)] to-border" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(23,38,58,0.75)_0%,transparent_55%)]" />
        {isPromo && (
          <div className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            -{tauxReduction}%
          </div>
        )}
      </div>
      <CardBody className="p-3">
        <p className="truncate text-sm font-semibold text-text">{produit.nom}</p>
        <p className="font-[var(--font-mono)] text-xs text-text-muted">{produit.sku}</p>
        <div className="mt-2 flex items-center justify-between">
          <StockBadge value={totalStock} />
          {isPromo ? (
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] text-text-dim line-through">
                {prixVente.toLocaleString("fr-FR")} FCFA
              </span>
              <span className="[font-family:var(--font-mono)] text-sm font-bold text-orange-400">
                {Number(produit.prixPromo).toLocaleString("fr-FR")} FCFA
              </span>
            </div>
          ) : (
            <CurrencyDisplay montant={produit.prixVente} size="sm" />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
