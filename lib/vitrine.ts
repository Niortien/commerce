import type { Metadata } from "next";
import { getApiBaseUrl } from "@/lib/apiBase";
import { SITE_URL } from "@/lib/site";
import { toWhatsAppHref } from "@/lib/phone";
import { formatCurrency } from "@/lib/formatCurrency";
import type { ApiResponse, Vitrine, VitrineProduit, VitrineVariante } from "@/types";

/** Rafraîchie au plus toutes les minutes : un article vendu en caisse disparaît vite de la vitrine. */
const REVALIDATE_SECONDES = 60;

/**
 * Vitrine publique d'une boutique, lue côté serveur (pour que Google et l'aperçu
 * WhatsApp voient le catalogue). `null` si la boutique ne l'a pas publiée.
 */
export async function getVitrine(slug: string): Promise<Vitrine | null> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/vitrine/${encodeURIComponent(slug)}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDES },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Vitrine indisponible (${res.status})`);
  const body = (await res.json()) as ApiResponse<Vitrine>;
  return body.data;
}

/** Titre, description et image de l'aperçu quand le lien est partagé sur WhatsApp ou Instagram. */
export function vitrineMetadata({ boutique, produits }: Vitrine): Metadata {
  const lieu = boutique.ville ? ` à ${boutique.ville}` : "";
  const description = `${produits.length} article${produits.length > 1 ? "s" : ""} disponible${produits.length > 1 ? "s" : ""}${lieu}. Commandez directement sur WhatsApp.`;
  const image = boutique.logoUrl ?? produits.find((p) => p.images[0])?.images[0];
  return {
    title: { absolute: `${boutique.nom} · Vitrine en ligne` },
    description,
    alternates: { canonical: `/boutique/${boutique.slug}` },
    openGraph: {
      type: "website",
      url: vitrineUrl(boutique.slug),
      title: boutique.nom,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export function vitrineUrl(slug: string): string {
  return `${SITE_URL}/boutique/${slug}`;
}

/** Prix réellement payé : le prix promo pendant une promotion. */
export function prixAffiche(p: VitrineProduit): number {
  return p.prixPromo ?? p.prixVente;
}

/** Libellé d'une variante sans les valeurs « vides » (« Unique », « - ») des articles sans taille ni couleur. */
export function libelleVariante(v: VitrineVariante): string {
  const neutres = new Set(["unique", "-", ""]);
  return [v.taille, v.couleur].filter((x) => !neutres.has(x.trim().toLowerCase())).join(" · ");
}

/** Lien WhatsApp qui ouvre la conversation avec la boutique, message de commande déjà écrit. */
export function lienCommande(whatsapp: string, boutiqueSlug: string, p: VitrineProduit, v: VitrineVariante | null): string {
  const lignes = [
    "Bonjour, je souhaite commander :",
    `• ${p.nom}${v && libelleVariante(v) ? ` (${libelleVariante(v)})` : ""}`,
    `• Prix : ${formatCurrency(prixAffiche(p))}`,
    "",
    `Vu sur votre vitrine : ${vitrineUrl(boutiqueSlug)}`,
  ];
  return `${toWhatsAppHref(numeroInternational(whatsapp))}?text=${encodeURIComponent(lignes.join("\n"))}`;
}

/** Lien WhatsApp de contact simple (sans article). */
export function lienContact(whatsapp: string, boutiqueNom: string): string {
  const texte = `Bonjour ${boutiqueNom}, j'ai vu votre vitrine sur Mon Djossi.`;
  return `${toWhatsAppHref(numeroInternational(whatsapp))}?text=${encodeURIComponent(texte)}`;
}

/** wa.me exige l'indicatif : un numéro ivoirien saisi à 10 chiffres reçoit le 225. */
function numeroInternational(numero: string): string {
  const chiffres = numero.replace(/\D/g, "");
  return chiffres.length === 10 ? `225${chiffres}` : chiffres;
}

/** Lien de la mention « Propulsé par Mon Djossi », tracé pour mesurer les essais venus des vitrines. */
export function lienMonDjossi(boutiqueSlug: string): string {
  return `${SITE_URL}/?utm_source=vitrine&utm_medium=referral&utm_campaign=${encodeURIComponent(boutiqueSlug)}`;
}
