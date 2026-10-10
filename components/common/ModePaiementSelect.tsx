"use client";

import { Select, SelectItem } from "@heroui/react";
import { MODES_PAIEMENT, MODE_PAIEMENT_LABELS, isModePaiement } from "@/lib/credit";
import type { ModePaiement } from "@/types";

interface ModePaiementSelectProps {
  value: ModePaiement;
  onChange: (mode: ModePaiement) => void;
  label?: string;
  className?: string;
}

/** Choix compact du moyen de paiement (acompte, règlement d'un client). */
export function ModePaiementSelect({ value, onChange, label = "Payé en", className }: ModePaiementSelectProps) {
  return (
    <Select
      label={label}
      variant="bordered"
      size="sm"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const cle = String(Array.from(keys)[0] ?? "");
        if (isModePaiement(cle)) onChange(cle);
      }}
      className={className}
    >
      {MODES_PAIEMENT.map((m) => (
        <SelectItem key={m}>{MODE_PAIEMENT_LABELS[m]}</SelectItem>
      ))}
    </Select>
  );
}
