"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@heroui/react";
export interface SortieFormLineData {
  varianteId: string;
  produitNom: string;
  taille: string;
  couleur: string;
  quantiteStock: number;
  quantite: number;
  prixUnitaire: string;
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
    } else if (n > line.quantiteStock) {
      onChange(index, "quantite", line.quantiteStock);
      setQtyInput(String(line.quantiteStock));
    } else {
      onChange(index, "quantite", n);
      setQtyInput(String(n));
    }
  };

  return (
    <div className="grid grid-cols-[1fr_70px_90px_32px] items-center gap-1.5 rounded-lg border border-border/60 bg-[var(--color-surface-high)] px-3 py-2 sm:grid-cols-[1fr_80px_100px_80px_32px] sm:gap-2">
      {/* Produit / variante */}
      <button
        type="button"
        className="flex flex-col items-start text-left"
        onClick={onPickVariante}
        aria-label="Changer la variante"
      >
        <span className="text-sm font-medium text-text">{line.produitNom}</span>
        <span className="font-[var(--font-mono)] text-xs text-text-muted">
          {line.taille} · {line.couleur}
          <span className="ml-2 text-[var(--color-out)]">stock: {line.quantiteStock}</span>
        </span>
      </button>

      {/* Quantité — saisie libre, validation au blur */}
      <Input
        size="sm"
        variant="bordered"
        inputMode="numeric"
        value={qtyInput}
        onValueChange={handleQtyChange}
        onBlur={handleQtyBlur}
        classNames={{ input: "text-center [font-family:var(--font-mono)] text-sm" }}
        aria-label={`Quantité ligne ${index + 1}`}
      />

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
