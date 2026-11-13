import { Button } from "@heroui/react";
import { toTelHref } from "@/lib/phone";
import { imageVitrine, lienContact } from "@/lib/vitrine";
import type { VitrineBoutique, VitrineProduit } from "@/types";
import { boutonFacade } from "./facade";

const PHOTOS_MAX = 4;

/** La section existe dès qu'il y a une adresse ou un moyen de joindre la boutique. */
export function avecPassage(boutique: VitrineBoutique): boolean {
  return Boolean(boutique.whatsapp || boutique.telephone || boutique.adresse || boutique.ville);
}

/**
 * « Passer à la boutique » : un second mur, peint de la même couleur que l'enseigne, avec l'adresse
 * telle qu'on la donne et les deux façons de joindre la boutique. Sur ordinateur, des photos à droite.
 */
export function VitrineContact({ boutique, produits }: { boutique: VitrineBoutique; produits: VitrineProduit[] }) {
  if (!avecPassage(boutique)) return null;
  const lieu = [boutique.adresse, boutique.ville].filter(Boolean).join(", ");
  const photos = produits.filter((p) => p.images[0]).slice(-PHOTOS_MAX);

  return (
    <section
      id="boutique"
      aria-labelledby="boutique-titre"
      className="fa-sur-mur scroll-mt-4 bg-fa-mur text-fa-sur-mur"
    >
      <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-5 py-14 min-[900px]:grid-cols-2 min-[900px]:gap-12 min-[900px]:px-8 min-[900px]:py-24">
        <div className="fa-defile flex flex-col items-start gap-6">
          <h2 id="boutique-titre" className="text-[min(10vw,60px)] font-semibold leading-none tracking-[-0.035em]">
            {lieu ? "Passer à la boutique" : "Joindre la boutique"}
          </h2>
          {lieu ? <p className="max-w-[34ch] text-[19px] font-medium leading-[1.4]">{lieu}</p> : null}
          <p className="max-w-[40ch] text-[17px] leading-[1.5]">
            Une question sur une taille, une couleur ou la livraison ? {boutique.nom} vous répond directement.
          </p>
          <div className="flex w-full max-w-[420px] flex-wrap gap-2">
            {boutique.whatsapp ? (
              <Button
                as="a"
                href={lienContact(boutique.whatsapp, boutique.nom)}
                target="_blank"
                rel="noopener noreferrer"
                radius="none"
                disableRipple
                className={`${boutonFacade.surMur} flex-1`}
              >
                WhatsApp
              </Button>
            ) : null}
            {boutique.telephone ? (
              <Button as="a" href={toTelHref(boutique.telephone)} radius="none" disableRipple className={`${boutonFacade.surMur} flex-1`}>
                Appeler
              </Button>
            ) : null}
          </div>
        </div>

        {photos.length >= 2 ? (
          <div aria-hidden className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] min-[900px]:mx-0 min-[900px]:grid min-[900px]:grid-cols-2 min-[900px]:content-start min-[900px]:overflow-visible min-[900px]:px-0 [&::-webkit-scrollbar]:hidden">
            {photos.map((p) => (
              <img
                key={p.id}
                src={imageVitrine(p.images[0], 480)}
                alt=""
                width={240}
                height={300}
                loading="lazy"
                decoding="async"
                className="fa-defile aspect-[4/5] h-40 w-auto shrink-0 bg-fa-sol object-cover min-[900px]:h-auto min-[900px]:w-full min-[900px]:max-h-[300px]"
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
