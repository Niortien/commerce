import type { VitrineCategorie, VitrineProduit } from "@/types";
import { ProduitVitrineCard } from "./ProduitVitrineCard";

interface Props {
  produits: VitrineProduit[];
  categories: VitrineCategorie[];
  /** Recherche ou catégorie en cours : une seule grille, sans rangées par catégorie. */
  aplatir: boolean;
  onOuvrir: (p: VitrineProduit) => void;
  onAjouter: (p: VitrineProduit) => boolean;
}

interface Rangee {
  id: string;
  titre: string;
  produits: VitrineProduit[];
}

const RANGEE_MIN_POUR_AGRANDIR = 5;

/**
 * Le catalogue : une rangée par catégorie, deux colonnes sur téléphone, quatre sur ordinateur.
 * Dans une rangée assez fournie, l'article en promotion est mis en avant (un carré de deux sur deux).
 */
export function VitrineCatalogue({ produits, categories, aplatir, onOuvrir, onAjouter }: Props) {
  const rangees = aplatir ? [{ id: "resultats", titre: "", produits }] : regrouper(produits, categories);
  const avecTitres = rangees.length > 1;

  return (
    <div className="flex flex-col gap-14 min-[900px]:gap-20">
      {rangees.map((r) => {
        const agrandiId = r.produits.length >= RANGEE_MIN_POUR_AGRANDIR ? r.produits.find((p) => p.prixPromo !== null)?.id : undefined;
        return (
          <section key={r.id} aria-labelledby={avecTitres ? `rangee-${r.id}` : undefined} aria-label={avecTitres ? undefined : "Articles"}>
            {avecTitres ? (
              <h3 id={`rangee-${r.id}`} className="mb-4 text-[22px] font-semibold leading-tight tracking-[-0.02em]">
                {r.titre} <span className="font-normal text-fa-encre-douce">· {r.produits.length}</span>
              </h3>
            ) : null}
            <ul className="grid grid-flow-dense grid-cols-2 gap-x-2 gap-y-7 min-[900px]:grid-cols-4 min-[900px]:gap-x-3 min-[900px]:gap-y-9">
              {r.produits.map((p, i) => {
                const agrandi = p.id === agrandiId;
                return (
                  <li key={p.id} className={`fa-defile ${agrandi ? "col-span-2 min-[900px]:row-span-2" : ""}`}>
                    <ProduitVitrineCard produit={p} champ={(i % 4) + 1} agrandi={agrandi} onOuvrir={onOuvrir} onAjouter={onAjouter} />
                  </li>
                );
              })}
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
