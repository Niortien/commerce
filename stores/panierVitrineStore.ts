import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { cleLigne, libelleVariante, prixAffiche } from "@/lib/vitrine";
import type { LignePanier, VitrineProduit } from "@/types";

const QUANTITE_MAX = 99;

interface PanierVitrineState {
  /** Un panier par vitrine (slug de la boutique) : deux boutiques ne mélangent pas leurs articles. */
  paniers: Record<string, LignePanier[]>;
  ajouter: (slug: string, ligne: Omit<LignePanier, "quantite">, quantite: number) => void;
  changerQuantite: (slug: string, cle: string, quantite: number) => void;
  retirer: (slug: string, cle: string) => void;
  vider: (slug: string) => void;
  /** Retire les articles qui ne sont plus en vitrine et remet les prix à jour (promo terminée…). */
  synchroniser: (slug: string, produits: VitrineProduit[]) => void;
}

const borner = (n: number) => Math.min(QUANTITE_MAX, Math.max(1, Math.round(n)));

function avecLignes(paniers: Record<string, LignePanier[]>, slug: string, lignes: LignePanier[]) {
  return { paniers: { ...paniers, [slug]: lignes } };
}

/**
 * Panier de la vitrine publique, gardé dans le navigateur du visiteur.
 * `skipHydration` : la vitrine est rendue côté serveur avec un panier vide ;
 * VitrineView appelle `persist.rehydrate()` une fois monté, sans écart d'hydratation.
 */
export const usePanierVitrineStore = create<PanierVitrineState>()(
  persist(
    (set) => ({
      paniers: {},
      ajouter: (slug, ligne, quantite) =>
        set((s) => {
          const lignes = s.paniers[slug] ?? [];
          const cle = cleLigne(ligne.produitId, ligne.varianteId);
          const existante = lignes.find((l) => cleLigne(l.produitId, l.varianteId) === cle);
          const suivantes = existante
            ? lignes.map((l) => (l === existante ? { ...l, quantite: borner(l.quantite + quantite) } : l))
            : [...lignes, { ...ligne, quantite: borner(quantite) }];
          return avecLignes(s.paniers, slug, suivantes);
        }),
      changerQuantite: (slug, cle, quantite) =>
        set((s) =>
          avecLignes(
            s.paniers,
            slug,
            (s.paniers[slug] ?? []).map((l) => (cleLigne(l.produitId, l.varianteId) === cle ? { ...l, quantite: borner(quantite) } : l)),
          ),
        ),
      retirer: (slug, cle) =>
        set((s) => avecLignes(s.paniers, slug, (s.paniers[slug] ?? []).filter((l) => cleLigne(l.produitId, l.varianteId) !== cle))),
      vider: (slug) => set((s) => avecLignes(s.paniers, slug, [])),
      synchroniser: (slug, produits) =>
        set((s) => {
          const lignes = s.paniers[slug];
          if (!lignes?.length) return s;
          const parId = new Map(produits.map((p) => [p.id, p]));
          const suivantes = lignes.flatMap((l): LignePanier[] => {
            const produit = parId.get(l.produitId);
            if (!produit) return [];
            const variante = l.varianteId ? produit.variantes.find((v) => v.id === l.varianteId) : null;
            if (l.varianteId && !variante) return [];
            return [
              {
                ...l,
                nom: produit.nom,
                prixUnitaire: prixAffiche(produit),
                libelleVariante: variante ? libelleVariante(variante) : l.libelleVariante,
                image: produit.images[0] ?? null,
              },
            ];
          });
          return avecLignes(s.paniers, slug, suivantes);
        }),
    }),
    {
      name: "mon-djossi-panier-vitrine",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ paniers: s.paniers }),
      skipHydration: true,
    },
  ),
);

const AUCUNE_LIGNE: LignePanier[] = [];

/** Les lignes du panier d'une vitrine (référence stable quand il est vide). */
export function usePanier(slug: string): LignePanier[] {
  return usePanierVitrineStore((s) => s.paniers[slug] ?? AUCUNE_LIGNE);
}
