"use client";

import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { libelleVariante, lienCommande, prixAffiche } from "@/lib/vitrine";
import type { VitrineBoutique, VitrineProduit, VitrineVariante } from "@/types";
import { QuantiteStepper } from "./QuantiteStepper";

interface Props {
  produit: VitrineProduit | null;
  boutique: VitrineBoutique;
  onFermer: () => void;
  onAjouter: (produit: VitrineProduit, variante: VitrineVariante | null, quantite: number) => void;
}

export function ProduitVitrineModal({ produit, boutique, onFermer, onAjouter }: Props) {
  return (
    <Modal isOpen={produit !== null} onClose={onFermer} placement="bottom-center" scrollBehavior="inside" size="3xl" radius="none">
      <ModalContent className="bg-base">
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
              src={produit.images[imageActive] ?? produit.images[0]}
              alt={produit.nom}
              width={600}
              height={750}
              className="aspect-[4/5] max-h-[52vh] w-full bg-surface-high object-cover sm:max-h-none"
            />
            {produit.images.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto px-5 sm:px-0">
                {produit.images.map((url, i) => (
                  <Button
                    key={url}
                    isIconOnly
                    radius="none"
                    variant="light"
                    aria-label={`Photo ${i + 1} sur ${produit.images.length}`}
                    aria-pressed={i === imageActive}
                    onPress={() => setImageActive(i)}
                    className={`h-[70px] w-14 min-w-14 shrink-0 overflow-hidden p-0 transition-opacity ${i === imageActive ? "opacity-100" : "opacity-50"}`}
                  >
                    <img src={url} alt="" width={56} height={70} className="h-full w-full object-cover" />
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-6 px-5 pt-4 sm:px-0 sm:pt-2">
          <div>
            <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-text">{produit.nom}</h2>
            <p className="mt-2 text-lg tabular-nums">
              <span className="font-semibold text-text">{formatCurrency(prixAffiche(produit))}</span>
              {enPromo ? <span className="text-base text-text-muted"> au lieu de {formatCurrency(produit.prixVente)}</span> : null}
            </p>
          </div>

          {produit.description ? <p className="whitespace-pre-line text-base text-text">{produit.description}</p> : null}

          {avecChoix ? (
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-base font-medium text-text">Choisissez</legend>
              <div className="flex flex-wrap gap-2">
                {produit.variantes.map((v) => {
                  const actif = choix?.id === v.id;
                  return (
                    <Button
                      key={v.id}
                      radius="full"
                      aria-pressed={actif}
                      onPress={() => setChoix(v)}
                      className={`h-10 px-4 transition-transform active:scale-95 ${
                        actif ? "bg-[color:var(--sector)] font-semibold text-white" : "bg-surface-high text-text"
                      }`}
                    >
                      {libelleVariante(v) || "Modèle unique"}
                    </Button>
                  );
                })}
              </div>
              {choix?.dernieresPieces ? <p className="text-sm text-return-text">Dernières pièces dans ce choix</p> : null}
            </fieldset>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <span className="text-base font-medium text-text">Quantité</span>
            <QuantiteStepper valeur={quantite} onChange={setQuantite} libelle="Quantité" />
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="flex-col items-stretch gap-2 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
        <Button
          size="lg"
          radius="full"
          isDisabled={!pret}
          onPress={() => onAjouter(choix, quantite)}
          className="bg-[color:var(--sector)] font-semibold text-white transition-transform active:scale-[0.98]"
        >
          {pret ? `Ajouter au panier · ${formatCurrency(prixAffiche(produit) * quantite)}` : "Choisissez une taille"}
        </Button>
        {boutique.whatsapp ? (
          <Button
            as="a"
            href={pret ? lienCommande(boutique.whatsapp, boutique.slug, produit, choix) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            radius="full"
            variant="light"
            isDisabled={!pret}
            className="font-medium text-text"
            startContent={<IconBrandWhatsapp size={18} aria-hidden />}
          >
            Commander seulement cet article
          </Button>
        ) : null}
      </ModalFooter>
    </>
  );
}
