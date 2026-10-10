export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  CAISSIER = "CAISSIER",
}

/** Type de commerce d'une boutique : il décide des pages et du vocabulaire de son espace. */
/**
 * Type de commerce de la boutique. Restaurant, quincaillerie et friperie ont des modules métier ;
 * les autres types utilisent les pages standard avec leur vocabulaire. VETEMENTS est l'ancien « MODE ».
 */
export enum TypeCommerce {
  VETEMENTS = "VETEMENTS",
  RESTAURANT = "RESTAURANT",
  QUINCAILLERIE = "QUINCAILLERIE",
  FRIPERIE = "FRIPERIE",
  CHAUSSURES = "CHAUSSURES",
  ALIMENTATION = "ALIMENTATION",
  SUPERMARCHE = "SUPERMARCHE",
  PHARMACIE = "PHARMACIE",
  ELECTRONIQUE = "ELECTRONIQUE",
  BEAUTE = "BEAUTE",
  AUTRE = "AUTRE",
}

export enum StatutBoutique {
  EN_ATTENTE = "EN_ATTENTE",
  ESSAI = "ESSAI",
  ACTIF = "ACTIF",
  SUSPENDU = "SUSPENDU",
  ARCHIVE = "ARCHIVE",
}

export enum PlanAbonnement {
  ESSAI = "ESSAI",
  MENSUEL = "MENSUEL",
  TRIMESTRIEL = "TRIMESTRIEL",
  ANNUEL = "ANNUEL",
}

export enum StatutAbonnement {
  ACTIF = "ACTIF",
  EXPIRE = "EXPIRE",
  SUSPENDU = "SUSPENDU",
  ANNULE = "ANNULE",
}

export enum TypeMouvement {
  ENTREE = "ENTREE",
  SORTIE = "SORTIE",
  AJUSTEMENT = "AJUSTEMENT",
  RETOUR = "RETOUR",
}

export enum TypeSortie {
  VENTE = "VENTE",
  PERTE = "PERTE",
  DON = "DON",
  RETOUR_FOURNISSEUR = "RETOUR_FOURNISSEUR",
  DEPENSE = "DEPENSE",
}

export enum ModePaiement {
  CASH = "CASH",
  WAVE = "WAVE",
  ORANGE_MONEY = "ORANGE_MONEY",
  CARTE = "CARTE",
  MTN_MONEY = "MTN_MONEY",
}

export enum StatutSession {
  OUVERTE = "OUVERTE",
  FERMEE = "FERMEE",
}

/** Unité de vente d'un produit. Les unités comptées exigent une quantité entière. */
export enum Unite {
  PIECE = "PIECE",
  PORTION = "PORTION",
  SAC = "SAC",
  CARTON = "CARTON",
  BOITE = "BOITE",
  PAQUET = "PAQUET",
  BOUTEILLE = "BOUTEILLE",
  KG = "KG",
  G = "G",
  L = "L",
  M = "M",
  M2 = "M2",
}

/** ARTICLE : vendu tel quel. PLAT : préparé à partir d'ingrédients (restaurant). INGREDIENT : acheté, jamais vendu seul. */
export enum NatureProduit {
  ARTICLE = "ARTICLE",
  PLAT = "PLAT",
  INGREDIENT = "INGREDIENT",
}

/** Restaurant : comment la commande est servie. */
export enum ModeService {
  SUR_PLACE = "SUR_PLACE",
  A_EMPORTER = "A_EMPORTER",
  LIVRAISON = "LIVRAISON",
}

export enum StatutDevis {
  EN_COURS = "EN_COURS",
  ACCEPTE = "ACCEPTE",
  CONVERTI = "CONVERTI",
  ANNULE = "ANNULE",
}

/** Compte d'un client à crédit : il doit (VENTE), il paie (REGLEMENT), une vente est annulée (ANNULATION). */
export enum TypeOperationCredit {
  VENTE = "VENTE",
  REGLEMENT = "REGLEMENT",
  ANNULATION = "ANNULATION",
}

/** Friperie : une balle se déballe (EN_COURS) puis se ferme aux ajouts (TERMINEE). */
export enum StatutBalle {
  EN_COURS = "EN_COURS",
  TERMINEE = "TERMINEE",
}
