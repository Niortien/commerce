import { formatDateCourte } from "@/lib/devis";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatQuantite, uniteDe } from "@/lib/unites";
import type { Boutique, Devis } from "@/types";

/** Ce que la proforma affiche, prêt à l'emploi (aperçu à l'écran et impression). */
export interface DevisDocumentData {
  boutique: { nom: string; lignes: string[] };
  reference: string;
  date: string;
  validite: string;
  client: { nom: string; telephone: string | null };
  lignes: Array<{ designation: string; quantite: string; prixUnitaire: string; montant: string }>;
  sousTotal: string;
  remise: string | null;
  total: string;
  notes: string | null;
}

export function buildDevisDocument(devis: Devis, boutique: Boutique | undefined): DevisDocumentData {
  const remise = Number(devis.remiseMontant);
  return {
    boutique: {
      nom: boutique?.nom ?? "",
      lignes: [
        [boutique?.adresse, boutique?.ville].filter(Boolean).join(", "),
        [boutique?.telephone, boutique?.whatsapp && `WhatsApp ${boutique.whatsapp}`].filter(Boolean).join(" · "),
        boutique?.email ?? "",
      ].filter((l) => l.length > 0),
    },
    reference: devis.reference,
    date: formatDateCourte(devis.createdAt),
    validite: formatDateCourte(devis.valableJusquAu),
    client: { nom: devis.clientNom, telephone: devis.clientTelephone },
    lignes: (devis.lignes ?? []).map((l) => ({
      designation: l.designation,
      quantite: formatQuantite(l.quantite, uniteDe(l.variante?.produit)),
      prixUnitaire: formatCurrency(l.prixUnitaire),
      montant: formatCurrency(l.quantite * Number(l.prixUnitaire)),
    })),
    sousTotal: formatCurrency(devis.totalAvantRemise),
    remise: remise > 0 ? formatCurrency(remise) : null,
    total: formatCurrency(devis.totalMontant),
    notes: devis.notes,
  };
}

const escape = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Imprime la proforma sur une page A4, dans une fenêtre dédiée (les styles de l'application n'y entrent pas). */
export function printDevisDocument(doc: DevisDocumentData): void {
  const w = window.open("", "_blank", "width=820,height=1000");
  if (!w) {
    window.print();
    return;
  }

  const lignes = doc.lignes
    .map(
      (l) => `<tr><td>${escape(l.designation)}</td><td class="n">${escape(l.quantite)}</td><td class="n">${escape(l.prixUnitaire)}</td><td class="n">${escape(l.montant)}</td></tr>`
    )
    .join("");

  w.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Proforma ${escape(doc.reference)}</title>
<style>
@page { size: A4; margin: 18mm 16mm; }
* { box-sizing: border-box; }
body { font-family: "Helvetica Neue", Arial, sans-serif; color: #0f172a; font-size: 11pt; line-height: 1.45; margin: 0; }
header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #0e7490; padding-bottom: 14px; }
h1 { font-size: 18pt; margin: 0 0 4px; }
.titre { text-align: right; }
.titre strong { display: block; font-size: 15pt; letter-spacing: .04em; color: #0e7490; }
.muted { color: #475569; font-size: 10pt; margin: 0; }
.client { margin: 22px 0 16px; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: 9.5pt; color: #475569; border-bottom: 1px solid #cbd5e1; padding: 6px 4px; }
td { padding: 7px 4px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
.n { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
.totaux { margin: 14px 0 0 auto; width: 46%; }
.totaux div { display: flex; justify-content: space-between; padding: 3px 0; }
.totaux .total { border-top: 2px solid #0f172a; margin-top: 4px; padding-top: 6px; font-size: 13pt; font-weight: 700; }
.notes { margin-top: 22px; white-space: pre-line; }
footer { margin-top: 28px; font-size: 9pt; color: #475569; }
</style></head><body>
<header>
  <div><h1>${escape(doc.boutique.nom)}</h1>${doc.boutique.lignes.map((l) => `<p class="muted">${escape(l)}</p>`).join("")}</div>
  <div class="titre"><strong>FACTURE PROFORMA</strong><p class="muted">N° ${escape(doc.reference)}</p><p class="muted">Du ${escape(doc.date)}</p><p class="muted">Valable jusqu'au ${escape(doc.validite)}</p></div>
</header>
<section class="client"><p class="muted">Établie pour</p><p><strong>${escape(doc.client.nom)}</strong>${doc.client.telephone ? `<br>${escape(doc.client.telephone)}` : ""}</p></section>
<table><thead><tr><th>Désignation</th><th class="n">Quantité</th><th class="n">Prix unitaire</th><th class="n">Montant</th></tr></thead><tbody>${lignes}</tbody></table>
<div class="totaux">
  <div><span>Sous-total</span><span class="n">${escape(doc.sousTotal)}</span></div>
  ${doc.remise ? `<div><span>Remise</span><span class="n">− ${escape(doc.remise)}</span></div>` : ""}
  <div class="total"><span>Total à payer</span><span class="n">${escape(doc.total)}</span></div>
</div>
${doc.notes ? `<p class="notes">${escape(doc.notes)}</p>` : ""}
<footer>Ce document n'est pas une facture. Les prix sont garantis jusqu'au ${escape(doc.validite)}, sous réserve du stock disponible au moment de la commande.</footer>
</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}
