"use client";

import { MODE_PAIEMENT_LABELS } from "@/lib/credit";
import { formatDateCourte } from "@/lib/devis";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";
import { TypeOperationCredit, type OperationCredit } from "@/types";

interface ClientReleveProps {
  operations: OperationCredit[];
}

function libelle(o: OperationCredit): string {
  switch (o.type) {
    case TypeOperationCredit.VENTE:
      return o.sortie ? `Vente ${o.sortie.reference}` : "Vente à crédit";
    case TypeOperationCredit.ANNULATION:
      return o.sortie ? `Vente ${o.sortie.reference} annulée` : "Vente annulée";
    default:
      return o.modePaiement ? `Règlement · ${MODE_PAIEMENT_LABELS[o.modePaiement]}` : "Règlement";
  }
}

/** Relevé de compte, la plus récente en tête : ce que le client a pris, payé, et ce qu'il devait ensuite. */
export function ClientReleve({ operations }: ClientReleveProps) {
  return (
    <section aria-labelledby="releve-titre" className="flex flex-col gap-2">
      <h2 id="releve-titre" className="font-semibold text-text">
        Relevé de compte
      </h2>
      {operations.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-text-muted">
          Aucune opération. Ses ventes à crédit et ses règlements apparaîtront ici.
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface" aria-label="Opérations du compte">
          {operations.map((o) => {
            const dette = o.type === TypeOperationCredit.VENTE;
            return (
              <li key={o.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 px-4 py-3">
                <span className="min-w-0">
                  <span className="block truncate font-medium text-text">{libelle(o)}</span>
                  <span className="block text-xs text-text-muted">
                    {formatDateCourte(o.createdAt)}
                    {dette && o.echeance && ` · à payer avant le ${formatDateCourte(o.echeance)}`}
                    {!dette && o.notes && o.type === TypeOperationCredit.REGLEMENT && o.notes !== "Règlement" && ` · ${o.notes}`}
                  </span>
                </span>
                <span className="text-right">
                  <span className={cn("tabular block font-semibold", dette ? "text-text" : "text-in-text")}>
                    <span className="sr-only">{dette ? "Doit en plus" : "Payé ou annulé"} </span>
                    {dette ? "+" : "−"} {formatCurrency(o.montant)}
                  </span>
                  <span className="tabular block text-xs text-text-muted">solde {formatCurrency(o.soldeApres)}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
