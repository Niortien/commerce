import type { ModePaiement, Taille, TypeSortie } from "./enums";

interface CommandBase {
  raw: string;
  preview?: string;
}

export interface EntreeCommand extends CommandBase {
  action: "ENTREE";
  quantite: number;
  produitSearch: string;
  couleur?: string;
  taille?: Taille;
  prixUnitaire?: string;
  varianteId?: string;
}

export interface SortieCommand extends CommandBase {
  action: "SORTIE";
  type: TypeSortie;
  quantite: number;
  produitSearch: string;
  couleur?: string;
  taille?: Taille;
  prixUnitaire?: string;
  varianteId?: string;
}

export interface TransactionCommand extends CommandBase {
  action: "TRANSACTION";
  montant: string;
  modePaiement: ModePaiement;
  reference?: string;
}

export interface RechercheCommand extends CommandBase {
  action: "RECHERCHE";
  terme: string;
}

export interface FermetureCaisseCommand extends CommandBase {
  action: "FERMETURE_CAISSE";
}

export type ParsedCommand =
  | EntreeCommand
  | SortieCommand
  | TransactionCommand
  | RechercheCommand
  | FermetureCaisseCommand;
