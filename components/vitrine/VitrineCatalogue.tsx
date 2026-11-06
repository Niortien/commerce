import type { CSSProperties } from "react";
import type { VitrineCategorie, VitrineProduit } from "@/types";
import { ProduitVitrineCard } from "./ProduitVitrineCard";

interface Props {
  produits: VitrineProduit[];
  categories: VitrineCategorie[];
  /** Recherche en cours : une seule planche, sans rangées par catégorie. */
  aplatir: boolean;
  onOuvrir: (p: VitrineProduit) => void;
  onAjouter: (p: VitrineProduit) => void;
}

interface Rangee {
  id: string;
  titre: string;
  produits: VitrineProduit[];
}

const RANGEE_MIN_POUR_AGRANDIR = 5;

/**
 * La planche contact de la boutique : tout le stock d'un coup, une rangée par catégorie,
 * le nom de la catégorie à la même petite taille que le reste.
 */
export function VitrineCatalogue({ produits, categories, aplatir, onOuvrir, onAjouter }: Props) {
  const rangees = aplatir ? [{ id: "resultats", titre: "Résultats", produits }] : regrouper(produits, categories);

  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {rangees.map((r) => {
        // Une seule vue agrandie par rangée, l'article en promotion, si la rangée est assez fournie.
        const agrandiId = r.produits.length >= RANGEE_MIN_POUR_AGRANDIR ? r.produits.find((p) => p.prixPromo !== null)?.id : undefined;
        return (
          <section key={r.id} aria-labelledby={`rangee-${r.id}`}>
            <h2 id={`rangee-${r.id}`} className="vitrine-entre mb-4 text-base font-semibold text-text">
              {r.titre} <span className="font-normal text-text-muted">· {r.produits.length}</span>
            </h2>
            <ul className="grid grid-flow-dense grid-cols-2 gap-x-2 gap-y-6 sm:grid-cols-3 sm:gap-x-2.5 md:grid-cols-4 xl:grid-cols-6">
              {r.produits.map((p, i) => (
                <li
                  key={p.id}
                  className={`vitrine-entre ${p.id === agrandiId ? "col-span-2 row-span-2" : ""}`}
                  style={{ "--vitrine-decalage": `${(i % 6) * 6}%` } as CSSProperties}
                >
                  <ProduitVitrineCard produit={p} onOuvrir={onOuvrir} onAjouter={onAjouter} agrandi={p.id === agrandiId} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function regrouper(produits: VitrineProduit[], categories: VitrineCategorie[]): Rangee[] {
  const rangees: Rangee[] = categories
    .map((c) => ({ id: c.id, titre: c.nom, produits: produits.filter((p) => p.categorieId === c.id) }))
    .filter((r) => r.produits.length > 0);
  const connues = new Set(categories.map((c) => c.id));
  const autres = produits.filter((p) => p.categorieId === null || !connues.has(p.categorieId));
  if (autres.length > 0) rangees.push({ id: "autres", titre: rangees.length > 0 ? "Autres articles" : "Articles", produits: autres });
  return rangees;
}
