"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@heroui/react";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { imageVitrine, prixAffiche, prixCourt, srcsetVitrine } from "@/lib/vitrine";
import type { VitrineProduit } from "@/types";

const DUREE_COCHE_MS = 1400;

interface Props {
  produit: VitrineProduit;
  /** Couleur de la bande, de 1 (le mur de la boutique) à 4 (encre), en tournant le long du catalogue. */
  champ: number;
  /** Un seul article mis en avant par rangée : l'article en promotion. */
  agrandi?: boolean;
  onOuvrir: (p: VitrineProduit) => void;
  /** Ajoute l'article s'il n'y a rien à choisir (renvoie `true`), sinon ouvre la fiche (renvoie `false`). */
  onAjouter: (p: VitrineProduit) => boolean;
}

/**
 * L'étiquette d'un article : la photo bord à bord, puis une bande de couleur avec le nom,
 * le prix et un seul bouton « + ». À l'ajout, le « + » cède la place à une coche.
 */
export function ProduitVitrineCard({ produit, champ, agrandi = false, onOuvrir, onAjouter }: Props) {
  const [ajoute, setAjoute] = useState(false);
  const enPromo = produit.prixPromo !== null;
  const dernieres = produit.variantes.length > 0 && produit.variantes.every((v) => v.dernieresPieces);
  const plusieursChoix = produit.variantes.length > 1;
  const prix = prixCourt(prixAffiche(produit));

  useEffect(() => {
    if (!ajoute) return;
    const minuteur = window.setTimeout(() => setAjoute(false), DUREE_COCHE_MS);
    return () => window.clearTimeout(minuteur);
  }, [ajoute]);

  return (
    <div className="group flex h-full flex-col">
      <Card
        isPressable
        radius="none"
        shadow="none"
        disableRipple
        onPress={() => onOuvrir(produit)}
        aria-label={`${produit.nom}, ${prix}`}
        className={`relative block w-full overflow-hidden bg-fa-sol-pas ${agrandi ? "aspect-[4/5] min-[900px]:aspect-auto min-[900px]:min-h-0 min-[900px]:flex-1" : "aspect-[4/5]"}`}
      >
        {produit.images[0] ? (
          <img
            src={imageVitrine(produit.images[0], 480)}
            srcSet={srcsetVitrine(produit.images[0])}
            sizes={agrandi ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, 50vw"}
            alt=""
            width={480}
            height={600}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <span
            aria-hidden
            className={`absolute inset-0 flex items-end p-3 font-semibold leading-[0.95] tracking-[-0.03em] ${agrandi ? "text-4xl" : "text-2xl"}`}
          >
            {produit.nom}
          </span>
        )}
      </Card>

      <div data-champ={champ} className="grid grid-cols-[minmax(0,1fr)_44px] gap-x-2.5 gap-y-1 bg-fa-champ p-3 text-fa-sur-champ">
        <p className="col-start-1 line-clamp-2 text-base font-medium leading-[1.3]">{produit.nom}</p>
        <p className="col-start-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[22px] font-semibold leading-[1.1] tracking-[-0.01em] tabular-nums">
          {prix}
          {enPromo ? (
            <s className="text-sm font-normal">
              <span className="sr-only">au lieu de </span>
              {prixCourt(produit.prixVente)}
            </s>
          ) : null}
        </p>
        {dernieres ? (
          <p className="col-start-1 flex items-center gap-2 text-sm font-medium">
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 bg-fa-rare" />
            Dernières pièces
          </p>
        ) : plusieursChoix ? (
          <p className="col-start-1 text-sm">{produit.variantes.length} choix</p>
        ) : null}

        <Button
          isIconOnly
          radius="none"
          disableRipple
          onPress={() => setAjoute(onAjouter(produit))}
          aria-label={plusieursChoix ? `Choisir la taille de ${produit.nom}` : `Ajouter ${produit.nom} au panier`}
          className="relative col-start-2 row-span-2 row-start-1 h-11 w-11 min-w-11 bg-fa-sur-champ text-fa-champ data-[pressed=true]:scale-[0.94]"
        >
          <IconPlus
            size={22}
            stroke={2.4}
            aria-hidden
            className={`absolute transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${ajoute ? "scale-50 opacity-0 blur-[2px]" : ""}`}
          />
          <IconCheck
            size={22}
            stroke={2.4}
            aria-hidden
            className={`absolute transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${ajoute ? "" : "scale-50 opacity-0 blur-[2px]"}`}
          />
        </Button>
      </div>
    </div>
  );
}
