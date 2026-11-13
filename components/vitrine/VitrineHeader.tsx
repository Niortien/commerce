"use client";

import type { CSSProperties } from "react";
import { Button, Card } from "@heroui/react";
import { IconShoppingBag } from "@tabler/icons-react";
import { getCommerceProfile } from "@/lib/commerce";
import { articles, imageVitrine, initiales, prixAffiche, prixCourt, srcsetVitrine } from "@/lib/vitrine";
import type { VitrineBoutique, VitrineProduit } from "@/types";
import { boutonFacade } from "./facade";

const PHOTOS_MAX = 5;
const PHOTOS_MIN = 3;

interface Props {
  boutique: VitrineBoutique;
  produits: VitrineProduit[];
  nombrePanier: number;
  /** La section « Passer à la boutique » existe (adresse ou contact) : le lien secondaire y mène. */
  avecPassage: boolean;
  onOuvrirProduit: (p: VitrineProduit) => void;
  onOuvrirPanier: () => void;
}

/** Le nom tient en deux lignes au plus : plus il est long, plus il est composé petit. */
function tailleDuNom(nom: string): string {
  if (nom.length <= 14) return "text-[min(15.5vw,132px)] min-[900px]:text-[min(9vw,132px)]";
  if (nom.length <= 24) return "text-[min(11vw,92px)] min-[900px]:text-[min(6.5vw,92px)]";
  return "text-[min(8.5vw,64px)] min-[900px]:text-[min(4.6vw,64px)]";
}

const delai = (ms: number) => ({ "--fa-delai": `${ms}ms` }) as CSSProperties;

/**
 * L'enseigne : le mur peint à la couleur de la boutique, son nom en très grand, une phrase et
 * l'action « Voir les articles » ; à côté, une mosaïque de ses vrais articles.
 * À l'arrivée, une seule fois : le mur se peint, le nom arrive, les photos s'ouvrent comme un volet.
 */
export function VitrineHeader({ boutique, produits, nombrePanier, avecPassage, onOuvrirProduit, onOuvrirPanier }: Props) {
  const profil = boutique.typeCommerce ? getCommerceProfile(boutique.typeCommerce) : null;
  const photos = produits.filter((p) => p.images[0]).slice(0, PHOTOS_MAX);
  const avecMosaique = photos.length >= PHOTOS_MIN;
  const quoi = [profil?.label, boutique.ville ? `à ${boutique.ville}` : null].filter(Boolean).join(" ");
  const commande = boutique.whatsapp ? "vous commandez sur WhatsApp" : "vous appelez la boutique pour commander";
  const phrase =
    produits.length > 0
      ? `${quoi ? `${quoi}. ` : ""}Vous choisissez ici, ${commande}.`
      : "Les nouveautés arrivent. Écrivez à la boutique pour savoir ce qui est disponible.";

  // Trois colonnes décalées : 1re et 4e photo, 2e et 5e, puis la 3e (sur ordinateur seulement).
  const colonnes = [
    [photos[0], photos[3]],
    [photos[1], photos[4]],
    [photos[2]],
  ].map((c) => c.filter((p): p is VitrineProduit => p !== undefined));

  return (
    <header className={`grid grid-cols-1 ${avecMosaique ? "min-[900px]:min-h-[680px] min-[900px]:grid-cols-2" : ""}`}>
      <div className="fa-sur-mur fa-peint flex flex-col gap-5 bg-fa-mur px-5 pb-7 pt-5 text-fa-sur-mur min-[900px]:px-8 min-[900px]:pb-10 min-[900px]:pt-8">
        <div className="flex items-center justify-between gap-3">
          {boutique.logoUrl ? (
            <img
              src={boutique.logoUrl}
              alt={`Logo ${boutique.nom}`}
              width={48}
              height={48}
              className="h-12 w-12 bg-fa-sur-mur object-contain p-1"
            />
          ) : (
            <span aria-hidden className="grid h-12 w-12 place-items-center bg-fa-sur-mur text-xl font-semibold tracking-[-0.04em] text-fa-mur">
              {initiales(boutique.nom)}
            </span>
          )}
          <Button
            radius="none"
            variant="light"
            disableRipple
            onPress={onOuvrirPanier}
            className="-mr-3 h-11 min-w-0 gap-2 px-3 text-base font-medium text-fa-sur-mur data-[hover=true]:bg-transparent data-[hover=true]:underline"
            startContent={<IconShoppingBag size={20} stroke={2} aria-hidden />}
          >
            Panier · {nombrePanier}
          </Button>
        </div>

        <h1
          className={`fa-arrive mt-7 max-w-[14ch] font-semibold leading-[0.9] tracking-[-0.045em] [overflow-wrap:anywhere] [text-wrap:balance] min-[900px]:mt-auto ${tailleDuNom(boutique.nom)}`}
          style={delai(300)}
        >
          {boutique.nom}
        </h1>

        <p className="fa-arrive m-0 max-w-[34ch] text-[19px] font-medium leading-[1.4] tracking-[-0.01em]" style={delai(380)}>
          {phrase}
        </p>

        <div className="fa-arrive mt-1 flex flex-wrap items-center gap-x-5 gap-y-3" style={delai(450)}>
          {produits.length > 0 ? (
            <Button as="a" href="#articles" radius="none" disableRipple className={boutonFacade.surMur}>
              Voir les {articles(produits.length)}
            </Button>
          ) : null}
          {avecPassage ? (
            <a href="#boutique" className="text-base font-semibold text-fa-sur-mur underline underline-offset-4">
              {boutique.adresse || boutique.ville ? "Passer à la boutique" : "Joindre la boutique"}
            </a>
          ) : null}
        </div>
      </div>

      {avecMosaique ? (
        <div
          aria-label="Quelques articles"
          role="group"
          className="grid max-h-[520px] grid-cols-2 gap-2 overflow-hidden bg-fa-sol-pas px-5 pt-3 min-[900px]:max-h-none min-[900px]:grid-cols-[1fr_1fr_0.6fr] min-[900px]:pl-8 min-[900px]:pr-0 min-[900px]:pt-8"
        >
          {colonnes.map((colonne, c) => (
            <div key={c} className={`flex flex-col gap-2 ${c > 0 ? "mt-12" : ""} ${c === 2 ? "hidden min-[900px]:flex" : ""}`}>
              {colonne.map((p) => (
                <Card
                  key={p.id}
                  isPressable
                  radius="none"
                  shadow="none"
                  disableRipple
                  onPress={() => onOuvrirProduit(p)}
                  aria-label={`${p.nom}, ${prixCourt(prixAffiche(p))}`}
                  className="fa-volet block aspect-[4/5] w-full overflow-hidden bg-fa-sol"
                  style={{ "--fa-i": photos.indexOf(p) } as CSSProperties}
                >
                  <img
                    src={imageVitrine(p.images[0], 480)}
                    srcSet={srcsetVitrine(p.images[0], [320, 480, 768])}
                    sizes="(min-width: 900px) 20vw, 45vw"
                    alt=""
                    width={480}
                    height={600}
                    decoding="async"
                    loading={photos.indexOf(p) === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-cover"
                  />
                </Card>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </header>
  );
}
