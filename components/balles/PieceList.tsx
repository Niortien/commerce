"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { IconTrash } from "@tabler/icons-react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { PrixDemarque } from "@/components/common/PrixDemarque";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { StatusChip } from "@/components/common/StatusChip";
import { useRetirerPiece } from "@/features/balles/mutation/balles-mutations";
import { estEnRayon, libelleChoix } from "@/lib/balles";
import type { Produit } from "@/types";

type Filtre = "TOUTES" | "EN_RAYON" | "VENDUES";

interface PieceListProps {
  balleId: string;
  pieces: Produit[];
}

/** Les pièces sorties de la balle, la plus récente en tête. Une pièce en rayon peut encore être retirée. */
export function PieceList({ balleId, pieces }: PieceListProps) {
  const [filtre, setFiltre] = useState<Filtre>("TOUTES");
  const [aRetirer, setARetirer] = useState<Produit | null>(null);
  const retirer = useRetirerPiece(balleId);

  const nbEnRayon = pieces.filter(estEnRayon).length;
  const filtres: Array<{ key: Filtre; label: string }> = [
    { key: "TOUTES", label: `Toutes (${pieces.length})` },
    { key: "EN_RAYON", label: `En rayon (${nbEnRayon})` },
    { key: "VENDUES", label: `Vendues (${pieces.length - nbEnRayon})` },
  ];
  const visibles = pieces.filter((p) =>
    filtre === "TOUTES" ? true : filtre === "EN_RAYON" ? estEnRayon(p) : !estEnRayon(p)
  );

  return (
    <section aria-labelledby="pieces-titre" className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="pieces-titre" className="font-semibold text-text">
          Pièces de la balle
        </h2>
        {pieces.length > 0 && (
          <SegmentedControl ariaLabel="Filtrer les pièces" options={filtres} value={filtre} onChange={setFiltre} />
        )}
      </div>

      {pieces.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-text-muted">
          Aucune pièce encore. Sortez-les de la balle une à une avec le formulaire ci-dessus.
        </p>
      ) : visibles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-8 text-center text-sm text-text-muted">
          {filtre === "EN_RAYON" ? "Toutes les pièces de cette balle sont vendues." : "Aucune pièce vendue pour l'instant."}
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface" aria-label="Pièces">
          {visibles.map((p) => {
            const enRayon = estEnRayon(p);
            return (
              <li key={p.id} className="grid grid-cols-[1fr_auto_2.75rem] items-center gap-x-3 px-3 py-3 sm:grid-cols-[auto_1fr_auto_2.75rem] sm:px-4">
                {/* Sur mobile, le code passe sous le nom pour lui laisser la largeur. */}
                <span className="tabular hidden rounded-md bg-surface-high px-2 py-1 text-center font-mono text-xs text-text sm:block">{p.sku}</span>
                <span className="min-w-0">
                  <Link
                    href={`/produits/${p.id}`}
                    className="block truncate font-medium text-text underline-offset-2 hover:underline focus-visible:outline-accent"
                  >
                    {p.nom}
                  </Link>
                  <span className="block truncate text-xs text-text-muted">
                    <span className="font-mono sm:hidden">{p.sku} · </span>
                    {p.categorie?.nom ?? "Sans rayon"}
                    {libelleChoix(p.choix) && ` · ${libelleChoix(p.choix)}`}
                  </span>
                </span>
                <span className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
                  <PrixDemarque produit={p} />
                  <StatusChip label={enRayon ? "En rayon" : "Vendue"} tone={enRayon ? "in" : "neutral"} />
                </span>
                <span>
                  {enRayon && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="min-h-11 min-w-11 text-text-muted"
                      aria-label={`Retirer ${p.nom} de la balle`}
                      onPress={() => setARetirer(p)}
                    >
                      <IconTrash size={16} aria-hidden />
                    </Button>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmModal
        isOpen={aRetirer !== null}
        onClose={() => setARetirer(null)}
        onConfirm={async () => {
          if (!aRetirer) return;
          await retirer.mutateAsync(aRetirer.id);
          setARetirer(null);
        }}
        title="Retirer cette pièce ?"
        message={`« ${aRetirer?.nom ?? ""} » (${aRetirer?.sku ?? ""}) sort de la balle et du rayon. Le coût de la balle se répartit sur les pièces restantes.`}
        confirmLabel="Retirer la pièce"
        isLoading={retirer.isPending}
        danger
      />
    </section>
  );
}
