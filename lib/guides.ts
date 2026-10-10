import { COMMERCE_PROFILES, TYPES_COMMERCE } from "@/lib/commerce";
import { TypeCommerce } from "@/types";

/**
 * Tutoriels d'utilisation, un par type de commerce, écrits pour être compris par un enfant de 10 ans :
 * phrases courtes, exemples concrets, et l'ordre exact dans lequel utiliser les pages.
 */

export interface LienPage {
  libelle: string;
  href: string;
}

export interface EtapeGuide {
  titre: string;
  texte: string;
  /** Ce qu'on touche, dans l'ordre. */
  gestes?: string[];
  astuce?: string;
  attention?: string;
  page?: LienPage;
}

export interface SectionGuide {
  id: string;
  titre: string;
  intro: string;
  /** Les étapes se suivent dans cet ordre. */
  etapes: EtapeGuide[];
}

export interface PageResumee {
  nom: string;
  href: string;
  role: string;
  /** Réservée à l'admin de la boutique. */
  admin?: boolean;
}

export interface Guide {
  type: TypeCommerce;
  slug: string;
  titre: string;
  accroche: string;
  /** Explication « comme à un enfant de 10 ans ». */
  image: string;
  sections: SectionGuide[];
  pages: PageResumee[];
  lexique: Array<{ mot: string; sens: string }>;
  faq: Array<{ q: string; r: string }>;
}

/* ─────────────────────────── Adresses et slugs ─────────────────────────── */

const SLUGS: Record<TypeCommerce, string> = {
  [TypeCommerce.VETEMENTS]: "vetements",
  [TypeCommerce.RESTAURANT]: "restaurant",
  [TypeCommerce.QUINCAILLERIE]: "quincaillerie",
  [TypeCommerce.FRIPERIE]: "friperie",
  [TypeCommerce.CHAUSSURES]: "chaussures",
  [TypeCommerce.ALIMENTATION]: "alimentation",
  [TypeCommerce.SUPERMARCHE]: "supermarche",
  [TypeCommerce.PHARMACIE]: "pharmacie",
  [TypeCommerce.ELECTRONIQUE]: "electronique",
  [TypeCommerce.BEAUTE]: "beaute",
  [TypeCommerce.AUTRE]: "autre",
};

export function slugGuide(type: TypeCommerce): string {
  return SLUGS[type];
}

export function typeDepuisSlug(slug: string): TypeCommerce | null {
  return TYPES_COMMERCE.find((t) => SLUGS[t] === slug) ?? null;
}

const P = {
  dashboard: { libelle: "Dashboard", href: "/dashboard" },
  caisse: { libelle: "Caisse", href: "/caisse" },
  stock: { libelle: "Stock", href: "/stock" },
  entrees: (nom: string) => ({ libelle: nom, href: "/entrees" }),
  sorties: { libelle: "Sorties", href: "/sorties" },
  produits: (nom: string) => ({ libelle: nom, href: "/produits" }),
  categories: (nom: string) => ({ libelle: nom, href: "/admin/categories" }),
  promotions: { libelle: "Promotions", href: "/promotions" },
  activite: { libelle: "Activité", href: "/activite" },
  hebdo: { libelle: "Recette hebdo", href: "/activite/hebdomadaire" },
  boutique: { libelle: "Ma boutique", href: "/admin/boutiques" },
  caissiers: { libelle: "Caissiers", href: "/admin/utilisateurs" },
  messages: { libelle: "Messages", href: "/messages" },
  devis: { libelle: "Devis", href: "/devis" },
  clients: { libelle: "Clients", href: "/clients" },
  balles: { libelle: "Balles", href: "/balles" },
  demarque: { libelle: "Démarque", href: "/demarque" },
} as const;

/* ─────────────────────────── Ce qui change selon le métier ─────────────────────────── */

interface Metier {
  /** Comparaison du quotidien pour l'explication « comme à un enfant ». */
  image: string;
  /** Ce qu'on vend, au singulier : « une robe », « un plat »… */
  exempleArticle: string;
  /** Étape « créer ses produits » du premier jour. */
  produits: EtapeGuide[];
  /** Étape « stock de départ ». */
  stockDepart: EtapeGuide;
  /** Détails propres au métier, au moment de vendre. */
  vente: string[];
  /** Sections propres au métier, insérées après la journée type. */
  sections: SectionGuide[];
  lexique: Array<{ mot: string; sens: string }>;
  faq: Array<{ q: string; r: string }>;
}

function produitsStandard(nomProduits: string, exemple: string, variantes: string): EtapeGuide[] {
  return [
    {
      titre: `Ajouter tes ${nomProduits.toLowerCase()}`,
      texte: `Un produit, c'est une chose que tu vends, par exemple ${exemple}. Pour chacun, l'application doit savoir son nom, son prix de vente, son prix d'achat et dans quelle catégorie le ranger.`,
      gestes: [
        `Ouvre la page « ${nomProduits} » dans le menu.`,
        "Touche le bouton bleu en haut pour ajouter un produit.",
        "Écris le nom, choisis la catégorie, puis le prix de vente et le prix d'achat.",
        variantes,
        "Enregistre. Le produit apparaît dans la liste, avec son stock.",
      ],
      astuce:
        "Le prix d'achat sert à calculer ton bénéfice. Si tu le laisses à zéro, l'application croira que tout ce que tu vends est du bénéfice.",
      page: P.produits(nomProduits),
    },
  ];
}

