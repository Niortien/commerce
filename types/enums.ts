export enum Role {
  ADMIN = "ADMIN",
  VENDEUR = "VENDEUR",
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
