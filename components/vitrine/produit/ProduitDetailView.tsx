"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useVitrineProduit } from "@/features/vitrine/query/vitrine-queries";
import { Taille } from "@/types";
import { ProduitGallery } from "./ProduitGallery";
import { ProduitInfo } from "./ProduitInfo";
import { ProduitVariantesSection } from "./ProduitVariantesSection";
import { ProduitOrderPanel } from "./ProduitOrderPanel";
import { ProduitCare } from "./ProduitCare";
import { ProduitRelated } from "./ProduitRelated";

interface ProduitDetailViewProps {
  id: string;
}

export function ProduitDetailView({ id }: ProduitDetailViewProps) {
  const { data, isLoading, isError } = useVitrineProduit(id);
  const [selectedTaille, setSelectedTaille] = useState<Taille | null>(null);
  const [selectedCouleur, setSelectedCouleur] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="h-12 w-12 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--v-lime)" }}
        />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5">
        <p className="text-5xl">¯\_(ツ)_/¯</p>
        <p className="text-sm" style={{ color: "var(--v-muted)" }}>Produit introuvable</p>
      </div>
    );
  }

  const produit = data.data;
  const variantes = produit.variantes ?? [];

  const totalStock = variantes.reduce((s, v) => s + v.quantiteStock, 0);

  const selectedVariante =
    selectedTaille && selectedCouleur
      ? variantes.find((v) => v.taille === selectedTaille && v.couleur === selectedCouleur) ?? null
      : null;

  const handleTailleChange = (t: Taille) => {
    setSelectedTaille(t);
    // Auto-select couleur if only one option for this taille
    const couleursForTaille = [...new Set(variantes.filter((v) => v.taille === t).map((v) => v.couleur))];
    if (couleursForTaille.length === 1) {
      setSelectedCouleur(couleursForTaille[0]);
    } else {
      setSelectedCouleur(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-5 pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--v-dim)" }}>
          <a href="/" className="hover:text-[var(--v-muted)] transition-colors">Accueil</a>
          {" / "}
          <a href="/catalogue" className="hover:text-[var(--v-muted)] transition-colors">Catalogue</a>
          {" / "}
          <span style={{ color: "var(--v-muted)" }}>{produit.nom}</span>
        </p>
      </div>

      {/* Contenu principal — 2 colonnes desktop */}
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Colonne gauche — Galerie (sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProduitGallery produit={produit} />
          </div>

          {/* Colonne droite — Info + Actions */}
          <div className="space-y-8">
            <ProduitInfo produit={produit} totalStock={totalStock} />

            <div
              className="h-px w-full"
              style={{ backgroundColor: "var(--v-border)" }}
            />

            <ProduitVariantesSection
              variantes={variantes}
              selectedTaille={selectedTaille}
              selectedCouleur={selectedCouleur}
              onTailleChange={handleTailleChange}
              onCouleurChange={setSelectedCouleur}
            />

            <ProduitOrderPanel produit={produit} variante={selectedVariante} />

            <ProduitCare />
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      {produit.categorieId && (
        <ProduitRelated categorieId={produit.categorieId} excludeId={produit.id} />
      )}
    </motion.div>
  );
}
