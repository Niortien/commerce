import type { Boutique } from "@/types";

interface BoutiqueContact {
  telephones: string[];
}

/**
 * Numéros historiques de deux boutiques, d'avant la page « Ma boutique ».
 * Ils ne servent plus que de secours : dès qu'une boutique renseigne son téléphone ou son WhatsApp
 * dans « Ma boutique », ce sont ces informations qui s'impriment.
 */
const BOUTIQUE_CONTACTS: Record<string, BoutiqueContact> = {
  "toit rouge": { telephones: ["0767602389", "0748982155"] },
  oasis:        { telephones: ["0720367799", "0709858831"] },
};

export function getBoutiqueContact(nom: string | null | undefined): BoutiqueContact | null {
  if (!nom) return null;
  return BOUTIQUE_CONTACTS[nom.toLowerCase().trim()] ?? null;
}

/** L'en-tête imprimé sur les reçus : enseigne, logo et coordonnées de « Ma boutique ». */
export interface EnteteRecu {
  enseigne: string;
  logoUrl: string | null;
  /** Lignes sous l'enseigne, déjà mises en forme (adresse, téléphones). Vides = non affichées. */
  lignes: string[];
}

const propre = (v: string | null | undefined) => (v ?? "").trim();

export function enteteRecu(boutique: Boutique | null | undefined, nomSession: string | null): EnteteRecu {
  const enseigne = propre(boutique?.nom) || propre(nomSession) || "Mon Djossi";
  const adresse = [propre(boutique?.adresse), propre(boutique?.ville)].filter(Boolean).join(", ");
  const tel = propre(boutique?.telephone);
  const whatsapp = propre(boutique?.whatsapp);
  const contacts =
    tel && tel === whatsapp
      ? [`Tél. / WhatsApp ${tel}`]
      : [tel && `Tél. ${tel}`, whatsapp && `WhatsApp ${whatsapp}`].filter((x): x is string => !!x);
  if (contacts.length === 0) {
    const ancien = getBoutiqueContact(enseigne);
    if (ancien) contacts.push(ancien.telephones.join(" / "));
  }
  return {
    enseigne,
    logoUrl: propre(boutique?.logoUrl) || null,
    lignes: [adresse, contacts.join(" · ")].filter(Boolean),
  };
}
