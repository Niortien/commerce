"use client";

import { useState } from "react";
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Input, Textarea } from "@heroui/react";
import { IconBrandWhatsapp, IconPhone, IconShoppingBag, IconX } from "@tabler/icons-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { toTelHref } from "@/lib/phone";
import { cleLigne, lienCommandePanier, messageCommandePanier, nombreArticles, totalPanier } from "@/lib/vitrine";
import { usePanierVitrineStore } from "@/stores/panierVitrineStore";
import type { LignePanier, VitrineBoutique } from "@/types";
import { QuantiteStepper } from "./QuantiteStepper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  boutique: VitrineBoutique;
  lignes: LignePanier[];
}

/**
 * Le bon de commande : une ligne par article (nom à gauche, montant à droite), le total,
 * puis le message WhatsApp tel qu'il partira, mis à jour à chaque changement.
 */
export function PanierDrawer({ isOpen, onClose, boutique, lignes }: Props) {
  const changerQuantite = usePanierVitrineStore((s) => s.changerQuantite);
  const retirer = usePanierVitrineStore((s) => s.retirer);
  const vider = usePanierVitrineStore((s) => s.vider);
  const [nom, setNom] = useState("");
  const [precision, setPrecision] = useState("");

  const total = totalPanier(lignes);
  const nombre = nombreArticles(lignes);
  const client = { nom, precision };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md" scrollBehavior="inside" radius="none">
      <DrawerContent className="bg-base">
        <DrawerHeader className="flex flex-col gap-0.5 px-5 pt-6">
          <span className="font-display text-2xl font-bold tracking-[-0.02em] text-text">Votre commande</span>
          <span className="text-sm font-normal text-text-muted">
            {nombre} article{nombre > 1 ? "s" : ""} chez {boutique.nom}
          </span>
        </DrawerHeader>

        <DrawerBody className="gap-8 px-5">
          {lignes.length === 0 ? (
            <div className="flex flex-col items-start gap-4 py-10">
              <IconShoppingBag size={36} className="text-text-muted" aria-hidden />
              <p className="text-base text-text">Votre panier est vide. Touchez « + » sous un article pour l&apos;ajouter.</p>
              <Button radius="full" onPress={onClose} className="bg-[color:var(--sector)] font-semibold text-white">
                Voir les articles
              </Button>
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-5">
                {lignes.map((l) => {
                  const cle = cleLigne(l.produitId, l.varianteId);
                  return (
                    <li key={cle} className="flex gap-3">
                      <div className="h-[72px] w-[58px] shrink-0 overflow-hidden bg-surface-high">
                        {l.image ? <img src={l.image} alt="" width={58} height={72} className="h-full w-full object-cover" /> : null}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="min-w-0 text-base text-text">
                            {l.nom}
                            {l.libelleVariante ? <span className="text-text-muted"> · {l.libelleVariante}</span> : null}
                          </p>
                          <span className="shrink-0 text-sm font-semibold tabular-nums text-text">{formatCurrency(l.prixUnitaire * l.quantite)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <QuantiteStepper valeur={l.quantite} onChange={(q) => changerQuantite(boutique.slug, cle, q)} libelle={`Quantité de ${l.nom}`} />
                          <Button
                            isIconOnly
                            radius="full"
                            variant="light"
                            aria-label={`Retirer ${l.nom} du panier`}
                            onPress={() => retirer(boutique.slug, cle)}
                            className="h-10 w-10 min-w-10 text-text-muted"
                          >
                            <IconX size={18} aria-hidden />
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-baseline justify-between">
                <span className="text-base text-text">Total</span>
                <span className="font-display text-3xl font-bold tabular-nums tracking-[-0.02em] text-text">{formatCurrency(total)}</span>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-base font-medium text-text">Pour la boutique, si vous voulez</p>
                <Input label="Votre nom" value={nom} onValueChange={setNom} variant="flat" radius="sm" classNames={{ inputWrapper: "bg-surface-high" }} />
                <Textarea
                  label="Quartier, livraison ou précision"
                  value={precision}
                  onValueChange={setPrecision}
                  variant="flat"
                  radius="sm"
                  minRows={2}
                  classNames={{ inputWrapper: "bg-surface-high" }}
                />
              </div>

              {boutique.whatsapp ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-text-muted">Le message qui partira sur WhatsApp :</p>
                  <p data-ui className="whitespace-pre-line bg-[#d9fdd3] p-4 text-sm leading-relaxed text-[#111b21] dark:bg-[#005c4b] dark:text-[#e9edef]">
                    {messageCommandePanier(boutique, lignes, client)}
                  </p>
                </div>
              ) : null}
            </>
          )}
        </DrawerBody>

        {lignes.length > 0 ? (
          <DrawerFooter className="flex-col items-stretch gap-2 bg-surface px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {boutique.whatsapp ? (
              <Button
                as="a"
                href={lienCommandePanier(boutique.whatsapp, boutique, lignes, client)}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                radius="full"
                className="bg-[#1a8f4c] font-semibold text-white transition-transform active:scale-[0.98]"
                startContent={<IconBrandWhatsapp size={20} aria-hidden />}
              >
                Envoyer ma commande · {formatCurrency(total)}
              </Button>
            ) : boutique.telephone ? (
              <Button
                as="a"
                href={toTelHref(boutique.telephone)}
                size="lg"
                radius="full"
                className="bg-[color:var(--sector)] font-semibold text-white"
                startContent={<IconPhone size={20} aria-hidden />}
              >
                Appeler la boutique pour commander
              </Button>
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-text-muted">La boutique confirme stock, paiement et livraison.</p>
              <Button size="sm" radius="full" variant="light" className="shrink-0 text-text-muted" onPress={() => vider(boutique.slug)}>
                Vider
              </Button>
            </div>
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