function stockDepartStandard(nomEntrees: string, nomProduits: string): EtapeGuide {
  return {
    titre: "Dire à l'application ce que tu as déjà en boutique",
    texte: `Ton stock de départ, ce sont les articles déjà posés sur tes étagères. On les enregistre comme une livraison : c'est une « entrée ». Après ça, chaque vente enlèvera toute seule les articles vendus.`,
    gestes: [
      `Ouvre « ${nomEntrees} » puis touche « Nouvelle entrée ».`,
      "Écris le nom du fournisseur (ou « Stock de départ »).",
      `Ajoute chaque article avec sa quantité et son prix d'achat. Si un article n'existe pas encore dans « ${nomProduits} », tu peux le créer directement ici.`,
      "Touche « Enregistrer l'entrée ». Le stock monte aussitôt.",
    ],
    astuce: "Fais-le une seule fois au début. Ensuite, tu ne refais une entrée que lorsqu'une nouvelle livraison arrive.",
    page: P.entrees(nomEntrees),
  };
}

const METIERS: Record<TypeCommerce, Metier> = {
  [TypeCommerce.VETEMENTS]: {
    image:
      "Imagine un grand cahier magique posé sur ton comptoir. Chaque fois que tu vends une robe, le cahier raye la robe tout seul, compte l'argent dans la caisse et te dit le soir combien tu as gagné. Mon Djossi, c'est ce cahier, mais dans ton téléphone.",
    exempleArticle: "une robe wax",
    produits: produitsStandard(
      "Produits",
      "une robe wax ou un jean",
      "Ajoute les variantes : une ligne par taille et par couleur (par exemple « M · Rouge »), avec la quantité que tu as et le seuil d'alerte."
    ),
    stockDepart: stockDepartStandard("Entrées", "Produits"),
    vente: [
      "Quand tu ajoutes un article à la vente, choisis la bonne taille et la bonne couleur : c'est cette variante qui baisse dans le stock.",
    ],
    sections: [
      {
        id: "variantes",
        titre: "Tailles et couleurs : les variantes",
        intro:
          "Une même robe peut exister en S, M et L, et en rouge ou en bleu. Chaque combinaison est une « variante », avec son propre stock. C'est comme des petites boîtes rangées dans une grande.",
        etapes: [
          {
            titre: "Ajouter une taille ou une couleur plus tard",
            texte: "Une nouvelle couleur arrive ? Tu n'as pas besoin de recréer le produit.",
            gestes: ["Ouvre le produit dans « Produits ».", "Ajoute une variante avec la taille, la couleur et la quantité."],
            page: P.produits("Produits"),
          },
          {
            titre: "Le seuil d'alerte",
            texte:
              "Le seuil, c'est le nombre en dessous duquel l'application te prévient. Si tu mets 3, elle te dira « attention » quand il ne reste plus que 3 robes M rouges.",
            astuce: "Mets un seuil plus haut pour ce qui se vend vite.",
          },
        ],
      },
    ],
    lexique: [{ mot: "Variante", sens: "Une taille et une couleur précises d'un produit, avec son propre stock." }],
    faq: [
      {
        q: "Je vends une robe dans une taille que je n'ai pas enregistrée, que faire ?",
        r: "Ajoute d'abord la variante au produit (avec une entrée de stock), puis fais la vente. Sinon l'application ne peut pas l'enlever du stock.",
      },
    ],
  },

  [TypeCommerce.RESTAURANT]: {
    image:
      "Imagine que ton cahier de cuisine sait compter. Quand tu vends un garba, il sait qu'il a fallu un peu d'attiéké, un morceau de poulet et du piment, et il les enlève tout seul de ta réserve. Le soir, il te dit combien tu as gagné et ce qu'il faut racheter.",
    exempleArticle: "un garba poulet",
    produits: [
      {
        titre: "D'abord les ingrédients",
        texte:
          "Les ingrédients, ce sont les choses que tu achètes pour cuisiner : l'attiéké, le poulet, l'huile, le piment. On ne les vend jamais seuls, mais on veut savoir combien il en reste.",
        gestes: [
          "Ouvre « Plats » puis le bouton d'ajout.",
          "Choisis « Ingrédient ».",
          "Écris le nom, choisis l'unité : kilo pour l'attiéké, portion pour le poulet, litre pour l'huile.",
          "Indique le prix d'achat pour une unité (par exemple le prix d'un kilo).",
        ],
        astuce: "Le kilo et le litre acceptent les virgules : 0,25 kg d'attiéké, c'est possible.",
        page: P.produits("Plats"),
      },
      {
        titre: "Ensuite les plats",
        texte: "Un plat, c'est ce que le client commande. Il n'a pas de stock à lui : il est préparé à la commande avec les ingrédients.",
        gestes: ["Dans « Plats », ajoute un produit et choisis « Plat ».", "Écris son nom et son prix de vente pour une portion."],
        page: P.produits("Plats"),
      },
      {
        titre: "La fiche technique de chaque plat",
        texte:
          "La fiche technique, c'est la recette en chiffres : pour UNE portion de garba, il faut 0,25 kg d'attiéké, 1 portion de poulet et 0,02 kg de piment. Avec elle, chaque vente enlève les bons ingrédients de ta réserve.",
        gestes: [
          "Ouvre le plat dans « Plats ».",
          "Dans « Fiche technique », ajoute chaque ingrédient avec la quantité pour une portion.",
          "Regarde le résumé : coût matière, marge, et nombre de portions que tu peux encore servir.",
          "Enregistre.",
        ],
        astuce: "Si la marge est trop petite, augmente le prix du plat ou réduis une quantité.",
        attention: "Sans fiche technique, vendre le plat ne fait pas baisser les ingrédients.",
        page: P.produits("Plats"),
      },
    ],
    stockDepart: {
      titre: "Enregistrer tes premiers achats",
      texte:
        "Le marché du matin, c'est un « achat ». On l'enregistre pour que l'application sache combien d'attiéké ou de poulet tu as en réserve.",
      gestes: [
        "Ouvre « Achats » puis « Nouvelle entrée ».",
        "Écris le fournisseur (par exemple « Marché d'Adjamé »).",
        "Ajoute chaque ingrédient avec la quantité achetée et le prix.",
        "Touche « Enregistrer l'entrée ».",
      ],
      page: P.entrees("Achats"),
    },
    vente: [
      "Choisis comment la commande est servie : sur place (avec le numéro de table), à emporter ou en livraison.",
      "Ajoute les plats : chaque portion vendue retire ses ingrédients de la réserve.",
    ],
    sections: [
      {
        id: "service",
        titre: "Sur place, à emporter ou livraison",
        intro: "À la caisse, tu dis comment le client mange. Ça t'aide à savoir plus tard ce qui marche le mieux.",
        etapes: [
          {
            titre: "Servir à table",
            texte: "Choisis « Sur place » et écris le numéro de la table (par exemple « Table 4 ») : il apparaît sur le reçu.",
            page: P.sorties,
          },
          {
            titre: "Quand un ingrédient manque",
            texte:
              "Si tu veux vendre 30 garbas mais qu'il ne reste que 5 kg d'attiéké, l'application refuse et te dit ce qui manque. Fais d'abord un achat, puis vends.",
            page: P.entrees("Achats"),
          },
        ],
      },
    ],
    lexique: [
      { mot: "Ingrédient", sens: "Ce que tu achètes pour cuisiner. Il ne se vend jamais seul." },
      { mot: "Plat", sens: "Ce que le client commande. Préparé à la commande, sans stock propre." },
      { mot: "Fiche technique", sens: "Les quantités d'ingrédients pour une portion d'un plat." },
      { mot: "Coût matière", sens: "Ce que coûtent les ingrédients d'une portion." },
    ],
    faq: [
      {
        q: "Pourquoi mon plat n'a pas de stock ?",
        r: "Parce qu'il est cuisiné à la commande. Ce sont ses ingrédients qui ont un stock, et ils baissent à chaque vente grâce à la fiche technique.",
      },
      {
        q: "J'ai annulé une vente, les ingrédients reviennent-ils ?",
        r: "Oui. Annuler une vente remet en réserve les ingrédients qu'elle avait retirés.",
      },
    ],
  },

  [TypeCommerce.QUINCAILLERIE]: {
    image:
      "Imagine un vendeur très fort en calcul qui ne dort jamais. Il sait vendre 12,5 mètres de câble, un sac de ciment ou une boîte de vis. Il prépare les devis pour tes clients, il note qui t'achète à crédit et il te dit qui est en retard pour payer.",
    exempleArticle: "un sac de ciment",
    produits: [
      {
        titre: "Ajouter tes articles avec la bonne unité",
        texte:
          "Chaque article se vend d'une certaine façon : le câble au mètre, la peinture au litre, le ciment au sac, les clous au kilo. C'est ce qu'on appelle l'unité.",
        gestes: [
          "Ouvre « Articles » puis le bouton d'ajout.",
          "Écris le nom, choisis le rayon.",
          "Choisis l'unité : pièce, sac, carton, mètre, kilo, litre…",
          "Indique le prix de vente et le prix d'achat pour une unité (un mètre, un sac…).",
        ],
        astuce:
          "Le mètre, le kilo et le litre acceptent les virgules : tu peux vendre 12,5 m de câble. Les pièces et les sacs, eux, se comptent en nombres entiers.",
        page: P.produits("Articles"),
      },
      {
        titre: "Le conditionnement (si tu achètes par carton)",
        texte:
          "Tu achètes les vis par boîte de 100 mais tu les vends à la pièce ? Indique le conditionnement : « Boîte de 100 ». L'application fera la conversion pour toi.",
        page: P.produits("Articles"),
      },
    ],
    stockDepart: stockDepartStandard("Réceptions", "Articles"),
    vente: [
      "Pour un article au mètre ou au kilo, tape la quantité avec une virgule (12,5).",
      "Au moment de payer, choisis « Comptant » ou « À crédit » si c'est un client pro qui paiera plus tard.",
    ],
    sections: [
      {
        id: "devis",
        titre: "Faire un devis (facture proforma)",
        intro:
          "Un devis, c'est une promesse de prix écrite. Le client te demande combien coûtent ses matériaux, tu lui donnes le papier, il revient acheter plus tard. Tant qu'il n'achète pas, rien ne sort du stock.",
        etapes: [
          {
            titre: "Créer le devis",
            texte: "",
            gestes: [
              "Ouvre « Devis » puis « Nouveau devis ».",
              "Écris le nom du client et son téléphone.",
              "Choisis combien de temps le prix reste valable : 7, 15 ou 30 jours.",
              "Ajoute les articles avec la quantité et le prix proposé. Tu peux ajouter une remise.",
              "Touche « Créer le devis ».",
            ],
            page: P.devis,
          },
          {
            titre: "L'imprimer pour le client",
            texte: "Ouvre le devis et touche « Imprimer » : tu obtiens une facture proforma au nom de ta boutique.",
            page: P.devis,
          },
          {
            titre: "Quand le client revient acheter",
            texte:
              "Ouvre le devis, touche « Client d'accord » si tu veux le noter, puis « Encaisser et vendre ». Choisis comptant ou à crédit. C'est seulement maintenant que le stock baisse.",
            attention: "La caisse doit être ouverte (« Commencer la journée ») pour transformer un devis en vente.",
            page: P.devis,
          },
        ],
      },
      {
        id: "credit",
        titre: "Vendre à crédit à tes clients pros",
        intro:
          "Certains clients (un maçon, une entreprise de BTP) prennent la marchandise aujourd'hui et paient plus tard. L'application tient leur compte comme un carnet : ce qu'ils doivent, quand ils doivent payer, et ce qu'ils ont déjà payé.",
        etapes: [
          {
            titre: "Créer la fiche du client",
            texte: "",
            gestes: [
              "Ouvre « Clients » puis « Nouveau client ».",
              "Écris le nom et le téléphone.",
              "Si tu es l'admin, fixe un plafond : le montant maximum qu'il peut te devoir.",
            ],
            astuce: "Tu peux aussi créer le client directement à la caisse, avec le petit bouton à côté du champ « Client ».",
            page: P.clients,
          },
          {
            titre: "Faire une vente à crédit",
            texte: "",
            gestes: [
              "Fais la vente normalement dans « Sorties ».",
              "À l'étape paiement, choisis « À crédit ».",
              "Choisis le client, le délai pour payer (15, 30 ou 60 jours) et, s'il donne une partie maintenant, l'acompte.",
              "Touche « Vendre à crédit ». Le reçu montre l'acompte, le reste dû et la date limite.",
            ],
            attention: "Si la vente dépasse le plafond du client, l'application refuse et te dit combien il peut encore prendre.",
            page: P.sorties,
          },
          {
            titre: "Encaisser un règlement",
            texte: "Le client revient payer tout ou une partie de sa dette.",
            gestes: [
              "Ouvre « Clients » puis sa fiche.",
              "Touche « Encaisser un règlement », écris le montant ou touche « Tout ».",
              "Choisis comment il paie (espèces, Wave…) et encaisse. L'argent entre dans la caisse du jour.",
            ],
            page: P.clients,
          },
          {
            titre: "Relancer un client en retard",
            texte:
              "Quand une date limite est passée, le client devient « En retard » en rouge. Sur sa fiche, « Relancer sur WhatsApp » prépare un message poli avec le montant exact.",
            page: P.clients,
          },
        ],
      },
    ],
    lexique: [
      { mot: "Unité", sens: "La façon de vendre un article : pièce, mètre, kilo, sac…" },
      { mot: "Devis / proforma", sens: "Un prix promis par écrit. Le stock ne bouge pas tant que le client n'achète pas." },
      { mot: "Plafond", sens: "Le montant maximum qu'un client peut te devoir." },
      { mot: "Acompte", sens: "La partie payée tout de suite lors d'une vente à crédit." },
      { mot: "Échéance", sens: "La date limite pour payer une vente à crédit." },
    ],
    faq: [
      {
        q: "Un client paie plus que ce qu'il doit ?",
        r: "L'application refuse : tu ne peux pas encaisser plus que la dette. Elle te dit combien il doit exactement.",
      },
      {
        q: "J'annule une vente à crédit, que devient la dette ?",
        r: "Elle disparaît du compte du client. Un acompte déjà versé reste acquis : il apparaît comme un avoir en sa faveur.",
      },
    ],
  },

  [TypeCommerce.FRIPERIE]: {
    image:
      "Imagine que chaque balle est un gros colis surprise que tu as payé, par exemple 60 000 F. Quand tu l'ouvres, tu sors les habits un par un. L'application partage le prix du colis entre tous les habits, puis elle te montre une jauge : combien d'argent le colis t'a déjà rendu. Quand la jauge est pleine et verte, tout ce que tu vends ensuite est du bénéfice !",
    exempleArticle: "une veste en jean",
    produits: [
      {
        titre: "Pas besoin de créer tes pièces à l'avance",
        texte:
          "En friperie, tes pièces sortent des balles. Tu les crées pendant le déballage, une par une ou par tas (voir plus bas). La page « Pièces » sert à les retrouver ensuite.",
        page: P.produits("Pièces"),
      },
    ],
    stockDepart: {
      titre: "Enregistrer ta première balle",
      texte: "La balle, c'est ton achat. On note ce qu'elle contient et ce qu'elle a coûté.",
      gestes: [
        "Ouvre « Balles » puis « Nouvelle balle ».",
        "Écris ce qu'il y a dedans (par exemple « Jeans femme 45 kg ») et le fournisseur.",
        "Écris le prix de la balle et les frais (transport, dédouanement).",
        "Si tu veux, note un prix conseillé pour le 1er, le 2e et le 3e choix.",
        "Touche « Enregistrer la balle ». La dépense est notée toute seule.",
      ],
      page: P.balles,
    },
    vente: [
      "Une pièce unique se vend toujours une par une : elle passe « Vendue » dès qu'elle est encaissée.",
      "Un tas se vend comme un article normal : tu peux en vendre 3 d'un coup.",
    ],
    sections: [
      {
        id: "deballage",
        titre: "Déballer une balle",
        intro:
          "Déballer, c'est sortir les habits de la balle et les mettre en rayon dans l'application. Chaque pièce reçoit un code (comme B1-014 : balle n°1, pièce n°14) que tu peux écrire sur l'étiquette.",
        etapes: [
          {
            titre: "Une pièce unique",
            texte: "Une belle pièce, seule de son genre (une veste, une robe).",
            gestes: [
              "Ouvre la balle dans « Balles ».",
              "Dans « Déballer », laisse « Pièce unique ».",
              "Choisis la qualité : 1er, 2e ou 3e choix (ou « Non triée »). Si tu as noté un prix conseillé, il se remplit tout seul.",
              "Écris le nom, choisis le rayon, puis le prix. Les boutons 500, 1 000, 2 000… remplissent le prix d'un seul appui.",
              "Touche « Mettre en rayon ». Le curseur revient sur le nom : enchaîne avec la pièce suivante.",
            ],
            astuce: "Le rayon et la qualité restent choisis d'une pièce à l'autre : tu vas très vite.",
            page: P.balles,
          },
          {
            titre: "Un tas à prix unique",
            texte:
              "Des habits presque pareils vendus au même prix, par exemple 12 tee-shirts à 500 F. Au lieu de les saisir un par un, tu fais un seul tas.",
            gestes: [
              "Dans « Déballer », choisis « Tas à prix unique ».",
              "Écris le nombre d'articles dans le tas (par exemple 12).",
              "Écris le nom (« Tas tee-shirts »), le rayon et le prix de chaque article.",
              "Touche « Mettre le tas en rayon ».",
            ],
            astuce: "Le prix de la balle est partagé entre tous les articles : un tas de 12 compte pour 12.",
            page: P.balles,
          },
          {
            titre: "Une erreur de saisie ?",
            texte: "Tant qu'une pièce n'est pas vendue, la petite poubelle de sa ligne la retire de la balle. Le coût se repartage tout seul.",
            page: P.balles,
          },
          {
            titre: "Terminer le déballage",
            texte: "Quand la balle est vide, touche « Terminer le déballage ». Une pièce oubliée ? « Rouvrir le déballage ».",
            page: P.balles,
          },
        ],
      },
      {
        id: "bilan-balle",
        titre: "Lire le bilan d'une balle",
        intro: "Chaque balle a sa jauge et ses chiffres. C'est ta façon de savoir si la balle était une bonne affaire.",
        etapes: [
          {
            titre: "La jauge",
            texte:
              "« Remboursée à 40 % » veut dire que tes ventes ont rendu 40 % du prix de la balle. À 100 %, elle devient verte : « Rentabilisée ».",
            page: P.balles,
          },
          {
            titre: "Les chiffres",
            texte:
              "Coût par article (prix de la balle divisé par le nombre d'articles), encaissé, reste à rembourser ou bénéfice, et valeur encore en rayon. Le tableau « Par qualité » compare tes 1er, 2e et 3e choix.",
            page: P.balles,
          },
        ],
      },
      {
        id: "demarque",
        titre: "Démarquer les pièces qui traînent",
        intro:
          "Une pièce qui reste longtemps en rayon prend la poussière. Démarquer, c'est baisser son prix pour qu'elle parte. L'application garde son ancien prix pour que tu saches ce que tu as baissé.",
        etapes: [
          {
            titre: "Voir les pièces qui attendent",
            texte: "Ouvre « Démarque » et choisis depuis combien de temps : 15, 30, 60 ou 90 jours.",
            page: P.demarque,
          },
          {
            titre: "Baisser le prix",
            texte: "",
            gestes: [
              "Coche les pièces (toutes sont cochées au départ).",
              "Choisis −20 %, −30 %, −50 % ou un prix fixe.",
              "Regarde l'aperçu : ancien total, nouveau total.",
              "Touche « Démarquer » puis confirme.",
            ],
            astuce: "Les prix sont arrondis aux 50 F. Une pièce démarquée repart pour un tour avant d'être proposée à nouveau.",
            attention: "Seul l'admin peut baisser les prix.",
            page: P.demarque,
          },
        ],
      },
    ],
    lexique: [
      { mot: "Balle", sens: "Le gros colis d'habits acheté d'un coup." },
      { mot: "Pièce unique", sens: "Un habit seul de son genre. Il est en rayon ou vendu." },
      { mot: "Tas", sens: "Plusieurs articles semblables vendus au même prix." },
      { mot: "1er / 2e / 3e choix", sens: "La qualité d'une pièce, de la plus belle à la moins belle." },
      { mot: "Démarque", sens: "Baisser le prix d'une pièce qui reste trop longtemps." },
    ],
    faq: [
      {
        q: "Je peux vendre deux fois la même pièce unique ?",
        r: "Non. Dès qu'elle est encaissée, elle passe « Vendue » et ne peut plus être ajoutée à une vente. Si la vente est annulée, elle revient en rayon.",
      },
      {
        q: "Pourquoi le coût par article change pendant le déballage ?",
        r: "Parce que le prix de la balle est partagé entre tous les articles sortis. Plus tu en sors, plus chaque article coûte peu.",
      },
    ],
  },

  // Types sans module métier : pages standard, vocabulaire et exemples adaptés.
  [TypeCommerce.CHAUSSURES]: standard(
    "une paire de baskets",
    "Imagine un grand cahier magique : chaque fois que tu vends une paire de baskets en pointure 42, il raye la bonne pointure, compte l'argent et te dit le soir combien tu as gagné.",
    "Ajoute les variantes : une ligne par pointure et par couleur (par exemple « 42 · Noir »), avec la quantité."
  ),
  [TypeCommerce.ALIMENTATION]: standard(
    "un sac de riz",
    "Imagine un cahier magique dans ton magasin : chaque fois que tu vends un sac de riz ou une bouteille d'huile, il l'enlève du stock, compte l'argent et te prévient quand il faut recommander.",
    "Si un produit existe en plusieurs formats (500 g, 1 kg, 25 kg), ajoute une variante par format."
  ),
  [TypeCommerce.SUPERMARCHE]: standard(
    "un carton de lait",
    "Imagine un cahier magique pour tout ton supermarché : chaque passage en caisse enlève les articles du stock, et l'application te dit quels rayons se vident.",
    "Pour un même produit en plusieurs formats ou marques, ajoute une variante par format."
  ),
  [TypeCommerce.PHARMACIE]: standard(
    "une boîte de paracétamol",
    "Imagine un cahier magique à côté du comptoir : chaque boîte vendue est enlevée du stock, et il te prévient avant qu'un médicament manque.",
    "Si un médicament existe en plusieurs dosages ou formats, ajoute une variante par dosage."
  ),
  [TypeCommerce.ELECTRONIQUE]: standard(
    "des écouteurs Bluetooth",
    "Imagine un cahier magique qui connaît chaque téléphone de ta vitrine : il raye celui que tu vends, compte l'argent et te dit ce qui part le mieux.",
    "Ajoute une variante par capacité ou couleur (par exemple « 128 Go · Noir »)."
  ),
  [TypeCommerce.BEAUTE]: standard(
    "un pot de beurre de karité",
    "Imagine un cahier magique pour ton institut ou ta boutique : chaque produit vendu est enlevé du stock et l'argent est compté pour toi.",
    "Si un produit existe en plusieurs contenances ou teintes, ajoute une variante pour chacune."
  ),
  [TypeCommerce.AUTRE]: standard(
    "un article",
    "Imagine un grand cahier magique : chaque fois que tu vends quelque chose, il l'enlève de ton stock, compte l'argent dans la caisse et te dit le soir combien tu as gagné.",
    "Si un article existe en plusieurs versions (taille, format, couleur), ajoute une variante pour chacune."
  ),
};

