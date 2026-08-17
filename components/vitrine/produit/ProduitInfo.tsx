"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Produit, VarianteBoutique } from "@/types";

interface ProduitInfoProps {
  produit: Produit;
  totalStock: number;
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
        style={{ backgroundColor: "rgba(255,36,73,0.15)", color: "var(--v-red)" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--v-red)]" />
        Rupture de stock
      </span>
    );
  if (stock <= 5)
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
        style={{ backgroundColor: "rgba(255,154,60,0.15)", color: "#ff9a3c" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff9a3c]" />
        Limité — {stock} restant{stock > 1 ? "s" : ""}
      </span>
    );
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
      style={{ backgroundColor: "rgba(200,118,44,0.12)", color: "var(--v-lime)" }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--v-lime)]" />
      Disponible
    </span>
  );
}

export function ProduitInfo({ produit, totalStock }: ProduitInfoProps) {
  const prix = parseFloat(produit.prixVente || "0");

  const boutiquesAvecStock = useMemo(() => {
    const seen = new Set<string>();
    const result: VarianteBoutique[] = [];
    for (const v of produit.variantes ?? []) {
      if (v.quantiteStock > 0 && v.boutique && !seen.has(v.boutique.id)) {
        seen.add(v.boutique.id);
        result.push(v.boutique);
      }
    }
    return result;
  }, [produit.variantes]);
  const isPromo = produit.enPromo && !!produit.prixPromo;
  const prixPromo = isPromo ? parseFloat(produit.prixPromo!) : null;
  const tauxReduction = isPromo && prixPromo !== null
    ? Math.round(((prix - prixPromo) / prix) * 100)
    : null;

  return (
    <div>
      {/* Catégorie */}
      {produit.categorie && (
        <p
          className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em]"
          style={{ color: "var(--v-lime)" }}
        >
          {produit.categorie.nom}
        </p>
      )}

      {/* Nom */}
      <h1
        className="font-[var(--font-display)] font-black leading-tight tracking-tight"
        style={{ fontSize: "clamp(28px, 5vw, 48px)", color: "var(--v-text)" }}
      >
        {produit.nom}
      </h1>

      {/* SKU + Stock */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span
          className="[font-family:var(--font-mono)] text-xs"
          style={{ color: "var(--v-dim)" }}
        >
          REF: {produit.sku}
        </span>
        <StockBadge stock={totalStock} />
        {isPromo && (
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider text-white"
            style={{ backgroundColor: "var(--v-hot)" }}
          >
            EN PROMOTION -{tauxReduction}%
          </motion.span>
        )}
      </div>

      {/* Boutiques avec stock */}
      {boutiquesAvecStock.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {boutiquesAvecStock.map((b) => (
            <span
              key={b.id}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
              style={{ borderColor: "rgba(200,118,44,0.35)", backgroundColor: "rgba(200,118,44,0.08)", color: "var(--v-lime)" }}
            >
              📍 {b.nom}{b.ville ? ` — ${b.ville}` : ""}
            </span>
          ))}
        </div>
      )}

      {/* Prix */}
      <div className="mt-5">
        {isPromo && prixPromo !== null ? (
          <div className="flex flex-col gap-1">
            <span
              className="[font-family:var(--font-mono)] text-lg line-through"
              style={{ color: "var(--v-dim)" }}
            >
              {prix.toLocaleString("fr-FR")} FCFA
            </span>
            <span
              className="[font-family:var(--font-mono)] font-black"
              style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "var(--v-lime)" }}
            >
              {prixPromo.toLocaleString("fr-FR")}
              <span
                className="ml-1.5 [font-family:var(--font-body)] text-lg font-normal"
                style={{ color: "var(--v-muted)" }}
              >
                FCFA
              </span>
            </span>
          </div>
        ) : (
          <span
            className="[font-family:var(--font-mono)] font-black"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "var(--v-lime)" }}
          >
            {prix.toLocaleString("fr-FR")}
            <span
              className="ml-1.5 [font-family:var(--font-body)] text-lg font-normal"
              style={{ color: "var(--v-muted)" }}
            >
              FCFA
            </span>
          </span>
        )}
      </div>

      {/* Description */}
      {produit.description && (
        <p
          className="mt-5 text-sm leading-relaxed"
          style={{ color: "var(--v-muted)" }}
        >
          {produit.description}
        </p>
      )}
    </div>
  );
}
