"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { FlowTag } from "@/components/common/FlowTag";
import { useSortie } from "@/features/sorties/query/sorties-queries";
import { ModePaiement, TypeSortie } from "@/types";
import type { Sortie } from "@/types";
import { RecuPrint, type RecuLigne } from "./RecuPrint";

const TYPE_LABELS: Record<TypeSortie, string> = {
  VENTE: "Vente",
  PERTE: "Perte",
  DON: "Don",
  RETOUR_FOURNISSEUR: "Retour fournisseur",
  DEPENSE: "Dépense",
};

interface SortieFeedItemProps {
  sortie: Sortie;
  onCancel: (id: string) => void;
}

export function SortieFeedItem({ sortie, onCancel }: SortieFeedItemProps) {
  const [reprintOpen, setReprintOpen] = useState(false);
  const [fetchRecu, setFetchRecu] = useState(false);

  const { data: detail, isLoading: detailLoading } = useSortie(
    fetchRecu ? sortie.id : ""
  );

  const handleReprint = () => {
    if (!fetchRecu) {
      setFetchRecu(true);
      return;
    }
    if (detail?.data) setReprintOpen(true);
  };

  // Ouvre le modal dès que le détail arrive après la première demande
  if (fetchRecu && detail?.data && !reprintOpen && !detailLoading) {
    setReprintOpen(true);
  }

  const recuDetail = detail?.data;
  const recuLignes: RecuLigne[] = (recuDetail?.lignes ?? []).map((l) => ({
    produitNom: l.variante?.produit?.nom ?? "Produit",
    taille: String(l.variante?.taille ?? "—"),
    couleur: l.variante?.couleur ?? "—",
    quantite: l.quantite,
    prixUnitaire: l.prixUnitaire,
    sousTotal: (l.quantite * parseFloat(l.prixUnitaire || "0")).toFixed(0),
  }));

  const isVente = sortie.type === TypeSortie.VENTE;
  const isAnnulee = sortie.notes?.includes("[ANNULEE]") ?? false;

  return (
    <>
      {recuDetail && (
        <RecuPrint
          isOpen={reprintOpen}
          onClose={() => setReprintOpen(false)}
          reference={recuDetail.reference}
          date={recuDetail.createdAt}
          lignes={recuLignes}
          totalMontant={recuDetail.totalMontant}
          modePaiement={
            recuDetail.transaction?.modePaiement ??
            sortie.transaction?.modePaiement ??
            ModePaiement.CASH
          }
          transactionReference={recuDetail.transaction?.reference ?? undefined}
        />
      )}

      <article
        className={[
          "rounded-lg border p-3 transition",
          isAnnulee
            ? "border-border/40 bg-[var(--color-surface-high)] opacity-50"
            : "border-border/80 bg-[linear-gradient(145deg,rgba(255,77,109,0.10),rgba(34,54,81,0.72))] hover:border-[var(--color-out)]/50 hover:shadow-md",
        ].join(" ")}
      >
        {/* Type + date */}
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlowTag type={isVente ? "vente" : "sortie"} />
            <span className="text-xs font-medium text-text-muted">
              {TYPE_LABELS[sortie.type]}
            </span>
            {isAnnulee && (
              <span className="rounded bg-[color:rgba(255,77,109,0.15)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-out)]">
                Annulée
              </span>
            )}
          </div>
          <span className="text-xs text-text-muted">
            {formatDistanceToNow(new Date(sortie.createdAt), {
              addSuffix: true,
              locale: fr,
            })}
          </span>
        </div>

        {/* Référence + notes */}
        <p className="font-[var(--font-mono)] text-xs text-text-muted">
          {sortie.reference}
        </p>
        {sortie.notes && !sortie.notes.includes("[ANNULEE]") && (
          <p className="mt-0.5 truncate text-xs italic text-text-muted">
            {sortie.notes}
          </p>
        )}

        {/* Montant */}
        <div className="mt-2">
          <CurrencyDisplay
            montant={sortie.totalMontant}
            tone={isVente ? "cash" : "out"}
            size="lg"
          />
        </div>

        {/* Actions */}
        {!isAnnulee && (
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant="flat"
              className="bg-[color:rgba(255,77,109,0.12)] text-[var(--color-out)]"
              onPress={() => onCancel(sortie.id)}
            >
              Annuler
            </Button>
            {isVente && (
              <Button
                size="sm"
                variant="flat"
                className="bg-[color:rgba(74,122,255,0.12)] text-accent"
                isLoading={detailLoading && fetchRecu}
                onPress={handleReprint}
              >
                🖨 Reçu
              </Button>
            )}
          </div>
        )}
      </article>
    </>
  );
}
