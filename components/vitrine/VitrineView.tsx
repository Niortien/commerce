"use client";

import { useEffect, useMemo, useState } from "react";
import { resolveTypeCommerce, sectorStyle } from "@/lib/commerce";
import { libelleVariante, nombreArticles, normaliser, prixAffiche, totalPanier } from "@/lib/vitrine";
import { usePanier, usePanierVitrineStore } from "@/stores/panierVitrineStore";
import type { Vitrine, VitrineProduit, VitrineVariante } from "@/types";
import { PanierBar } from "./PanierBar";
import { PanierDrawer } from "./PanierDrawer";
import { ProduitVitrineModal } from "./ProduitVitrineModal";
import { VitrineCatalogue } from "./VitrineCatalogue";
import { VitrineContact } from "./VitrineContact";
import { VitrineEtapes } from "./VitrineEtapes";
import { VitrineFooter } from "./VitrineFooter";
import { VitrineHeader } from "./VitrineHeader";
import { VitrineToolbar } from "./VitrineToolbar";

export function VitrineView({ vitrine }: { vitrine: Vitrine }) {
  const { boutique, categories, produits } = vitrine;
  const [categorieId, setCategorieId] = useState<string | null>(null);
  const [recherche, setRecherche] = useState("");
  const [ouvert, setOuvert] = useState<VitrineProduit | null>(null);
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [signalAjout, setSignalAjout] = useState(0);

  const lignes = usePanier(boutique.slug);
  const ajouter = usePanierVitrineStore((s) => s.ajouter);
  const synchroniser = usePanierVitrineStore((s) => s.synchroniser);

  // Le panier vient du navigateur : on le relit après le premier rendu, puis on retire ce qui n'est plus en vitrine.
  useEffect(() => {
    void Promise.resolve(usePanierVitrineStore.persist.rehydrate()).then(() => synchroniser(boutique.slug, produits));
  }, [boutique.slug, produits, synchroniser]);

  const q = normaliser(recherche);
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

  // « + » sous un article : ajout direct s'il n'y a rien à choisir, sinon la fiche s'ouvre.
  const ajoutRapide = (produit: VitrineProduit) => {
    if (produit.variantes.length > 1) setOuvert(produit);
    else ajouterAuPanier(produit, produit.variantes[0] ?? null, 1);
  };

  const nombre = nombreArticles(lignes);

  return (
    <div className="min-h-dvh bg-base" style={sectorStyle(resolveTypeCommerce(boutique.typeCommerce))}>
      <VitrineHeader
        boutique={boutique}
        produits={produits}
        nombrePanier={nombre}
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
            total={produits.length}
          />
          <main className="mx-auto w-full max-w-[1600px] px-5 pt-8 sm:px-8 sm:pt-10" aria-live="polite">
            {visibles.length === 0 ? (
              <p className="max-w-md py-16 text-base text-text">
                Aucun article ne correspond à « {recherche} ». Essayez un autre mot, ou écrivez à la boutique sur WhatsApp.
              </p>
            ) : (
              <VitrineCatalogue produits={visibles} categories={categories} aplatir={q !== ""} onOuvrir={setOuvert} onAjouter={ajoutRapide} />
            )}
          </main>
          <VitrineEtapes boutique={boutique} produits={produits} />
        </>
      ) : null}

      <VitrineContact boutique={boutique} />
      <VitrineFooter slug={boutique.slug} boutiqueNom={boutique.nom} />

      <ProduitVitrineModal produit={ouvert} boutique={boutique} onFermer={() => setOuvert(null)} onAjouter={ajouterAuPanier} />
      <PanierBar nombre={nombre} total={totalPanier(lignes)} signalAjout={signalAjout} onOuvrir={() => setPanierOuvert(true)} />
      <PanierDrawer isOpen={panierOuvert} onClose={() => setPanierOuvert(false)} boutique={boutique} lignes={lignes} />
    </div>
  );
}
