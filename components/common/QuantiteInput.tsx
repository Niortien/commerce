"use client";

import { useEffect, useState } from "react";
import { Input } from "@heroui/react";
import { UNITES, arrondiQuantite, isUniteEntiere, parseQuantite } from "@/lib/unites";
import { Unite } from "@/types";

interface QuantiteInputProps {
  value: number;
  unite: Unite;
  onChange: (quantite: number) => void;
  /** Plafond (stock disponible) ; aucun pour un plat préparé à la commande. */
  max?: number;
  ariaLabel: string;
  className?: string;
}

/**
 * Quantité selon l'unité : entière pour ce qui se compte (pièces, sacs), décimale pour ce qui
 * se mesure (12,5 m, 0,250 kg). Saisie libre, corrigée quand on quitte le champ.
 */
export function QuantiteInput({ value, unite, onChange, max, ariaLabel, className }: QuantiteInputProps) {
  const entiere = isUniteEntiere(unite);
  const minimum = entiere ? 1 : 0.001;
  const [saisie, setSaisie] = useState(String(value).replace(".", ","));

  useEffect(() => {
    setSaisie(String(value).replace(".", ","));
  }, [value]);

  const handleChange = (val: string) => {
    if (entiere ? /^\d*$/.test(val) : /^\d*[.,]?\d{0,3}$/.test(val)) setSaisie(val);
  };

  const handleBlur = () => {
    let n = parseQuantite(saisie);
    if (Number.isNaN(n) || n < minimum) n = minimum;
    if (entiere) n = Math.round(n);
    if (max !== undefined && n > max) n = max;
    n = arrondiQuantite(n);
    onChange(n);
    setSaisie(String(n).replace(".", ","));
  };

  return (
    <Input
      size="sm"
      variant="bordered"
      inputMode={entiere ? "numeric" : "decimal"}
      value={saisie}
      onValueChange={handleChange}
      onBlur={handleBlur}
      endContent={
        unite === Unite.PIECE ? undefined : <span className="text-[10px] text-text-muted">{UNITES[unite].singulier}</span>
      }
      classNames={{ input: "text-center [font-family:var(--font-mono)] text-sm" }}
      aria-label={ariaLabel}
      className={className}
    />
  );
}
