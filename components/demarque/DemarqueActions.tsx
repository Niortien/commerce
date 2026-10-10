"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { IconDiscount } from "@tabler/icons-react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { TAUX_DEMARQUE } from "@/lib/balles";
import { formatCurrency } from "@/lib/formatCurrency";
import type { ModeDemarque } from "@/types";

/** Un taux de TAUX_DEMARQUE (« 30 ») ou « PRIX » pour un prix fixe. */
export type CleBaisse = string;

export const OPTIONS_BAISSE: Array<{ key: CleBaisse; label: string }> = [
  ...TAUX_DEMARQUE.map((t) => ({ key: String(t), label: `−${t} %` })),
  { key: "PRIX", label: "Prix fixe" },
];

/** Traduit le choix de l'écran en demande au serveur ; null tant que le prix fixe n'est pas saisi. */
export function regleDe(cle: CleBaisse, prixFixe: string): { mode: ModeDemarque; valeur: number } | null {
  if (cle !== "PRIX") return { mode: "POURCENTAGE", valeur: Number(cle) };
  const prix = Number(prixFixe);
  return /^\d+$/.test(prixFixe) && prix > 0 ? { mode: "PRIX", valeur: prix } : null;
}

interface DemarqueActionsProps {
  baisse: CleBaisse;
  onBaisse: (cle: CleBaisse) => void;
  prixFixe: string;
  onPrixFixe: (prix: string) => void;
  /** Pièces dont le prix baissera vraiment. */
  nbConcernees: number;
  totalAvant: number;
  totalApres: number;
  enCours: boolean;
  onAppliquer: () => Promise<void>;
}

/** Comment baisser (−20 %, −30 %, −50 % ou un prix fixe), l'effet sur le rayon, puis la confirmation. */
export function DemarqueActions({
  baisse,
  onBaisse,
  prixFixe,
  onPrixFixe,
  nbConcernees,
  totalAvant,
  totalApres,
  enCours,
  onAppliquer,
}: DemarqueActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pluriel = nbConcernees > 1 ? "s" : "";

  return (
    <section aria-labelledby="baisse-titre" className="rounded-xl border border-border bg-surface p-4 md:p-5">
      <h2 id="baisse-titre" className="mb-3 font-semibold text-text">
        Baisser le prix
      </h2>
      <div className="flex flex-col gap-3 md:flex-row md:items-start">
        <SegmentedControl ariaLabel="Baisse à appliquer" options={OPTIONS_BAISSE} value={baisse} onChange={onBaisse} tone="return" />
        {baisse === "PRIX" && (
          <Input
            label="Nouveau prix"
            inputMode="numeric"
            variant="bordered"
            size="sm"
            value={prixFixe}
            onValueChange={(v) => /^\d*$/.test(v) && onPrixFixe(v)}
            endContent={<span className="text-xs text-text-muted">FCFA</span>}
            description="Arrondi aux 50 F. Une pièce déjà moins chère ne change pas."
            className="md:max-w-56"
          />
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted" aria-live="polite">
          {nbConcernees === 0 ? (
            "Choisissez des pièces dont le prix baissera."
          ) : (
            <>
              {nbConcernees} pièce{pluriel} :{" "}
              <span className="tabular text-text line-through">{formatCurrency(totalAvant)}</span>{" "}
              <span className="tabular font-semibold text-in-text">→ {formatCurrency(totalApres)}</span>
            </>
          )}
        </p>
        <Button
          className="min-h-11 bg-return font-semibold text-white"
          startContent={<IconDiscount size={18} aria-hidden />}
          isDisabled={nbConcernees === 0}
          onPress={() => setConfirmOpen(true)}
        >
          Démarquer{nbConcernees > 0 ? ` (${nbConcernees})` : ""}
        </Button>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await onAppliquer();
          setConfirmOpen(false);
        }}
        title={`Démarquer ${nbConcernees} pièce${pluriel} ?`}
        message={`Leur prix passe de ${formatCurrency(totalAvant)} à ${formatCurrency(totalApres)} au total. Le prix d'origine reste noté sur chaque pièce.`}
        confirmLabel="Démarquer"
        isLoading={enCours}
      />
    </section>
  );
}
