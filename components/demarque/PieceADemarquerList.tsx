"use client";

import Link from "next/link";
import { Checkbox } from "@heroui/react";
import { PrixDemarque } from "@/components/common/PrixDemarque";
import { libelleChoix, nomBalle } from "@/lib/balles";
import { formatCurrency } from "@/lib/formatCurrency";
import type { PieceADemarquer } from "@/types";

interface PieceADemarquerListProps {
  pieces: PieceADemarquer[];
  selection: ReadonlySet<string>;
  onBasculer: (id: string) => void;
  onToutBasculer: (tout: boolean) => void;
  /** Prix après démarque des pièces choisies (absent : pas de baisse prévue). */
  apercu: ReadonlyMap<string, number>;
  /** Cases à cocher seulement pour qui peut démarquer. */
  selectionnable: boolean;
}

/** Les pièces qui attendent en rayon, la plus ancienne en tête. */
export function PieceADemarquerList({ pieces, selection, onBasculer, onToutBasculer, apercu, selectionnable }: PieceADemarquerListProps) {
  const toutes = pieces.length > 0 && pieces.every((p) => selection.has(p.id));
  const aucune = pieces.every((p) => !selection.has(p.id));

  return (
    <section aria-labelledby="pieces-demarque-titre" className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <h2 id="pieces-demarque-titre" className="font-semibold text-text">
          Pièces qui attendent
        </h2>
        {selectionnable && (
          <Checkbox
            isSelected={toutes}
            isIndeterminate={!toutes && !aucune}
            onValueChange={(v) => onToutBasculer(v)}
            classNames={{ label: "text-sm text-text-muted" }}
          >
            Tout choisir
          </Checkbox>
        )}
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface" aria-label="Pièces à démarquer">
        {pieces.map((p) => {
          const choisie = selection.has(p.id);
          const nouveau = apercu.get(p.id);
          const details = [p.sku, p.balle ? nomBalle(p.balle) : null, libelleChoix(p.choix)].filter(Boolean).join(" · ");
          return (
            <li key={p.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 px-3 py-3 sm:px-4">
              {selectionnable ? (
                <Checkbox isSelected={choisie} onValueChange={() => onBasculer(p.id)} aria-label={`Choisir ${p.nom}`} />
              ) : (
                <span aria-hidden />
              )}
              <span className="min-w-0">
                <Link
                  href={`/produits/${p.id}`}
                  className="block truncate font-medium text-text underline-offset-2 hover:underline focus-visible:outline-accent"
                >
                  {p.nom}
                </Link>
                <span className="block truncate text-xs text-text-muted">{details}</span>
                <span className="block text-xs text-return-text">
                  En rayon depuis {p.joursEnRayon} j
                  {(p.nbDemarques ?? 0) > 0 && ` · déjà démarquée ${p.nbDemarques === 1 ? "une fois" : `${p.nbDemarques} fois`}`}
                </span>
              </span>
              <span className="flex flex-col items-end gap-0.5">
                <PrixDemarque produit={p} />
                {choisie && nouveau !== undefined && (
                  <span className="tabular text-xs font-semibold text-in-text">
                    <span className="sr-only">Nouveau prix </span>→ {formatCurrency(nouveau)}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
