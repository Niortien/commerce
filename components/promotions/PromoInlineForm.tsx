"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import type { Produit } from "@/types";

export interface PromoFormData {
  prixPromo: string;
  dateDebutPromo: string | null;
  dateFinPromo: string | null;
}

interface PromoInlineFormProps {
  produit: Produit;
  onSave: (data: PromoFormData) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

export function PromoInlineForm({ produit, onSave, onCancel, isSaving }: PromoInlineFormProps) {
  const prixVente = parseFloat(produit.prixVente);

  const [prixPromoInput, setPrixPromoInput] = useState(
    produit.prixPromo ? String(Math.round(parseFloat(produit.prixPromo))) : ""
  );
  const [tauxInput, setTauxInput] = useState(() => {
    if (produit.prixPromo) {
      const taux = ((prixVente - parseFloat(produit.prixPromo)) / prixVente) * 100;
      return taux.toFixed(1);
    }
    return "";
  });
  const [dateDebut, setDateDebut] = useState(
    produit.dateDebutPromo ? produit.dateDebutPromo.slice(0, 10) : ""
  );
  const [dateFin, setDateFin] = useState(
    produit.dateFinPromo ? produit.dateFinPromo.slice(0, 10) : ""
  );

  const prixPromoNum = parseFloat(prixPromoInput || "0");
  const isInvalid = prixPromoInput !== "" && (prixPromoNum <= 0 || prixPromoNum >= prixVente);
  const economie = prixPromoInput !== "" && !isInvalid ? prixVente - prixPromoNum : null;

  function handlePrixChange(val: string) {
    if (!/^\d*$/.test(val)) return;
    setPrixPromoInput(val);
    const n = parseFloat(val || "0");
    if (n > 0 && n < prixVente) {
      setTauxInput(((( prixVente - n) / prixVente) * 100).toFixed(1));
    } else {
      setTauxInput("");
    }
  }

  function handleTauxChange(val: string) {
    if (!/^\d*\.?\d*$/.test(val)) return;
    setTauxInput(val);
    const t = parseFloat(val || "0");
    if (t > 0 && t < 100) {
      setPrixPromoInput(String(Math.round(prixVente * (1 - t / 100))));
    } else {
      setPrixPromoInput("");
    }
  }

  async function handleSave() {
    if (isInvalid || !prixPromoInput) return;
    await onSave({
      prixPromo: prixPromoNum.toFixed(2),
      dateDebutPromo: dateDebut || null,
      dateFinPromo: dateFin || null,
    });
  }

  return (
    <div className="mt-2 rounded-xl border border-accent/30 bg-[color:rgba(74,122,255,0.06)] p-3 space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Input
          variant="bordered"
          label="Prix promo"
          placeholder="0"
          value={prixPromoInput}
          onValueChange={handlePrixChange}
          inputMode="numeric"
          size="sm"
          endContent={<span className="shrink-0 text-xs text-text-dim">FCFA</span>}
          isInvalid={isInvalid}
          errorMessage={isInvalid ? "Doit être inférieur au prix normal" : undefined}
        />
        <Input
          variant="bordered"
          label="Réduction"
          placeholder="0.0"
          value={tauxInput}
          onValueChange={handleTauxChange}
          inputMode="decimal"
          size="sm"
          endContent={<span className="shrink-0 text-xs text-text-dim">%</span>}
        />
      </div>

      {economie !== null && (
        <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface)] px-3 py-2">
          <span className="text-xs text-text-muted">Économie client</span>
          <span className="[font-family:var(--font-mono)] text-sm font-bold text-[var(--color-in)]">
            {economie.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Input
          variant="bordered"
          label="Début (optionnel)"
          type="date"
          value={dateDebut}
          onValueChange={setDateDebut}
          size="sm"
        />
        <Input
          variant="bordered"
          label="Fin (optionnel)"
          type="date"
          value={dateFin}
          onValueChange={setDateFin}
          size="sm"
        />
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="flat"
          className="flex-1 text-text-muted"
          onPress={onCancel}
          isDisabled={isSaving}
        >
          Annuler
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-[var(--color-cash)] font-semibold text-black"
          onPress={handleSave}
          isDisabled={isInvalid || !prixPromoInput}
          isLoading={isSaving}
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
