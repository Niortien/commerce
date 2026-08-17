export interface WhatsappOrderLine {
  produitNom: string;
  sku?: string;
  couleur?: string;
  taille?: string;
  quantite: number;
  prix: number;
  boutiqueNom?: string;
}

export interface WhatsappOrder {
  lignes: WhatsappOrderLine[];
  clientNom: string;
  clientTel: string;
  livraison: "boutique" | "livraison";
  adresse?: string;
  notes?: string;
}

export function buildWhatsappMessage(order: WhatsappOrder): string {
  const sep = "─".repeat(25);

  const items = order.lignes
    .map((l) => {
      const refLine = l.sku ? `\n   Réf : ${l.sku}` : "";
      const boutiqueLine = l.boutiqueNom ? `\n   Boutique : ${l.boutiqueNom}` : "";
      const varianteLine = (l.couleur || l.taille)
        ? `\n   ${[l.couleur && `Couleur : ${l.couleur}`, l.taille && `Taille : ${l.taille}`].filter(Boolean).join(" | ")} | Qté : ${l.quantite}`
        : `\n   Qté : ${l.quantite}`;
      return `📦 *${l.produitNom}*${refLine}${varianteLine}\n   Prix unitaire : ${l.prix.toLocaleString("fr-FR")} FCFA | Sous-total : ${(l.quantite * l.prix).toLocaleString("fr-FR")} FCFA${boutiqueLine}`;
    })
    .join("\n\n");

  const total = order.lignes.reduce((sum, l) => sum + l.quantite * l.prix, 0);

  const livraisonStr =
    order.livraison === "boutique"
      ? "Retrait en boutique"
      : `Livraison à domicile\n   Adresse : ${order.adresse ?? "À préciser"}`;

  const notesStr = order.notes ? `\n💬 *NOTES*\n${order.notes}` : "";

  return [
    `🛒 *COMMANDE DRI VALÉ*`,
    sep,
    ``,
    items,
    ``,
    sep,
    `💰 *TOTAL : ${total.toLocaleString("fr-FR")} FCFA*`,
    sep,
    ``,
    `👤 *CLIENT*`,
    `Nom : ${order.clientNom}`,
    `Tél : ${order.clientTel}`,
    ``,
    `📍 *LIVRAISON*`,
    `Mode : ${livraisonStr}`,
    notesStr,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

export function getWhatsappUrl(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2250709294468";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
