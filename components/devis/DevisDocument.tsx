import type { DevisDocumentData } from "./proforma";

/**
 * Aperçu de la proforma à l'écran, sur fond papier quel que soit le thème : c'est ce que le client recevra.
 * L'impression passe par printDevisDocument (même contenu, mise en page A4).
 */
export function DevisDocument({ doc }: { doc: DevisDocumentData }) {
  return (
    <article
      aria-label={`Proforma ${doc.reference}`}
      className="rounded-lg border border-slate-200 bg-white p-5 text-[13px] leading-relaxed text-slate-900 shadow-sm sm:p-7"
    >
      <header className="flex flex-col gap-4 border-b-2 border-[#0e7490] pb-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-lg font-bold">{doc.boutique.nom}</p>
          {doc.boutique.lignes.map((l) => (
            <p key={l} className="text-xs text-slate-600">
              {l}
            </p>
          ))}
        </div>
        <div className="sm:text-right">
          <p className="text-sm font-bold tracking-wide text-[#0e7490]">FACTURE PROFORMA</p>
          <p className="text-xs text-slate-600">N° {doc.reference}</p>
          <p className="text-xs text-slate-600">Du {doc.date}</p>
          <p className="text-xs text-slate-600">Valable jusqu&apos;au {doc.validite}</p>
        </div>
      </header>

      <div className="my-4">
        <p className="text-xs text-slate-600">Établie pour</p>
        <p className="font-semibold">{doc.client.nom}</p>
        {doc.client.telephone && <p className="text-xs text-slate-600">{doc.client.telephone}</p>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[460px] border-collapse">
          <thead>
            <tr className="border-b border-slate-300 text-left text-xs text-slate-600">
              <th scope="col" className="py-1.5 pr-2 font-medium">Désignation</th>
              <th scope="col" className="py-1.5 pr-2 text-right font-medium">Quantité</th>
              <th scope="col" className="py-1.5 pr-2 text-right font-medium">Prix unitaire</th>
              <th scope="col" className="py-1.5 text-right font-medium">Montant</th>
            </tr>
          </thead>
          <tbody>
            {doc.lignes.map((l, i) => (
              <tr key={`${l.designation}-${i}`} className="border-b border-slate-100 align-top">
                <td className="py-2 pr-2">{l.designation}</td>
                <td className="tabular whitespace-nowrap py-2 pr-2 text-right">{l.quantite}</td>
                <td className="tabular whitespace-nowrap py-2 pr-2 text-right">{l.prixUnitaire}</td>
                <td className="tabular whitespace-nowrap py-2 text-right">{l.montant}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="ml-auto mt-3 w-full max-w-[260px] text-sm">
        <div className="flex justify-between py-0.5">
          <dt>Sous-total</dt>
          <dd className="tabular">{doc.sousTotal}</dd>
        </div>
        {doc.remise && (
          <div className="flex justify-between py-0.5">
            <dt>Remise</dt>
            <dd className="tabular">− {doc.remise}</dd>
          </div>
        )}
        <div className="mt-1 flex justify-between border-t-2 border-slate-900 pt-1.5 text-[15px] font-bold text-slate-900">
          <dt>Total à payer</dt>
          <dd className="tabular">{doc.total}</dd>
        </div>
      </dl>

      {doc.notes && <p className="mt-4 whitespace-pre-line text-sm">{doc.notes}</p>}
      <p className="mt-5 text-[11px] text-slate-500">
        Ce document n&apos;est pas une facture. Prix garantis jusqu&apos;au {doc.validite}, sous réserve du stock disponible.
      </p>
    </article>
  );
}
