interface BoutiqueContact {
  telephones: string[];
}

const BOUTIQUE_CONTACTS: Record<string, BoutiqueContact> = {
  "toit rouge": { telephones: ["0767602389", "0748982155"] },
  oasis:        { telephones: ["0720367799", "0709858831"] },
};

export function getBoutiqueContact(nom: string | null | undefined): BoutiqueContact | null {
  if (!nom) return null;
  return BOUTIQUE_CONTACTS[nom.toLowerCase().trim()] ?? null;
}
