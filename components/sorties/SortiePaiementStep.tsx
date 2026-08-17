"use client";

import Image from "next/image";
import { Input } from "@heroui/react";
import { ModePaiement } from "@/types";

interface ModeCard {
  mode: ModePaiement;
  label: string;
  image?: string;
  icon?: string;
}

const MODE_CARDS: ModeCard[] = [
  { mode: ModePaiement.CASH,        label: "Espèces",       icon: "💵" },
  { mode: ModePaiement.WAVE,        label: "Wave",          image: "/images/paiement/wave.jpg" },
  { mode: ModePaiement.ORANGE_MONEY,label: "Orange Money",  image: "/images/paiement/orange-money.jpg" },
  { mode: ModePaiement.MTN_MONEY,   label: "MTN",           image: "/images/paiement/mtn.jpg" },
  { mode: ModePaiement.CARTE,       label: "Carte",         icon: "💳" },
];

export interface SortiePaiementStepProps {
  totalMontant: string;
  totalAvantRemise?: string;
  remiseMontant?: string;
  selected: ModePaiement | null;
  onSelect: (mode: ModePaiement) => void;
  reference: string;
  onChangeReference: (v: string) => void;
  notes: string;
  onChangeNotes: (v: string) => void;
  montantRecu: string;
  onChangeMontantRecu: (v: string) => void;
}

export function SortiePaiementStep({
  totalMontant,
  totalAvantRemise,
  remiseMontant,
  selected,
  onSelect,
  reference,
  onChangeReference,
  notes,
  onChangeNotes,
  montantRecu,
  onChangeMontantRecu,
}: SortiePaiementStepProps) {
  const total = parseFloat(totalMontant || "0");
  const recu = parseFloat(montantRecu || "0");
  const montantInsuffisant = montantRecu !== "" && recu < total;
  const monnaieRendue = recu - total;
  const showRemise = !!remiseMontant && parseFloat(remiseMontant) > 0;

  return (
    <div className="space-y-4">
      {/* Total — avec ou sans remise */}
      <div className="rounded-xl border border-[var(--color-cash)]/40 bg-[color:rgba(143,126,245,0.10)] p-4 text-center">
        {showRemise ? (
          <>
            <p className="text-xs text-text-dim line-through">
              {Number(totalAvantRemise).toLocaleString("fr-FR")} FCFA
            </p>
            <p className="text-xs text-[var(--color-in)]">
              − {Number(remiseMontant).toLocaleString("fr-FR")} FCFA de réduction
            </p>
            <p className="mt-1 font-[var(--font-display)] text-3xl text-[var(--color-cash)]">
              {Number(totalMontant).toLocaleString("fr-FR")} FCFA
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wide text-text-muted">À encaisser</p>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-wide text-text-muted">Montant à encaisser</p>
            <p className="mt-1 font-[var(--font-display)] text-3xl text-[var(--color-cash)]">
              {Number(totalMontant).toLocaleString("fr-FR")} FCFA
            </p>
          </>
        )}
      </div>

      {/* Mode de paiement — 5 colonnes compactes sur mobile */}
      <div>
        <p className="mb-2.5 text-xs uppercase tracking-wide text-text-muted">Mode de paiement</p>
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
          {MODE_CARDS.map((card) => (
            <button
              key={card.mode}
              type="button"
              onClick={() => onSelect(card.mode)}
              className={[
                "flex flex-col items-center gap-1.5 rounded-xl border-2 px-1 py-2.5 transition-all",
                selected === card.mode
                  ? "border-accent bg-[color:rgba(74,122,255,0.15)] ring-2 ring-accent ring-offset-1 ring-offset-[var(--color-surface)]"
                  : "border-border/60 bg-[var(--color-surface-high)] hover:border-accent/40",
              ].join(" ")}
              aria-pressed={selected === card.mode}
            >
              {card.image ? (
                <div className="h-7 w-full overflow-hidden rounded-md">
                  <Image
                    src={card.image}
                    alt={card.label}
                    width={56}
                    height={28}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <span className="text-xl leading-none">{card.icon}</span>
              )}
              <span className="text-[9px] font-medium leading-tight text-text">{card.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Champs espèces — montant reçu + monnaie rendue */}
      {selected === ModePaiement.CASH && (
        <div className="space-y-2 rounded-xl border border-border/60 bg-[var(--color-surface-high)] p-3">
          <Input
            variant="bordered"
            label="Montant reçu du client"
            placeholder="0"
            value={montantRecu}
            onValueChange={onChangeMontantRecu}
            inputMode="numeric"
            size="sm"
            endContent={<span className="shrink-0 text-xs text-text-dim">FCFA</span>}
            isInvalid={montantInsuffisant}
            errorMessage={montantInsuffisant ? "Montant insuffisant" : undefined}
          />
          {montantRecu !== "" && !montantInsuffisant && (
            <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface)] px-3 py-2">
              <span className="text-xs text-text-muted">Monnaie à rendre</span>
              <span className="[font-family:var(--font-mono)] text-sm font-bold text-[var(--color-in)]">
                {monnaieRendue.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
          )}
        </div>
      )}

      {/* Champs optionnels */}
      <div className="space-y-2">
        <Input
          variant="bordered"
          placeholder="Référence transaction (optionnel)"
          value={reference}
          onValueChange={onChangeReference}
          size="sm"
        />
        <Input
          variant="bordered"
          placeholder="Notes (optionnel)"
          value={notes}
          onValueChange={onChangeNotes}
          size="sm"
        />
      </div>
    </div>
  );
}
