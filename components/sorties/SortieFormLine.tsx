"use client";

import { Button, Input } from "@heroui/react";
import { QuantiteInput } from "@/components/common/QuantiteInput";
import { formatQuantite, isVarianteUnique } from "@/lib/unites";
import { cn } from "@/lib/utils";
import { NatureProduit, type Unite } from "@/types";
export interface SortieFormLineData {
  varianteId: string;
  produitNom: string;
  taille: string;
  couleur: string;
  quantiteStock: number;
  quantite: number;
  prixUnitaire: string;
  unite: Unite;
  nature: NatureProduit;
  /** Friperie : pièce unique, quantité fixée à 1. */
  pieceUnique: boolean;
}

interface SortieFormLineProps {
  line: SortieFormLineData;
  index: number;
  onPickVariante: () => void;
  onChange: (index: number, field: "quantite" | "prixUnitaire", value: string | number) => void;
  onRemove: (index: number) => void;
}

export function SortieFormLine({ line, index, onPickVariante, onChange, onRemove }: SortieFormLineProps) {
  const sousTotal = (line.quantite * parseFloat(line.prixUnitaire || "0")).toFixed(0);
  const plat = line.nature === NatureProduit.PLAT;
  const unique = isVarianteUnique(line);

  return (
    <div className="grid grid-cols-[1fr_70px_90px_32px] items-center gap-1.5 rounded-lg border border-border/60 bg-[var(--color-surface-high)] px-3 py-2 sm:grid-cols-[1fr_80px_100px_80px_32px] sm:gap-2">
      {/* Produit / variante */}
      <button
        type="button"
        className="flex flex-col items-start text-left"
        onClick={onPickVariante}
        aria-label="Changer l'article"
      >
        <span className="text-sm font-medium text-text">{line.produitNom}</span>
        <span className="font-mono text-xs text-text-muted">
          {!unique && `${line.taille} · ${line.couleur}`}
          {plat ? (
            <span className={unique ? "" : "ml-2"}>préparé à la commande</span>
          ) : (
            <span className={cn("text-[var(--color-out)]", !unique && "ml-2")}>
              stock : {formatQuantite(line.quantiteStock, line.unite)}
            </span>
          )}
        </span>
      </button>

      {/* Quantité : entière ou décimale selon l'unité ; un plat n'est pas plafonné par un stock ; une pièce unique vaut 1 */}
      {line.pieceUnique ? (
        <span className="text-center text-xs text-text-muted" aria-label={`Quantité ligne ${index + 1} : 1, pièce unique`}>
          1 · unique
        </span>
      ) : (
        <QuantiteInput
          value={line.quantite}
          unite={line.unite}
          max={plat ? undefined : line.quantiteStock}
          onChange={(q) => onChange(index, "quantite", q)}
          ariaLabel={`Quantité ligne ${index + 1}`}
        />
      )}

      {/* Prix unitaire */}
      <Input
        type="number"
        size="sm"
        variant="bordered"
        min={0}
        step="0.01"
        value={line.prixUnitaire}
        onChange={(e) => onChange(index, "prixUnitaire", e.target.value)}
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
