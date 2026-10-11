import type { Metadata } from "next";
import { COMMERCE_PROFILES } from "@/lib/commerce";
import { getGuide } from "@/lib/guides";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { TypeCommerce } from "@/types";

type OpenGraph = NonNullable<Metadata["openGraph"]>;
type Twitter = NonNullable<Metadata["twitter"]>;

/** Image de partage (copie de app/(marketing)/opengraph-image.png), à adresse fixe pour les pages qui définissent leur Open Graph. */
const IMAGE_PARTAGE = {
  url: "/images/mon-djossi/partage.png",
  width: 1200,
  height: 630,
  alt: "Mon Djossi — gestion de stock et caisse",
};

/**
 * Open Graph d'une page publique. Next remplace en entier celui du layout dès qu'une page en définit un,
 * et abandonne alors l'image du dossier parent : on y remet le nom du site, la langue, le type et l'image.
 */
export function openGraphPage(titre: string, description: string, chemin: string): OpenGraph {
  return {
    type: "website",
    locale: "fr_CI",
    siteName: SITE_NAME,
    url: `${SITE_URL}${chemin}`,
    title: titre,
    description,
    images: [IMAGE_PARTAGE],
  };
}

/** Carte Twitter / X alignée sur l'Open Graph de la page. */
export function twitterPage(titre: string, description: string): Twitter {
  return { card: "summary_large_image", title: titre, description, images: [IMAGE_PARTAGE] };
}

/** Titre, description, adresse canonique et partage d'un guide, ciblés sur « gestion de stock et caisse ». */
export function metadonneesGuide(type: TypeCommerce): Metadata {
  const guide = getGuide(type);
  const chemin = `/guides/${guide.slug}`;
  const estAutre = type === TypeCommerce.AUTRE;
  const nom = COMMERCE_PROFILES[type].label;
  const titre = `Gestion de stock et caisse — ${estAutre ? "tout commerce" : nom}`;
  const description = `Guide pas à pas pour gérer le stock et la caisse ${
    estAutre ? "de votre commerce" : `d'un commerce « ${nom} »`
  } avec Mon Djossi, logiciel de gestion conçu pour la Côte d'Ivoire.`;

  return {
    title: titre,
    description,
    alternates: { canonical: chemin },
    openGraph: openGraphPage(`${titre} | ${SITE_NAME}`, description, chemin),
    twitter: twitterPage(`${titre} | ${SITE_NAME}`, description),
  };
}
