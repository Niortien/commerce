"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { libelleVariante, murDeLaBoutique, nombreArticles, normaliser, prixAffiche, totalPanier } from "@/lib/vitrine";
import { usePanier, usePanierVitrineStore } from "@/stores/panierVitrineStore";
import type { Vitrine, VitrineProduit, VitrineVariante } from "@/types";
import { PanierBar } from "./PanierBar";
import { VitrineCatalogue } from "./VitrineCatalogue";
import { avecPassage, VitrineContact } from "./VitrineContact";
import { VitrineEtapes } from "./VitrineEtapes";
import { VitrineFooter } from "./VitrineFooter";
import { VitrineHeader } from "./VitrineHeader";
import { VitrineToolbar } from "./VitrineToolbar";

// Fiche article et commande ne s'ouvrent qu'au toucher : leur code (feuilles, champs) se charge après la page.
const ProduitVitrineModal = dynamic(() => import("./ProduitVitrineModal").then((m) => m.ProduitVitrineModal), { ssr: false });
const PanierDrawer = dynamic(() => import("./PanierDrawer").then((m) => m.PanierDrawer), { ssr: false });

/**
 * La vitrine publique d'une boutique, habillée avec le design system « Façade » :
 * enseigne, catalogue, comment commander, passer à la boutique, pied ; la barre et la feuille de commande par-dessus.
 */
export function VitrineView({ vitrine }: { vitrine: Vitrine }) {
  const { boutique, categories, produits } = vitrine;
  const [categorieId, setCategorieId] = useState<string | null>(null);
  const [recherche, setRecherche] = useState("");
  const [ouvert, setOuvert] = useState<VitrineProduit | null>(null);
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [signalAjout, setSignalAjout] = useState(0);
  // Les feuilles (fiche article, commande) s'ouvrent dans la vitrine pour en garder les couleurs.
  const [portail, setPortail] = useState<HTMLDivElement | null>(null);

  const lignes = usePanier(boutique.slug);
  const ajouter = usePanierVitrineStore((s) => s.ajouter);
  const synchroniser = usePanierVitrineStore((s) => s.synchroniser);

  // Le panier vient du navigateur : on le relit après le premier rendu, puis on retire ce qui n'est plus en vitrine.
  useEffect(() => {
    void Promise.resolve(usePanierVitrineStore.persist.rehydrate()).then(() => synchroniser(boutique.slug, produits));
  }, [boutique.slug, produits, synchroniser]);

  // La saisie reste fluide sur un petit téléphone : la grille suit avec un léger différé.
  const q = normaliser(useDeferredValue(recherche));
  const visibles = useMemo(
    () =>
      produits.filter(
        (p) =>
          (categorieId === null || p.categorieId === categorieId) &&
          (q === "" || normaliser(`${p.nom} ${p.description ?? ""}`).includes(q)),
      ),
    [produits, categorieId, q],
  );

  const ajouterAuPanier = (produit: VitrineProduit, variante: VitrineVariante | null, quantite: number) => {
    ajouter(
      boutique.slug,
      {
        produitId: produit.id,
        varianteId: variante?.id ?? null,
        nom: produit.nom,
        libelleVariante: variante ? libelleVariante(variante) : "",
        prixUnitaire: prixAffiche(produit),
        image: produit.images[0] ?? null,
      },
      quantite,
    );
    setSignalAjout((n) => n + 1);
  };

  // « + » sous un article : ajout direct s'il n'y a rien à choisir (la coche apparaît), sinon la fiche s'ouvre.
  const ajoutRapide = (produit: VitrineProduit): boolean => {
    if (produit.variantes.length > 1) {
      setOuvert(produit);
      return false;
    }
    ajouterAuPanier(produit, produit.variantes[0] ?? null, 1);
    return true;
  };

  const nombre = nombreArticles(lignes);
  const portalContainer = portail ?? undefined;

  return (
    <div
      data-vitrine=""
      data-mur={murDeLaBoutique(boutique.typeCommerce)}
      className={`min-h-dvh bg-fa-sol font-facade text-[17px] leading-[1.5] tracking-[-0.005em] text-fa-encre antialiased ${
        nombre > 0 ? "pb-[calc(76px+env(safe-area-inset-bottom))]" : ""
      }`}
    >
      <VitrineHeader
        boutique={boutique}
        produits={produits}
        nombrePanier={nombre}
        avecPassage={avecPassage(boutique)}
        onOuvrirProduit={setOuvert}
        onOuvrirPanier={() => setPanierOuvert(true)}
      />

      {produits.length > 0 ? (
        <>
          <VitrineToolbar
            categories={categories}
            categorieId={categorieId}
            onCategorie={setCategorieId}
            recherche={recherche}
            onRecherche={setRecherche}
            visibles={visibles.length}
          />
          <main className="mx-auto w-full max-w-[1600px] px-5 pb-12 pt-6 min-[900px]:px-8" aria-live="polite">
            {visibles.length === 0 ? (
              <p className="max-w-md py-16 text-[17px]">
                Aucun article ne correspond à « {recherche} ». Essayez un autre mot, ou écrivez à la boutique.
              </p>
            ) : (
              <VitrineCatalogue
                produits={visibles}
                categories={categories}
                aplatir={q !== "" || categorieId !== null}
                onOuvrir={setOuvert}
                onAjouter={ajoutRapide}
              />
            )}
          </main>
          <VitrineEtapes boutique={boutique} produits={produits} />
        </>
      ) : null}

      <VitrineContact boutique={boutique} produits={produits} />
      <VitrineFooter boutique={boutique} nombreProduits={produits.length} />

      <div ref={setPortail} />
      <ProduitVitrineModal
        produit={ouvert}
        boutique={boutique}
        onFermer={() => setOuvert(null)}
        onAjouter={ajouterAuPanier}
        portalContainer={portalContainer}
      />
      <PanierBar nombre={nombre} total={totalPanier(lignes)} signalAjout={signalAjout} onOuvrir={() => setPanierOuvert(true)} />
      <PanierDrawer
        isOpen={panierOuvert}
        onClose={() => setPanierOuvert(false)}
        boutique={boutique}
        lignes={lignes}
        portalContainer={portalContainer}
      />
    </div>
  );
}
