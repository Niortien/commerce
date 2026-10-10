"use client";

import { Button } from "@heroui/react";
import { PRIX_RONDS } from "@/lib/balles";
import { cn } from "@/lib/utils";

interface PrixRapidesProps {
  /** Prix saisi (texte du champ), pour marquer le bouton correspondant. */
  valeur: string;
  onChoisir: (prix: number) => void;
  className?: string;
}

/** En friperie on étiquette à prix ronds : un appui remplit le prix de la pièce. */
export function PrixRapides({ valeur, onChoisir, className }: PrixRapidesProps) {
  return (
    <div role="group" aria-label="Prix ronds" className={cn("grid grid-cols-4 gap-2 sm:flex sm:flex-wrap", className)}>
      {PRIX_RONDS.map((prix) => {
        const actif = valeur === String(prix);
        return (
          <Button
            key={prix}
            size="sm"
            variant={actif ? "solid" : "bordered"}
            aria-pressed={actif}
            className={cn("tabular min-h-11 min-w-0 px-1 font-semibold sm:min-w-16 sm:px-3", actif && "bg-accent text-white")}
            onPress={() => onChoisir(prix)}
          >
            {prix.toLocaleString("fr-FR")}
          </Button>
        );
      })}
    </div>
  );
}
