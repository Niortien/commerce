"use client";

import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { imageVitrine, libelleVariante, lienCommande, prixAffiche, prixCourt, srcsetVitrine } from "@/lib/vitrine";
import type { VitrineBoutique, VitrineProduit, VitrineVariante } from "@/types";
import { boutonFacade } from "./facade";
import { QuantiteStepper } from "./QuantiteStepper";

interface Props {
  produit: VitrineProduit | null;
  boutique: VitrineBoutique;
  onFermer: () => void;
  onAjouter: (produit: VitrineProduit, variante: VitrineVariante | null, quantite: number) => void;
  /** Les feuilles s'ouvrent dans la vitrine, pour garder ses couleurs. */
  portalContainer?: HTMLElement;
}

/** La feuille monte sans rebond (420ms) et repart plus vite qu'elle n'est venue (220ms). */
const MOUVEMENT_FEUILLE = {
  variants: {
    enter: { y: 0, opacity: 1, transition: { duration: 0.42, ease: [0.32, 0.72, 0, 1] } },
    exit: { y: 32, opacity: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
  },
};

/** La fiche article : grande photo, nom, prix, tailles, quantité, puis une seule action avec le prix dedans. */
export function ProduitVitrineModal({ produit, boutique, onFermer, onAjouter, portalContainer }: Props) {
  const reduit = useReducedMotion();

  return (
    <Modal
      isOpen={produit !== null}
      onClose={onFermer}
      placement="bottom-center"
      scrollBehavior="inside"
      size="3xl"
      radius="none"
      disableAnimation={reduit}
      motionProps={MOUVEMENT_FEUILLE}
      portalContainer={portalContainer}
      classNames={{
        backdrop: "bg-fa-voile",
        base: "m-0 bg-fa-papier text-fa-encre font-facade sm:m-0",
        closeButton: "top-3 right-3 h-11 w-11 rounded-none bg-fa-sol-pas text-fa-encre hover:bg-fa-sol-pas active:bg-fa-sol-pas",
      }}
    >
      <ModalContent>
        {produit ? (
          <Contenu
            key={produit.id}
            produit={produit}
            boutique={boutique}
            onAjouter={(v, q) => {
              onAjouter(produit, v, q);
              onFermer();
            }}
          />
        ) : null}
      </ModalContent>
    </Modal>
  );
}

function Contenu({
  produit,
  boutique,
  onAjouter,
}: {
  produit: VitrineProduit;
  boutique: VitrineBoutique;
  onAjouter: (variante: VitrineVariante | null, quantite: number) => void;
}) {
  // Une seule variante (article sans taille) : rien à choisir.
  const [choix, setChoix] = useState<VitrineVariante | null>(produit.variantes.length === 1 ? produit.variantes[0] : null);
  const [quantite, setQuantite] = useState(1);
  const [imageActive, setImageActive] = useState(0);
  const avecChoix = produit.variantes.length > 1;
  const pret = !avecChoix || choix !== null;
  const enPromo = produit.prixPromo !== null;

  return (
    <>
      <ModalHeader className="sr-only">{produit.nom}</ModalHeader>
      <ModalBody className="gap-6 p-0 sm:flex-row sm:gap-8 sm:p-6">
        {produit.images.length > 0 ? (
          <div className="flex flex-col gap-2 sm:w-[48%] sm:shrink-0">
            <img
              src={imageVitrine(produit.images[imageActive] ?? produit.images[0], 1080)}
              srcSet={srcsetVitrine(produit.images[imageActive] ?? produit.images[0], [480, 768, 1080])}
              sizes="(min-width: 640px) 360px, 100vw"
              alt={produit.nom}
              width={600}
              height={750}
              className="aspect-[4/5] max-h-[52vh] w-full bg-fa-sol-pas object-cover sm:max-h-none"
            />
            {produit.images.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto px-5 sm:px-0">
                {produit.images.map((url, i) => (
                  <Button
                    key={url}
                    isIconOnly
                    radius="none"
                    variant="light"
                    disableRipple
                    aria-label={`Photo ${i + 1} sur ${produit.images.length}`}
                    aria-pressed={i === imageActive}
                    onPress={() => setImageActive(i)}
                    className={`h-[70px] w-14 min-w-14 shrink-0 overflow-hidden p-0 transition-opacity ${i === imageActive ? "opacity-100" : "opacity-50"}`}
                  >
                    <img src={imageVitrine(url, 160)} alt="" width={56} height={70} decoding="async" className="h-full w-full object-cover" />
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-6 px-5 pt-4 sm:px-0 sm:pt-2">
          <div className="pr-12">
            <h2 className="text-[32px] font-semibold leading-[1.05] tracking-[-0.03em]">{produit.nom}</h2>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-2 tabular-nums">
              <span className="text-[22px] font-semibold tracking-[-0.01em]">{prixCourt(prixAffiche(produit))}</span>
              {enPromo ? <s className="text-base text-fa-encre-douce">au lieu de {prixCourt(produit.prixVente)}</s> : null}
            </p>
          </div>

          {produit.description ? <p className="whitespace-pre-line text-[17px] leading-[1.5]">{produit.description}</p> : null}

          {avecChoix ? (
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-base font-medium">Choisissez</legend>
              <div className="flex flex-wrap gap-2">
                {produit.variantes.map((v) => {
                  const actif = choix?.id === v.id;
                  return (
                    <Button
                      key={v.id}
                      radius="none"
                      disableRipple
                      aria-pressed={actif}
                      onPress={() => setChoix(v)}
                      className={`h-11 min-w-11 px-4 text-base font-medium transition-[background-color,color,transform] duration-150 data-[pressed=true]:scale-[0.97] ${
                        actif ? "bg-fa-encre text-fa-sol" : "bg-fa-sol-pas text-fa-encre"
                      }`}
                    >
                      {libelleVariante(v) || "Modèle unique"}
                    </Button>
                  );
                })}
              </div>
              {choix?.dernieresPieces ? (
                <p className="flex items-center gap-2 text-sm font-medium">
                  <span aria-hidden className="h-2.5 w-2.5 bg-fa-rare" />
                  Dernières pièces dans ce choix
                </p>
              ) : null}
            </fieldset>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <span className="text-base font-medium">Quantité</span>
            <QuantiteStepper valeur={quantite} onChange={setQuantite} libelle="Quantité" />
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="flex-col items-stretch gap-2 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
        <Button radius="none" disableRipple isDisabled={!pret} onPress={() => onAjouter(choix, quantite)} className={boutonFacade.action}>
          {pret ? `Ajouter au panier · ${prixCourt(prixAffiche(produit) * quantite)}` : "Choisissez une taille"}
        </Button>
        {boutique.whatsapp && pret ? (
          <a
            href={lienCommande(boutique.whatsapp, boutique.slug, produit, choix)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center text-base font-medium underline underline-offset-4"
          >
            Commander seulement cet article sur WhatsApp
          </a>
        ) : null}
      </ModalFooter>
    </>
  );
}
