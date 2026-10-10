import {
  IconActivity,
  IconAddressBook,
  IconBoxSeam,
  IconBuildingStore,
  IconCategory2,
  IconCoin,
  IconDiscount,
  IconFileInvoice,
  IconHistory,
  IconLayoutDashboard,
  IconMessageCircle,
  IconPackageExport,
  IconPackageImport,
  IconPackages,
  IconReportMoney,
  IconRosetteDiscount,
  IconUsers,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import type { IconProps } from "@tabler/icons-react";
import { COMMERCE_PROFILES } from "@/lib/commerce";
import { TypeCommerce } from "@/types";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
  /** Pastille de non-lus (messagerie). */
  badge?: "chat";
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

/**
 * Navigation du back-office d'une boutique (ADMIN + CAISSIER), dans le vocabulaire de son type de commerce :
 * un restaurant gère des « Plats » et des « Achats », une friperie des « Pièces » et des « Balles ».
 */
export function getBoutiqueNav(type: TypeCommerce): NavSection[] {
  const { vocab, icon } = COMMERCE_PROFILES[type];
  return [
    {
      label: "Pilotage",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
        { href: "/activite", label: "Activité", icon: IconActivity },
        { href: "/activite/hebdomadaire", label: "Recette hebdo", icon: IconReportMoney },
      ],
    },
    {
      label: "Opérations",
      items: [
        { href: "/caisse", label: "Caisse", icon: IconCoin },
        { href: "/stock", label: "Stock", icon: IconBoxSeam },
        // Friperie : on n'enregistre pas des réceptions mais des balles, déballées pièce par pièce.
        type === TypeCommerce.FRIPERIE
          ? { href: "/balles", label: vocab.entrees, icon: IconPackages }
          : { href: "/entrees", label: vocab.entrees, icon: IconPackageImport },
        { href: "/sorties", label: "Sorties", icon: IconPackageExport },
        // Quincaillerie : les clients demandent un prix avant d'acheter.
        ...(type === TypeCommerce.QUINCAILLERIE
          ? [
              { href: "/devis", label: "Devis", icon: IconFileInvoice },
              // Les clients pros qui achètent à crédit.
              { href: "/clients", label: "Clients", icon: IconAddressBook },
            ]
          : []),
        // Friperie : faire partir les pièces qui traînent en rayon.
        ...(type === TypeCommerce.FRIPERIE ? [{ href: "/demarque", label: "Démarque", icon: IconDiscount }] : []),
      ],
    },
    {
      label: "Catalogue",
      items: [
        { href: "/produits", label: vocab.produits, icon },
        { href: "/admin/categories", label: vocab.categories, icon: IconCategory2 },
        { href: "/promotions", label: "Promotions", icon: IconRosetteDiscount },
      ],
    },
  ];
}

/** Navigation historique (boutique de vêtements). */
export const BOUTIQUE_NAV: NavSection[] = getBoutiqueNav(TypeCommerce.VETEMENTS);

/** Section réservée au rôle ADMIN de la boutique. */
export const BOUTIQUE_ADMIN_NAV: NavSection = {
  label: "Administration",
  items: [
    { href: "/admin/boutiques", label: "Ma boutique", icon: IconBuildingStore },
    { href: "/admin/utilisateurs", label: "Caissiers", icon: IconUsers },
    { href: "/messages", label: "Messages", icon: IconMessageCircle, badge: "chat" },
  ],
};

/**
 * Navigation de la plateforme (SUPER_ADMIN). Avec un secteur choisi, les pages ne montrent que les commerces
 * de ce type : « Restaurants & abonnements », utilisateurs des restaurants…
 */
export function getSuperAdminNav(secteur: TypeCommerce | "TOUS"): NavSection[] {
  const profile = secteur === "TOUS" ? null : COMMERCE_PROFILES[secteur];
  return [
    {
      label: profile ? profile.pluriel : "Plateforme",
      items: [
        {
          href: "/super-admin/boutiques",
          label: profile ? `${profile.pluriel} & abonnements` : "Boutiques & abonnements",
          icon: profile ? profile.icon : IconBuildingStore,
        },
        { href: "/super-admin/utilisateurs", label: "Utilisateurs", icon: IconUsers },
        { href: "/super-admin/messages", label: "Messages", icon: IconMessageCircle, badge: "chat" },
        { href: "/super-admin/audit", label: "Journal d'audit", icon: IconHistory },
      ],
    },
  ];
}

export const SUPER_ADMIN_NAV: NavSection[] = getSuperAdminNav("TOUS");

/**
 * Renvoie l'item le plus spécifique correspondant à `pathname` (préfixe le plus long),
 * pour que `/activite/hebdomadaire` n'allume pas aussi `/activite` et que `/produits/[id]` allume « Produits ».
 */
export function findActiveHref(sections: NavSection[], pathname: string | null): string | null {
  if (!pathname) return null;
  let best: string | null = null;
  for (const section of sections) {
    for (const { href } of section.items) {
      const matches = pathname === href || pathname.startsWith(`${href}/`);
      if (matches && (best === null || href.length > best.length)) best = href;
    }
  }
  return best;
}
