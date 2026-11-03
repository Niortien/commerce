"use client";

import { useState } from "react";
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { IconBrandWhatsapp, IconPhone } from "@tabler/icons-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { toTelHref } from "@/lib/phone";
import { libelleVariante, lienCommande } from "@/lib/vitrine";
import type { VitrineBoutique, VitrineProduit, VitrineVariante } from "@/types";

interface Props {
  produit: VitrineProduit | null;
  boutique: VitrineBoutique;
  onFermer: () => void;
}

export function ProduitVitrineModal({ produit, boutique, onFermer }: Props) {
  return (
    <Modal isOpen={produit !== null} onClose={onFermer} placement="bottom-center" scrollBehavior="inside" size="lg">
      <ModalContent>{produit ? <Contenu key={produit.id} produit={produit} boutique={boutique} /> : null}</ModalContent>
    </Modal>
  );
}

function Contenu({ produit, boutique }: { produit: VitrineProduit; boutique: VitrineBoutique }) {
  // Une seule variante (article sans taille) : rien à choisir.
  const [choix, setChoix] = useState<VitrineVariante | null>(produit.variantes.length === 1 ? produit.variantes[0] : null);
  const avecChoix = produit.variantes.length > 1;
  const enPromo = produit.prixPromo !== null;

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        <span className="text-lg font-bold text-text">{produit.nom}</span>
        <span className="flex items-baseline gap-2 font-mono">
          <span className="font-semibold text-accent-text">{formatCurrency(produit.prixPromo ?? produit.prixVente)}</span>
          {enPromo ? <span className="text-sm text-text-muted line-through">{formatCurrency(produit.prixVente)}</span> : null}
        </span>
      </ModalHeader>
      <ModalBody className="gap-4">
        {produit.images.length > 0 ? (
          <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1">
            {produit.images.map((url, i) => (
              <img
                key={url}
                src={url}
                alt={i === 0 ? produit.nom : ""}
                className="aspect-square w-[85%] shrink-0 snap-start rounded-xl border border-border object-cover"
              />
            ))}
          </div>
        ) : null}

        {produit.description ? <p className="text-sm text-text-muted">{produit.description}</p> : null}

        {avecChoix ? (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-semibold text-text">Choisissez</legend>
            <div className="flex flex-wrap gap-2">
              {produit.variantes.map((v) => {
                const actif = choix?.id === v.id;
                return (
                  <Button
                    key={v.id}
                    size="sm"
                    radius="full"
                    variant={actif ? "solid" : "bordered"}
                    className={actif ? "bg-text !text-surface" : ""}
                    aria-pressed={actif}
                    onPress={() => setChoix(v)}
                  >
                    {libelleVariante(v) || "Modèle unique"}
                  </Button>
                );
              })}
            </div>
            {choix?.dernieresPieces ? (
              <Chip size="sm" variant="flat" color="warning">
                Dernières pièces dans cette taille
              </Chip>
            ) : null}
          </fieldset>
        ) : null}
      </ModalBody>
      <ModalFooter className="flex-col items-stretch gap-2">
        {boutique.whatsapp ? (
          <Button
            as="a"
            href={choix || !avecChoix ? lienCommande(boutique.whatsapp, boutique.slug, produit, choix) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            isDisabled={avecChoix && !choix}
            className="bg-[#1a8f4c] font-semibold text-white"
            startContent={<IconBrandWhatsapp size={20} aria-hidden />}
          >
            {avecChoix && !choix ? "Choisissez d'abord" : "Commander sur WhatsApp"}
          </Button>
        ) : boutique.telephone ? (
          <Button as="a" href={toTelHref(boutique.telephone)} className="bg-accent font-semibold text-white" startContent={<IconPhone size={20} aria-hidden />}>
            Appeler la boutique
          </Button>
        ) : null}
        <p className="text-center text-xs text-text-muted">
          Le paiement et la livraison se règlent directement avec la boutique.
        </p>
      </ModalFooter>
    </>
  );
}
