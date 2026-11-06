"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Card } from "@heroui/react";
import { IconBrandWhatsapp, IconShoppingBag } from "@tabler/icons-react";
import { getCommerceProfile } from "@/lib/commerce";
import { formatCurrency } from "@/lib/formatCurrency";
import { toTelHref } from "@/lib/phone";
import { lienContact, prixAffiche } from "@/lib/vitrine";
import type { VitrineBoutique, VitrineProduit } from "@/types";

const PHOTOS_MAX = 14;

interface Props {
  boutique: VitrineBoutique;
  produits: VitrineProduit[];
  nombrePanier: number;
  onOuvrirProduit: (p: VitrineProduit) => void;
  onOuvrirPanier: () => void;
}

/** Plus le nom est long, plus il est composé petit : il tient toujours en deux lignes. */
function tailleDuNom(nom: string): string {
  if (nom.length <= 12) return "text-[clamp(2.75rem,10vw,10rem)]";
  if (nom.length <= 20) return "text-[clamp(2.5rem,7.5vw,8rem)]";
  if (nom.length <= 32) return "text-[clamp(2.25rem,5.5vw,6rem)]";
  return "text-[clamp(2rem,4.5vw,4.5rem)]";
}

/**
 * Ouverture de la vitrine : sur un champ bleu nuit teinté de la couleur du métier, le nom de la boutique
 * en très grand, puis une bande des articles en photo que l'on fait glisser du pouce. La photo au centre
 * est éclairée, les autres restent dans la pénombre jusqu'à ce qu'elles y arrivent.
 */
export function VitrineHeader({ boutique, produits, nombrePanier, onOuvrirProduit, onOuvrirPanier }: Props) {
  const profil = boutique.typeCommerce ? getCommerceProfile(boutique.typeCommerce) : null;
  const photos = produits.filter((p) => p.images[0]).slice(0, PHOTOS_MAX);
  const avecBande = photos.length >= 3;
  const quoi = [profil?.label, boutique.ville ? `à ${boutique.ville}` : null].filter(Boolean).join(" ");

  return (
    <header
      className="text-white"
      style={{ backgroundColor: "color-mix(in srgb, var(--sector) 28%, #0F1B33)" }}
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col px-5 pb-10 pt-5 sm:px-8 sm:pb-14 sm:pt-7">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-white/75 sm:grid-cols-12">
          <p className="col-span-1 sm:col-span-3">{quoi || "Vitrine en ligne"}</p>
          <p className="hidden sm:col-span-3 sm:block">{boutique.adresse ?? ""}</p>
          <p className="hidden sm:col-span-3 sm:block">
            {boutique.telephone ? (
              <a href={toTelHref(boutique.telephone)} className="text-white underline-offset-4 hover:underline">
                {boutique.telephone}
              </a>
            ) : null}
          </p>
          <div className="col-span-1 flex justify-end sm:col-span-3">
            <Button
              size="sm"
              radius="full"
              variant="light"
              onPress={onOuvrirPanier}
              className="-mr-3 -mt-1 font-medium text-white data-[hover=true]:bg-white/10"
              startContent={<IconShoppingBag size={18} aria-hidden />}
            >
              Panier · {nombrePanier}
            </Button>
          </div>
        </div>

        <h1
          className={`mt-8 max-w-[14ch] font-display font-bold leading-[0.92] tracking-[-0.035em] text-balance sm:mt-12 ${tailleDuNom(boutique.nom)}`}
        >
          {boutique.nom}
        </h1>
      </div>

      {avecBande ? <BandePhotos photos={photos} onOuvrir={onOuvrirProduit} /> : null}

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-5 pb-10 pt-8 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pb-12">
        <p className="max-w-[44ch] text-base text-white/85 sm:text-lg">
          {produits.length > 0
            ? `${produits.length} article${produits.length > 1 ? "s" : ""} en stock aujourd'hui. Choisissez, puis envoyez votre commande sur WhatsApp.`
            : "Les nouveautés arrivent. Écrivez-nous sur WhatsApp pour savoir ce qui est disponible."}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {produits.length > 0 ? (
            <Button
              as="a"
              href="#articles"
              size="lg"
              radius="full"
              className="bg-[color:var(--sector)] px-7 font-semibold text-white transition-transform active:scale-[0.97]"
            >
              Voir les articles
            </Button>
          ) : null}
          {boutique.whatsapp ? (
            <a
              href={lienContact(boutique.whatsapp, boutique.nom)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-medium text-white underline-offset-4 hover:underline"
            >
              <IconBrandWhatsapp size={20} aria-hidden />
              Écrire sur WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function BandePhotos({ photos, onOuvrir }: { photos: VitrineProduit[]; onOuvrir: (p: VitrineProduit) => void }) {
  const bande = useRef<HTMLDivElement>(null);
  const [centre, setCentre] = useState(Math.min(1, photos.length - 1));

  useEffect(() => {
    const el = bande.current;
    if (!el) return;
    const cadres = Array.from(el.querySelectorAll<HTMLElement>("[data-cadre]"));
    // On ouvre sur le 2e article : la bande est coupée par les deux bords, on voit qu'elle continue.
    const depart = cadres[Math.min(1, cadres.length - 1)];
    if (depart) el.scrollLeft = depart.offsetLeft - (el.clientWidth - depart.offsetWidth) / 2;

    let attente = 0;
    const mesurer = () => {
      attente = 0;
      const milieu = el.scrollLeft + el.clientWidth / 2;
      let meilleur = 0;
      let ecart = Number.POSITIVE_INFINITY;
      cadres.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - milieu);
        if (d < ecart) {
          ecart = d;
          meilleur = i;
        }
      });
      setCentre(meilleur);
    };
    const auDefilement = () => {
      if (!attente) attente = requestAnimationFrame(mesurer);
    };
    mesurer();
    el.addEventListener("scroll", auDefilement, { passive: true });
    return () => {
      el.removeEventListener("scroll", auDefilement);
      if (attente) cancelAnimationFrame(attente);
    };
  }, [photos.length]);

  const actif = photos[centre];

  return (
    <div>
      <div
        ref={bande}
        role="list"
        aria-label="Articles en photo"
        className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-[max(1.25rem,calc(50vw-18vh))] [scrollbar-width:none] sm:px-[max(2rem,calc(50vw-14vh))] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p, i) => (
          <div key={p.id} role="listitem" data-cadre className="shrink-0 snap-center">
            <Card
              isPressable
              radius="none"
              shadow="none"
              onPress={() => onOuvrir(p)}
              aria-label={`${p.nom}, ${formatCurrency(prixAffiche(p))}`}
              className="block aspect-[4/5] h-[46vh] max-h-[520px] min-h-[260px] overflow-hidden bg-white/5 sm:h-[34vh] sm:min-h-[240px]"
            >
              <img
                src={p.images[0]}
                alt=""
                width={400}
                height={500}
                className={`h-full w-full object-cover transition-[filter,transform] duration-500 ${
                  i === centre ? "vitrine-respire brightness-100" : "brightness-[0.55] hover:brightness-90"
                }`}
              />
            </Card>
          </div>
        ))}
      </div>
      {actif ? (
        <p className="mx-auto mt-3 w-full max-w-[1600px] px-5 text-sm text-white/85 sm:px-8 sm:text-center" aria-live="polite">
          {actif.nom} · <span className="tabular-nums">{formatCurrency(prixAffiche(actif))}</span>
        </p>
      ) : null}
    </div>
  );
}
