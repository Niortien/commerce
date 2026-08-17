"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@heroui/react";
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

  // Saisie libre : local state permet d'effacer et retaper sans blocage
  const [qtyInput, setQtyInput] = useState(String(line.quantite));

  useEffect(() => {
    setQtyInput(String(line.quantite));
  }, [line.quantite]);

  const handleQtyChange = (val: string) => {
    if (/^\d*$/.test(val)) setQtyInput(val);
  };

  const handleQtyBlur = () => {
    const n = parseInt(qtyInput, 10);
    if (isNaN(n) || n < 1) {
      onChange(index, "quantite", 1);
      setQtyInput("1");
    } else {
      onChange(index, "quantite", n);
      setQtyInput(String(n));
    }
  };

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
      <button
        type="button"
        className="flex flex-col items-start text-left"
        onClick={handleRowClick}
        aria-label={line.isNew ? "Modifier le nouveau produit" : "Changer la variante"}
      >
        <span className="flex items-center gap-1.5 text-sm font-medium text-text">
          {line.produitNom}
          {line.isNew && (
            <span className="rounded bg-in/20 px-1 py-0.5 [font-family:var(--font-mono)] text-[9px] font-bold uppercase tracking-wide text-in">
              NOUVEAU
            </span>
          )}
        </span>
        <span className="font-[var(--font-mono)] text-xs text-text-muted">
          {line.taille} · {line.couleur}
        </span>
      </button>

      {/* Quantité — saisie libre, validation au blur */}
      <Input
        inputMode="numeric"
        size="sm"
        variant="bordered"
        value={qtyInput}
        onValueChange={handleQtyChange}
        onBlur={handleQtyBlur}
        classNames={{ input: "text-center font-[var(--font-mono)] text-sm" }}
        aria-label={`Quantité ligne ${index + 1}`}
      />

      {/* Prix unitaire */}
      <Input
        inputMode="decimal"
        size="sm"
        variant="bordered"
        value={line.prixUnitaire}
        onValueChange={(val) => onChange(index, "prixUnitaire", val)}
        endContent={<span className="text-[10px] text-text-muted">FCFA</span>}
        classNames={{ input: "font-[var(--font-mono)] text-sm" }}
        aria-label={`Prix unitaire ligne ${index + 1}`}
      />

      {/* Sous-total — masqué sur mobile */}
      <span className="hidden text-right font-[var(--font-mono)] text-xs text-text-muted sm:block">
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
