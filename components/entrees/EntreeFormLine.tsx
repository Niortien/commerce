"use client";

import { Button, Input } from "@heroui/react";
import { QuantiteInput } from "@/components/common/QuantiteInput";
import { UNITES, arrondiQuantite, formatQuantite, isVarianteUnique } from "@/lib/unites";
import { Unite } from "@/types";
import type { NewProduitForEntree } from "@/features/entrees/api/entrees-api";

export interface EntreeFormLineData {
  varianteId?: string;
  newProduit?: NewProduitForEntree;
  isNew?: boolean;
  produitNom: string;
  taille: string;
  couleur: string;
  quantite: number;
  prixUnitaire: string;
  /** Hors vêtements : unité du produit et éventuel conditionnement d'achat (carton de 24…). */
  unite?: Unite;
  conditionnementUnite?: Unite | null;
  conditionnementQuantite?: number | null;
}

interface EntreeFormLineProps {
  line: EntreeFormLineData;
  index: number;
  onPickVariante: () => void;
  onEditNew?: () => void;
  onChange: (index: number, field: "quantite" | "prixUnitaire", value: string | number) => void;
  onRemove: (index: number) => void;
}

export function EntreeFormLine({ line, index, onPickVariante, onEditNew, onChange, onRemove }: EntreeFormLineProps) {
  const sousTotal = (line.quantite * parseFloat(line.prixUnitaire || "0")).toFixed(0);
  const unite = line.unite ?? Unite.PIECE;
  const unique = isVarianteUnique(line);
  const colis = line.conditionnementUnite && line.conditionnementQuantite
    ? { unite: line.conditionnementUnite, contenu: line.conditionnementQuantite }
    : null;

  const handleRowClick = () => {
    if (line.isNew && onEditNew) {
      onEditNew();
    } else {
      onPickVariante();
    }
  };

  return (
    <div className="grid grid-cols-[1fr_70px_90px_32px] items-center gap-1.5 rounded-lg border border-border/60 bg-[var(--color-surface-high)] px-3 py-2 sm:grid-cols-[1fr_80px_100px_80px_32px] sm:gap-2">
      {/* Produit / variante */}
      <div className="flex min-w-0 flex-col items-start gap-1">
        <button
          type="button"
          className="flex flex-col items-start text-left"
          onClick={handleRowClick}
          aria-label={line.isNew ? "Modifier le nouveau produit" : "Changer l'article"}
        >
          <span className="flex items-center gap-1.5 text-sm font-medium text-text">
            {line.produitNom}
            {line.isNew && (
              <span className="rounded bg-in/20 px-1 py-0.5 [font-family:var(--font-mono)] text-[9px] font-bold uppercase tracking-wide text-in">
                NOUVEAU
              </span>
            )}
          </span>
          <span className="font-mono text-xs text-text-muted">
            {unique ? `en ${UNITES[unite].pluriel}` : `${line.taille} · ${line.couleur}`}
          </span>
        </button>
        {/* Acheté en gros, vendu au détail : un clic ajoute le contenu d'un carton */}
        {colis && (
          <button
            type="button"
            onClick={() => onChange(index, "quantite", arrondiQuantite(line.quantite + colis.contenu))}
            className="rounded-md border border-dashed border-border px-2 py-1 text-[11px] font-medium text-text-muted transition-colors duration-150 hover:border-text-dim hover:text-text"
          >
            + 1 {UNITES[colis.unite].singulier} ({formatQuantite(colis.contenu, unite)})
          </button>
        )}
      </div>

      {/* Quantité : entière ou décimale selon l'unité */}
      <QuantiteInput
        value={line.quantite}
        unite={unite}
        onChange={(q) => onChange(index, "quantite", q)}
        ariaLabel={`Quantité ligne ${index + 1}`}
      />

      {/* Prix unitaire */}
      <Input
        inputMode="decimal"
        size="sm"
        variant="bordered"
        value={line.prixUnitaire}
        onValueChange={(val) => onChange(index, "prixUnitaire", val)}
        endContent={<span className="text-[10px] text-text-muted">FCFA</span>}
        classNames={{ input: "font-mono text-sm" }}
        aria-label={`Prix unitaire ligne ${index + 1}`}
      />

      {/* Sous-total — masqué sur mobile */}
      <span className="hidden text-right font-mono text-xs text-text-muted sm:block">
        {Number(sousTotal).toLocaleString("fr-FR")}
      </span>

      {/* Supprimer */}
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="text-out"
        onPress={() => onRemove(index)}
        aria-label="Supprimer cette ligne"
      >
        ✕
      </Button>
    </div>
  );
}