function standard(exemple: string, image: string, variantes: string): Metier {
  return {
    image,
    exempleArticle: exemple,
    produits: produitsStandard("Produits", exemple, variantes),
    stockDepart: stockDepartStandard("Entrées", "Produits"),
    vente: [],
    sections: [],
    lexique: [{ mot: "Variante", sens: "Une version précise d'un produit (taille, format, couleur), avec son propre stock." }],
    faq: [],
  };
}

/* ─────────────────────────── Assemblage du guide ─────────────────────────── */

export function getGuide(type: TypeCommerce): Guide {
  const profile = COMMERCE_PROFILES[type];
  const { produits: nomProduits, entrees: nomEntrees, categories: nomCategories } = profile.vocab;
  const m = METIERS[type];
  const quinca = type === TypeCommerce.QUINCAILLERIE;
  const friperie = type === TypeCommerce.FRIPERIE;
  const nomEntreesPage = friperie ? "Balles" : nomEntrees;

  const comprendre: SectionGuide = {
    id: "comprendre",
    titre: "Mon Djossi, c'est quoi ?",
    intro: m.image,
    etapes: [
      {
        titre: "Deux sortes de personnes l'utilisent",
        texte:
          "L'admin, c'est le patron ou la patronne : il règle la boutique, ajoute les produits et les caissiers, et voit tous les chiffres. Le caissier ou la caissière vend au comptoir avec son propre accès. Chacun a son mot de passe.",
      },
      {
        titre: "Tout se fait dans un ordre simple",
        texte:
          "1. On installe la boutique une seule fois (le premier jour). 2. Chaque jour, on ouvre la caisse, on vend, puis on ferme la caisse. 3. De temps en temps, on regarde les chiffres et on réapprovisionne.",
      },
      {
        titre: "Le menu",
        texte:
          "Sur ordinateur, le menu est à gauche. Sur téléphone, touche les trois traits en haut. Les pages sont rangées en trois groupes : Pilotage (les chiffres), Opérations (vendre, recevoir) et Catalogue (ce que tu vends).",
      },
    ],
  };

  const installation: SectionGuide = {
    id: "installation",
    titre: "Le premier jour : installer ta boutique",
    intro: "Tu fais ces étapes une seule fois, dans cet ordre. Compte une heure si tu as beaucoup d'articles.",
    etapes: [
      {
        titre: "Créer ton compte",
        texte: `Sur le site, touche « Essai gratuit ». Choisis le type de ton commerce (${profile.label}), écris le nom de la boutique, ton numéro et ton email. L'essai dure 14 jours.`,
        attention: "Le type de commerce décide des pages que tu verras. Ensuite, seul le support Mon Djossi peut le changer.",
      },
      {
        titre: "Remplir « Ma boutique »",
        texte: "Ces informations apparaissent sur tes reçus : nom, ville, adresse, numéro WhatsApp et logo.",
        gestes: ["Ouvre « Ma boutique » dans Administration.", "Complète les champs et enregistre."],
        page: P.boutique,
      },
      {
        titre: `Ranger : les ${nomCategories.toLowerCase()}`,
        texte: `Les ${nomCategories.toLowerCase()} sont comme les tiroirs de ta boutique. Quelques-uns sont déjà créés pour toi. Tu peux en ajouter, et les regrouper (par exemple ${profile.groupesSuggeres.slice(0, 3).join(", ")}).`,
        gestes: [
          `Ouvre « ${nomCategories} ».`,
          "Touche le bouton d'ajout, écris le nom et, si tu veux, le groupe.",
          "Le petit « + » à côté d'un groupe ajoute directement dedans.",
        ],
        page: P.categories(nomCategories),
      },
      ...m.produits,
      m.stockDepart,
      {
        titre: "Ajouter tes caissiers",
        texte: "Chaque personne qui vend au comptoir a son propre accès. Comme ça, tu sais qui a vendu quoi.",
        gestes: [
          "Ouvre « Caissiers » dans Administration.",
          "Touche « Nouveau caissier », écris son email et un mot de passe.",
          "Donne-lui ces informations : il se connecte sur la même adresse que toi.",
        ],
        astuce: "Un caissier vend et reçoit les livraisons, mais ne voit pas les réglages de la boutique.",
        page: P.caissiers,
      },
    ],
  };

  const journee: SectionGuide = {
    id: "journee",
    titre: "Chaque jour : la routine",
    intro: "Voici l'ordre d'une journée normale. Au bout de deux ou trois jours, tu le feras sans réfléchir.",
    etapes: [
      {
        titre: "Le matin : ouvrir la caisse",
        texte: "Sans caisse ouverte, on ne peut pas vendre. C'est comme ouvrir le rideau de la boutique.",
        gestes: ["Ouvre « Caisse ».", "Touche « Commencer la journée »."],
        page: P.caisse,
      },
      {
        titre: "Toute la journée : vendre",
        texte: `Chaque vente enlève les articles du stock et ajoute l'argent à la caisse. Exemple : tu vends ${m.exempleArticle}.`,
        gestes: [
          "Ouvre « Sorties » puis « Nouvelle sortie ».",
          "Choisis « Vente » puis « Continuer ».",
          "Touche « + Ajouter un article » et choisis ce que le client achète. Corrige la quantité si besoin.",
          ...m.vente,
          "Une réduction ? Écris-la en montant ou en pourcentage.",
          "« Continuer → Paiement », choisis le mode (espèces, Wave, Orange Money, MTN, carte).",
          "En espèces, écris ce que le client te donne : l'application calcule la monnaie à rendre.",
          "Touche « Enregistrer la vente » puis « Imprimer » si tu veux le reçu.",
        ],
        astuce:
          "Pour aller plus vite sur ordinateur, appuie sur Ctrl + K : c'est la barre de commande. Tape une ligne comme « -1 jogging noir L @12000 » (le signe moins pour une vente, + pour une entrée) : l'application te montre ce qu'elle a compris avant de valider.",
        page: P.sorties,
      },
      {
        titre: "Si un article est perdu, abîmé ou donné",
        texte: "Ce n'est pas une vente, mais il faut quand même l'enlever du stock.",
        gestes: ["Dans « Sorties », choisis « Perte » ou « Don » au lieu de « Vente ».", "Pour une petite dépense (transport, sachets), choisis « Dépense »."],
        page: P.sorties,
      },
      {
        titre: quinca ? "Quand une livraison arrive" : friperie ? "Quand une nouvelle balle arrive" : "Quand une livraison arrive",
        texte: friperie
          ? "Enregistre la balle dans « Balles », puis déballe-la (voir plus bas)."
          : `Enregistre-la dans « ${nomEntrees} » : le stock monte tout de suite.`,
        page: P.entrees(nomEntreesPage),
      },
      {
        titre: "Le soir : fermer la caisse",
        texte: "Fermer la caisse range les recettes de la journée. Tu peux toujours relire les jours passés.",
        gestes: ["Ouvre « Caisse ».", "Regarde le total encaissé et le détail par mode de paiement.", "Touche « Terminer la journée » puis « Oui, terminer la journée »."],
        page: P.caisse,
      },
      {
        titre: "Regarder ce que la journée a rapporté",
        texte: "Le « Dashboard » montre les ventes, le bénéfice et les produits qui se vendent le mieux.",
        page: P.dashboard,
      },
    ],
  };

  const rapide: SectionGuide = {
    id: "rapide",
    titre: "Aller vite : importer, scanner, vendre sans internet",
    intro:
      "Trois outils pour gagner du temps. Ils ne sont pas obligatoires, mais quand tu as beaucoup d'articles ou un réseau qui coupe, ils changent la vie.",
    etapes: [
      {
        titre: "Importer tout ton catalogue d'un coup",
        texte:
          "Au lieu de créer 300 articles un par un, tu les écris dans un tableau Excel (ou Google Sheets) et tu l'envoies. L'application crée les articles, les catégories qui manquent et ton stock de départ en une seule fois.",
        gestes: [
          friperie ? `Ouvre « ${nomProduits} » et touche « Importer ».` : `Ouvre « ${nomProduits} » (ou « ${nomEntrees} ») et touche « Importer ».`,
          "Touche « Modèle » : un fichier d'exemple se télécharge, avec les bonnes colonnes.",
          "Remplis-le : une ligne par article. Même nom sur deux lignes = deux tailles ou deux couleurs du même article.",
          "Touche « Choisir le fichier » et prends ton fichier Excel (.xlsx) ou CSV. L'application vérifie tout et te montre ce qu'elle va créer, sans rien enregistrer.",
          "Si tout est bon, touche « Importer ». Les lignes avec une erreur sont mises de côté, avec leur numéro.",
        ],
        astuce: "Tu peux réimporter le même fichier corrigé : les articles déjà créés ne sont pas doublés, leur quantité s'ajoute au stock.",
        attention: "L'import est réservé à l'admin.",
        page: P.produits(nomProduits),
      },
      {
        titre: "Scanner les codes-barres",
        texte:
          "Un code-barres, ce sont les petites barres noires sur l'étiquette. Une fois enregistré sur un article, il suffit de le scanner à la caisse : l'article s'ajoute tout seul à la vente.",
        gestes: [
          "Ouvre l'article dans « " + nomProduits + " » et descends jusqu'à « Codes-barres ».",
          "Scanne l'étiquette avec le bouton caméra (ou un lecteur branché au téléphone ou à l'ordinateur), puis « OK ».",
          "À la caisse, dans « + Ajouter un article », scanne le code : l'article est ajouté.",
        ],
        astuce:
          "Un lecteur USB ou Bluetooth coûte peu cher et va plus vite que la caméra. Il « tape » le code tout seul dans le champ de recherche.",
        page: P.produits(nomProduits),
      },
      {
        titre: "Vendre quand internet coupe",
        texte:
          "Si le réseau tombe en pleine journée, continue à vendre normalement. Un bandeau « Hors connexion » s'affiche : les ventes sont gardées dans le téléphone et partent toutes seules dès que le réseau revient. Chaque vente n'est comptée qu'une fois, même si l'envoi est répété.",
        gestes: [
          "Avant la coupure, la caisse doit avoir été ouverte et la page « Sorties » ouverte au moins une fois sur ce téléphone.",
          "Vends comme d'habitude. Le reçu indique « hors connexion, envoi en attente ».",
          "Au retour d'internet, un message confirme l'envoi. Touche « Voir » dans le bandeau pour suivre les ventes en attente.",
        ],
        attention:
          "Sans internet, la vente à crédit n'est pas possible, et le stock affiché est celui de la dernière connexion. Si une vente est refusée à l'envoi (pièce déjà vendue sur un autre téléphone, par exemple), elle reste dans « Voir » : renvoie-la ou abandonne-la.",
        page: P.sorties,
      },
    ],
  };

  const regulier: SectionGuide = {
    id: "regulier",
    titre: "Chaque semaine : garder la boutique en forme",
    intro: "Ces gestes ne sont pas quotidiens, mais ils évitent les mauvaises surprises.",
    etapes: [
      {
        titre: "Surveiller le stock",
        texte: "La page « Stock » montre ce qui va manquer en premier. Ce qui passe sous le seuil d'alerte remonte en haut.",
        page: P.stock,
      },
      {
        titre: "Lire la recette de la semaine",
        texte: "« Recette hebdo » compare les jours entre eux. « Activité » raconte tout ce qui s'est passé, vente par vente.",
        page: P.hebdo,
      },
      {
        titre: "Lancer une promotion",
        texte: "Choisis un produit, son prix promo et les dates. La promotion s'arrête toute seule à la date de fin.",
        page: P.promotions,
      },
      {
        titre: "Corriger une erreur",
        texte:
          "Une vente enregistrée par erreur ? L'admin peut l'annuler dans « Sorties » : le stock revient. Une quantité fausse dans le stock ? L'admin peut l'ajuster depuis la fiche du produit.",
        attention: "Annuler ou ajuster est réservé à l'admin, et c'est noté dans l'historique.",
      },
      {
        titre: "Besoin d'aide ?",
        texte: "La page « Messages » te met en contact avec l'équipe Mon Djossi. Écris ta question, on te répond ici.",
        page: P.messages,
      },
    ],
  };

  const pages: PageResumee[] = [
    { nom: "Dashboard", href: "/dashboard", role: "Les chiffres du jour en un coup d'œil : ventes, bénéfice, meilleurs produits." },
    { nom: "Activité", href: "/activite", role: "Tout ce qui s'est passé, dans l'ordre." },
    { nom: "Recette hebdo", href: "/activite/hebdomadaire", role: "La recette des 7 derniers jours, jour par jour." },
    { nom: "Caisse", href: "/caisse", role: "Ouvrir et fermer la journée, voir l'argent encaissé." },
    { nom: "Stock", href: "/stock", role: "Combien il reste de chaque article, et ce qui va manquer." },
    friperie
      ? { nom: "Balles", href: "/balles", role: "Enregistrer les balles, les déballer et suivre leur rentabilité." }
      : { nom: nomEntrees, href: "/entrees", role: "Enregistrer ce qui arrive (livraisons, achats)." },
    { nom: "Sorties", href: "/sorties", role: "Vendre, et noter les pertes, dons et dépenses." },
    ...(quinca
      ? [
          { nom: "Devis", href: "/devis", role: "Préparer et imprimer des factures proforma, puis les transformer en ventes." },
          { nom: "Clients", href: "/clients", role: "Les clients à crédit : ce qu'ils doivent, les retards, les règlements." },
        ]
      : []),
    ...(friperie ? [{ nom: "Démarque", href: "/demarque", role: "Baisser le prix des pièces qui traînent.", admin: true }] : []),
    { nom: nomProduits, href: "/produits", role: "Ton catalogue : noms, prix, photos, variantes." },
    { nom: nomCategories, href: "/admin/categories", role: "Les tiroirs où ranger tes produits.", admin: true },
    { nom: "Promotions", href: "/promotions", role: "Les prix réduits pour une période." },
    { nom: "Ma boutique", href: "/admin/boutiques", role: "Les informations qui apparaissent sur tes reçus.", admin: true },
    { nom: "Caissiers", href: "/admin/utilisateurs", role: "Les accès de ton équipe.", admin: true },
    { nom: "Messages", href: "/messages", role: "Parler avec le support Mon Djossi.", admin: true },
  ];

  return {
    type,
    slug: slugGuide(type),
    titre: `Guide ${profile.label.toLowerCase() === "autre commerce" ? "de ton commerce" : `: ${profile.label}`}`,
    accroche: `Comment utiliser Mon Djossi dans ${type === TypeCommerce.AUTRE ? "ton commerce" : `ton commerce de type « ${profile.label} »`}, étape par étape, dans le bon ordre.`,
    image: m.image,
    sections: [comprendre, installation, journee, rapide, ...m.sections, regulier],
    pages,
    lexique: [
      { mot: "Stock", sens: "Ce qui te reste à vendre." },
      { mot: "Entrée", sens: "Ce qui arrive dans la boutique (livraison, achat). Le stock monte." },
      { mot: "Sortie", sens: "Ce qui quitte la boutique (vente, perte, don). Le stock baisse." },
      { mot: "Seuil d'alerte", sens: "Le nombre en dessous duquel l'application te prévient." },
      { mot: "Session de caisse", sens: "Une journée de vente, entre « Commencer » et « Terminer la journée »." },
      { mot: "Code-barres", sens: "Les barres noires d'une étiquette. Scanné à la caisse, il ajoute l'article tout seul." },
      { mot: "Hors connexion", sens: "Sans internet. Les ventes sont gardées dans le téléphone et envoyées au retour du réseau." },
      ...m.lexique,
    ],
    faq: [
      {
        q: "Je n'arrive pas à vendre, pourquoi ?",
        r: "Vérifie que la caisse est ouverte (« Commencer la journée ») et que l'article a du stock. L'application t'explique toujours ce qui bloque en haut de l'écran.",
      },
      {
        q: "Mon caissier peut-il voir mes bénéfices ou supprimer une vente ?",
        r: "Non. Les réglages, les caissiers, les annulations et les ajustements de stock sont réservés à l'admin.",
      },
      { q: "Ça marche sur téléphone ?", r: "Oui. Tout fonctionne sur téléphone, tablette et ordinateur, dans le navigateur. Tu peux aussi l'ajouter à l'écran d'accueil comme une application." },
      {
        q: "Et si internet coupe pendant que je vends ?",
        r: "Continue à vendre : les ventes sont gardées dans le téléphone et envoyées toutes seules au retour du réseau, sans doublon. Seule la vente à crédit attend internet.",
      },
      {
        q: "J'ai des centaines d'articles, je dois tout taper ?",
        r: "Non : remplis le modèle Excel et utilise « Importer » dans la page des produits. Articles, catégories et stock de départ sont créés d'un coup.",
      },
      ...m.faq,
    ],
  };
}
