import type { Metadata } from "next";
import { getApiBaseUrl } from "@/lib/apiBase";
import { SITE_URL } from "@/lib/site";
import { toWhatsAppHref } from "@/lib/phone";
import { formatCurrency } from "@/lib/formatCurrency";
import { TypeCommerce } from "@/types";
import type { ApiResponse, LignePanier, Vitrine, VitrineProduit, VitrineVariante } from "@/types";

/** Rafraîchie au plus toutes les minutes : un article vendu en caisse disparaît vite de la vitrine. */
const REVALIDATE_SECONDES = 60;
/** Au-delà, on abandonne : une API figée ne doit pas laisser la page tourner indéfiniment. */
const DELAI_API_MS = 8000;

/**
 * Vitrine publique d'une boutique, lue côté serveur (pour que Google et l'aperçu
 * WhatsApp voient le catalogue). `null` si la boutique ne l'a pas publiée.
 */
export async function getVitrine(slug: string): Promise<Vitrine | null> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/vitrine/${encodeURIComponent(slug)}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDES },
    signal: AbortSignal.timeout(DELAI_API_MS),
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

/** Identifiant d'une ligne de panier : un même article dans deux tailles fait deux lignes. */
export function cleLigne(produitId: string, varianteId: string | null): string {
  return `${produitId}:${varianteId ?? "-"}`;
}

export function totalPanier(lignes: LignePanier[]): number {
  return lignes.reduce((total, l) => total + l.prixUnitaire * l.quantite, 0);
}

export function nombreArticles(lignes: LignePanier[]): number {
  return lignes.reduce((n, l) => n + l.quantite, 0);
}

export interface InfosClient {
  nom: string;
  precision: string;
}

/** Lien WhatsApp qui envoie tout le panier à la boutique, avec le total et les infos du client. */
export function lienCommandePanier(
  whatsapp: string,
  boutique: { nom: string; slug: string },
  lignes: LignePanier[],
  client: InfosClient,
): string {
  return `${toWhatsAppHref(numeroInternational(whatsapp))}?text=${encodeURIComponent(messageCommandePanier(boutique, lignes, client))}`;
}

/** Le message exact envoyé sur WhatsApp : le panier l'affiche tel quel avant l'envoi. */
export function messageCommandePanier(boutique: { nom: string; slug: string }, lignes: LignePanier[], client: InfosClient): string {
  const articles = lignes.map((l) => {
    const variante = l.libelleVariante ? ` (${l.libelleVariante})` : "";
    const sousTotal = l.quantite > 1 ? ` = ${formatCurrency(l.prixUnitaire * l.quantite)}` : "";
    return `• ${l.quantite} × ${l.nom}${variante} : ${formatCurrency(l.prixUnitaire)}${sousTotal}`;
  });
  const lignesMessage = [
    `Bonjour ${boutique.nom}, je souhaite commander :`,
    ...articles,
    "",
    `Total : ${formatCurrency(totalPanier(lignes))}`,
    ...(client.nom.trim() ? [`Nom : ${client.nom.trim()}`] : []),
    ...(client.precision.trim() ? [`Livraison / précisions : ${client.precision.trim()}`] : []),
    "",
    `Commande préparée sur votre vitrine : ${vitrineUrl(boutique.slug)}`,
  ];
  return lignesMessage.join("\n");
}

/** Recherche sans tenir compte des accents ni des majuscules : « tshirt » ou « écharpe » / « echarpe ». */
export function normaliser(texte: string): string {
  return texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
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

/**
 * Les photos produits sont des originaux Cloudinary (JPEG 1200 px). On demande à Cloudinary une
 * version à la largeur affichée, au meilleur format que le téléphone accepte (AVIF/WebP) :
 * plusieurs fois plus légère sur données mobiles. Toute autre adresse est rendue telle quelle.
 */
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?!f_auto)/;

export function imageVitrine(url: string, largeur: number): string {
  return url.replace(CLOUDINARY_UPLOAD, `$1f_auto,q_auto,c_limit,w_${largeur}/`);
}

/** `srcset` des largeurs utiles d'une photo Cloudinary ; `undefined` pour une autre adresse. */
export function srcsetVitrine(url: string, largeurs: number[] = [320, 480, 768, 1080]): string | undefined {
  if (!CLOUDINARY_UPLOAD.test(url)) return undefined;
  return largeurs.map((l) => `${imageVitrine(url, l)} ${l}w`).join(", ");
}

/** Les huit couleurs de mur du design system Façade (valeurs dans globals.css, `[data-mur]`). */
export type MurFacade = "bleu" | "vert" | "jaune" | "orange" | "rose" | "turquoise" | "brique" | "ocre";

/**
 * Couleur du mur de la vitrine, tirée du métier de la boutique : deux boutiques d'un même métier
 * se ressemblent, deux métiers différents se distinguent dès le premier écran.
 */
const MUR_PAR_METIER: Record<TypeCommerce, MurFacade> = {
  [TypeCommerce.VETEMENTS]: "bleu",
  [TypeCommerce.FRIPERIE]: "orange",
  [TypeCommerce.CHAUSSURES]: "brique",
  [TypeCommerce.BEAUTE]: "rose",
  [TypeCommerce.RESTAURANT]: "ocre",
  [TypeCommerce.ALIMENTATION]: "vert",
  [TypeCommerce.SUPERMARCHE]: "turquoise",
  [TypeCommerce.PHARMACIE]: "vert",
  [TypeCommerce.ELECTRONIQUE]: "turquoise",
  [TypeCommerce.QUINCAILLERIE]: "jaune",
  [TypeCommerce.AUTRE]: "bleu",
};

export function murDeLaBoutique(typeCommerce: TypeCommerce | null): MurFacade {
  return typeCommerce ? MUR_PAR_METIER[typeCommerce] : "bleu";
}

/** Initiales affichées à la place d'un logo absent : « Akwaba Street » → « AS ». */
export function initiales(nom: string): string {
  const mots = nom.trim().split(/\s+/).filter(Boolean);
  const lettres = mots.length > 1 ? mots[0].charAt(0) + mots[1].charAt(0) : nom.trim().slice(0, 2);
  return lettres.toUpperCase();
}

const nombreFr = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/** Prix affiché dans la vitrine : « 15 000 F » (le message WhatsApp garde « FCFA »). */
export function prixCourt(montant: number): string {
  return `${nombreFr.format(montant)} F`;
}

/** « 1 article », « 24 articles ». */
export function articles(n: number): string {
  return `${n} article${n > 1 ? "s" : ""}`;
}

/** Lien de la mention « Propulsé par Mon Djossi », tracé pour mesurer les essais venus des vitrines. */
export function lienMonDjossi(boutiqueSlug: string): string {
  return `${SITE_URL}/?utm_source=vitrine&utm_medium=referral&utm_campaign=${encodeURIComponent(boutiqueSlug)}`;
}
