export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  CAISSIER = "CAISSIER",
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

export enum Taille {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
  XXXL = "XXXL",
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
