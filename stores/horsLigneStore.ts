import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { VenteHorsLigneBody } from "@/features/sorties/api/sorties-api";
import type { Produit } from "@/types";

/**
 * Caisse sans internet.
 *
 * - catalogue : copie des articles prise à chaque passage en ligne, pour pouvoir choisir et scanner
 *   sans réseau. Le stock y est diminué à chaque vente en attente pour ne pas vendre deux fois la
 *   dernière pièce depuis cet appareil.
 * - ventes : ventes faites hors connexion, gardées sur l'appareil jusqu'à leur envoi.
 * - caisseOuverte : dernier état connu de la caisse (on ne vend pas caisse fermée, même hors ligne).
 */

export interface VenteEnAttente {
  boutiqueId: string;
  corps: VenteHorsLigneBody;
  /** Pour la liste : « 2 × Coca, 1 × Fanta ». */
  resume: string;
  total: string;
  /** Refus du serveur (stock, caisse…) : la vente attend une décision. null = sera renvoyée. */
  erreur: string | null;
}

interface HorsLigneState {
  boutiqueId: string | null;
  catalogue: Produit[];
  catalogueMajLe: string | null;
  caisseOuverte: boolean;
  ventes: VenteEnAttente[];
  memoriserCatalogue: (boutiqueId: string, produits: Produit[]) => void;
  memoriserCaisse: (boutiqueId: string, ouverte: boolean) => void;
  ajouterVente: (vente: VenteEnAttente) => void;
  retirerVente: (clientRef: string) => void;
  marquerErreur: (clientRef: string, erreur: string) => void;
  /** Remet une vente refusée dans la file d'envoi. */
  reessayer: (clientRef: string) => void;
}

function retirerDuStock(catalogue: Produit[], lignes: VenteHorsLigneBody["lignes"]): Produit[] {
  const parVariante = new Map(lignes.map((l) => [l.varianteId, l.quantite]));
  return catalogue.map((p) => ({
    ...p,
    variantes: p.variantes?.map((v) => {
      const q = parVariante.get(v.id);
      return q === undefined ? v : { ...v, quantiteStock: Math.max(0, v.quantiteStock - q) };
    }),
  }));
}

export const useHorsLigneStore = create<HorsLigneState>()(
  persist(
    (set) => ({
      boutiqueId: null,
      catalogue: [],
      catalogueMajLe: null,
      caisseOuverte: false,
      ventes: [],
      memoriserCatalogue: (boutiqueId, produits) =>
        set((s) => {
          // Les ventes pas encore envoyées ne sont pas dans le stock du serveur : on les retire encore.
          const enAttente = s.ventes.filter((v) => v.boutiqueId === boutiqueId).flatMap((v) => v.corps.lignes);
          return { boutiqueId, catalogue: retirerDuStock(produits, enAttente), catalogueMajLe: new Date().toISOString() };
        }),
      memoriserCaisse: (boutiqueId, ouverte) =>
        set((s) => (s.boutiqueId === boutiqueId || s.boutiqueId === null ? { boutiqueId, caisseOuverte: ouverte } : { caisseOuverte: false })),
      ajouterVente: (vente) =>
        set((s) => ({
          ventes: [...s.ventes, vente],
          catalogue: s.boutiqueId === vente.boutiqueId ? retirerDuStock(s.catalogue, vente.corps.lignes) : s.catalogue,
        })),
      retirerVente: (clientRef) => set((s) => ({ ventes: s.ventes.filter((v) => v.corps.clientRef !== clientRef) })),
      marquerErreur: (clientRef, erreur) =>
        set((s) => ({ ventes: s.ventes.map((v) => (v.corps.clientRef === clientRef ? { ...v, erreur } : v)) })),
      reessayer: (clientRef) =>
        set((s) => ({ ventes: s.ventes.map((v) => (v.corps.clientRef === clientRef ? { ...v, erreur: null } : v)) })),
    }),
    {
      name: "mon-djossi-hors-ligne",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

/** Référence unique créée sur l'appareil pour une vente. */
export function nouvelleRefVente(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `hl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
