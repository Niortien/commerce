"use client";

import { TypeSortie } from "@/types";

interface TypeCard {
  type: TypeSortie;
  label: string;
  icon: string;
  description: string;
  color: string;
  requiresSession: boolean;
}

const TYPE_CARDS: TypeCard[] = [
  {
    type: TypeSortie.VENTE,
    label: "Vente",
    icon: "🛍",
    description: "Vente à un client. Enregistre un paiement en caisse.",
    color: "border-[var(--color-cash)] bg-[color:rgba(143,126,245,0.10)]",
    requiresSession: true,
  },
  {
    type: TypeSortie.PERTE,
    label: "Perte",
    icon: "⚠️",
    description: "Produit perdu, volé ou endommagé.",
    color: "border-[var(--color-out)] bg-[color:rgba(255,77,109,0.10)]",
    requiresSession: false,
  },
  {
    type: TypeSortie.DON,
    label: "Don",
    icon: "🎁",
    description: "Produit offert sans contrepartie.",
    color: "border-[var(--color-return)] bg-[color:rgba(255,154,60,0.10)]",
    requiresSession: false,
  },
  {
    type: TypeSortie.RETOUR_FOURNISSEUR,
    label: "Retour fournisseur",
    icon: "↩",
    description: "Retour d'articles au fournisseur.",
    color: "border-[var(--color-in)] bg-[color:rgba(57,211,83,0.10)]",
    requiresSession: false,
  },
  {
    type: TypeSortie.DEPENSE,
    label: "Dépense",
    icon: "💸",
    description: "Argent sorti de la boutique (nourriture, don, frais divers...), sans produit.",
    color: "border-[var(--color-out)] bg-[color:rgba(255,154,60,0.10)]",
    requiresSession: false,
  },
];

interface SortieTypeStepProps {
  selected: TypeSortie | null;
  onSelect: (type: TypeSortie) => void;
}

export function SortieTypeStep({ selected, onSelect }: SortieTypeStepProps) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-wide text-text-muted">Type de sortie</p>
      <div className="grid grid-cols-2 gap-3">
        {TYPE_CARDS.map((card) => (
          <button
            key={card.type}
            type="button"
            onClick={() => onSelect(card.type)}
            className={[
              "rounded-xl border-2 p-4 text-left transition-all",
              card.color,
              selected === card.type
                ? "ring-2 ring-accent ring-offset-2 ring-offset-[var(--color-surface)]"
                : "hover:brightness-110",
            ].join(" ")}
            aria-pressed={selected === card.type}
          >
            <div className="mb-2 text-2xl">{card.icon}</div>
            <p className="font-semibold text-text">{card.label}</p>
            <p className="mt-1 text-xs text-text-muted">{card.description}</p>
            {card.requiresSession && (
              <p className="mt-2 text-[10px] text-[var(--color-cash)]">Session caisse requise</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
