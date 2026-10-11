import type { Metadata } from "next";
import { COMMERCE_PROFILES } from "@/lib/commerce";
import { getGuide } from "@/lib/guides";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { TypeCommerce } from "@/types";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * Open Graph d'une page publique. Next remplace en entier celui du layout dès qu'une page en définit un :
 * on y remet donc le nom du site, la langue et le type, sinon le partage perd ces informations.
 */
export function openGraphPage(titre: string, description: string, chemin: string): OpenGraph {
  return {
    type: "website",
    locale: "fr_CI",
    siteName: SITE_NAME,
    url: `${SITE_URL}${chemin}`,
    title: titre,
    description,
  };
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
  };
}
