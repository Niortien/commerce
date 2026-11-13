"use client";

import { useState } from "react";
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Input, Textarea } from "@heroui/react";
import { IconX } from "@tabler/icons-react";
import { toTelHref } from "@/lib/phone";
import { articles, cleLigne, imageVitrine, lienCommandePanier, messageCommandePanier, nombreArticles, prixCourt, totalPanier } from "@/lib/vitrine";
import { usePanierVitrineStore } from "@/stores/panierVitrineStore";
import type { LignePanier, VitrineBoutique } from "@/types";
import { boutonFacade } from "./facade";
import { QuantiteStepper } from "./QuantiteStepper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  boutique: VitrineBoutique;
  lignes: LignePanier[];
  /** Les feuilles s'ouvrent dans la vitrine, pour garder ses couleurs. */
  portalContainer?: HTMLElement;
}

const CHAMP = {
  inputWrapper: "bg-fa-sol-pas shadow-none data-[hover=true]:bg-fa-sol-pas group-data-[focus=true]:bg-fa-sol-pas",
  label: "text-fa-encre-douce",
  input: "text-base text-fa-encre",
};

/**
 * La commande : le panier ligne par ligne, le total, puis, en direct, la bulle WhatsApp exacte
 * qui partira vers la boutique. Une seule action : « Envoyer sur WhatsApp · total ».
 */
export function PanierDrawer({ isOpen, onClose, boutique, lignes, portalContainer }: Props) {
  const changerQuantite = usePanierVitrineStore((s) => s.changerQuantite);
  const retirer = usePanierVitrineStore((s) => s.retirer);
  const vider = usePanierVitrineStore((s) => s.vider);
  const [nom, setNom] = useState("");
  const [precision, setPrecision] = useState("");

  const total = totalPanier(lignes);
  const nombre = nombreArticles(lignes);
  const client = { nom, precision };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      size="md"
      scrollBehavior="inside"
      radius="none"
      portalContainer={portalContainer}
      classNames={{
        backdrop: "bg-fa-voile",
        base: "bg-fa-papier text-fa-encre font-facade",
        closeButton: "top-4 right-4 h-11 w-11 rounded-none bg-fa-sol-pas text-fa-encre hover:bg-fa-sol-pas active:bg-fa-sol-pas",
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1 px-5 pt-6">
          <span className="text-[28px] font-semibold leading-tight tracking-[-0.03em]">Votre commande</span>
          <span className="text-sm font-normal text-fa-encre-douce">
            {articles(nombre)} chez {boutique.nom}
          </span>
        </DrawerHeader>

        <DrawerBody className="gap-8 px-5">
          {lignes.length === 0 ? (
            <div className="flex flex-col items-start gap-4 py-10">
              <p className="text-[17px]">Votre panier est vide. Touchez « + » sous un article pour l&apos;ajouter.</p>
              <Button radius="none" disableRipple onPress={onClose} className={boutonFacade.calme}>
                Voir les articles
              </Button>
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-4">
                {lignes.map((l) => {
                  const cle = cleLigne(l.produitId, l.varianteId);
                  return (
                    <li key={cle} className="flex gap-3">
                      <div className="h-20 w-16 shrink-0 overflow-hidden bg-fa-sol-pas">
                        {l.image ? <img src={imageVitrine(l.image, 160)} alt="" width={64} height={80} decoding="async" className="h-full w-full object-cover" /> : null}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="min-w-0 text-base font-medium">
                            {l.nom}
                            {l.libelleVariante ? <span className="font-normal text-fa-encre-douce"> · {l.libelleVariante}</span> : null}
                          </p>
                          <span className="shrink-0 text-base font-semibold tabular-nums">{prixCourt(l.prixUnitaire * l.quantite)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <QuantiteStepper valeur={l.quantite} onChange={(q) => changerQuantite(boutique.slug, cle, q)} libelle={`Quantité de ${l.nom}`} />
                          <Button
                            isIconOnly
                            radius="none"
                            variant="light"
                            disableRipple
                            aria-label={`Retirer ${l.nom} du panier`}
                            onPress={() => retirer(boutique.slug, cle)}
                            className="h-11 w-11 min-w-11 text-fa-encre-douce data-[hover=true]:bg-fa-sol-pas"
                          >
                            <IconX size={20} stroke={2.2} aria-hidden />
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-baseline justify-between bg-fa-sol-pas px-4 py-3">
                <span className="text-base font-medium">Total</span>
                <span className="text-[28px] font-semibold tabular-nums tracking-[-0.02em]">{prixCourt(total)}</span>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-base font-medium">Pour la boutique, si vous voulez</p>
                <Input label="Votre nom" value={nom} onValueChange={setNom} variant="flat" radius="none" classNames={CHAMP} />
                <Textarea
                  label="Quartier, livraison ou précision"
                  value={precision}
                  onValueChange={setPrecision}
                  variant="flat"
                  radius="none"
                  minRows={2}
                  classNames={CHAMP}
                />
              </div>

              {boutique.whatsapp ? (
                <section aria-label="Message envoyé à la boutique" aria-live="polite" className="flex flex-col gap-2">
                  <p className="text-sm text-fa-encre-douce">Le message qui partira sur WhatsApp :</p>
                  <div className="bg-fa-bulle p-4">
                    <p className="whitespace-pre-line text-[15px] leading-relaxed">{messageCommandePanier(boutique, lignes, client)}</p>
                    <p className="mt-1 text-right text-sm text-fa-encre-douce">maintenant</p>
                  </div>
                </section>
              ) : null}
            </>
          )}
        </DrawerBody>

        {lignes.length > 0 ? (
          <DrawerFooter className="flex-col items-stretch gap-2 px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {boutique.whatsapp ? (
              <Button
                as="a"
                href={lienCommandePanier(boutique.whatsapp, boutique, lignes, client)}
                target="_blank"
                rel="noopener noreferrer"
                radius="none"
                disableRipple
                className={boutonFacade.action}
              >
                Envoyer sur WhatsApp · {prixCourt(total)}
              </Button>
            ) : boutique.telephone ? (
              <Button as="a" href={toTelHref(boutique.telephone)} radius="none" disableRipple className={boutonFacade.action}>
                Appeler la boutique pour commander
              </Button>
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-fa-encre-douce">La boutique confirme le stock, le paiement et la livraison avec vous.</p>
              <Button
                size="sm"
                radius="none"
                variant="light"
                disableRipple
                className="h-11 shrink-0 text-sm font-medium text-fa-encre data-[hover=true]:bg-fa-sol-pas"
                onPress={() => vider(boutique.slug)}
              >
                Vider
              </Button>
            </div>
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
