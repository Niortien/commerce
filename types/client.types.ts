import type { ModePaiement, TypeOperationCredit } from "./enums";

/** État du compte, recalculé par le serveur depuis les opérations. */
export interface EtatCompte {
  /** Ce que le client doit ; négatif = avoir en sa faveur. */
  solde: string;
  /** Part du solde dont l'échéance est passée. */
  enRetard: string;
  /** AAAA-MM-JJ : prochaine échéance pas encore passée. */
  prochaineEcheance: string | null;
  /** Retard de l'échéance dépassée la plus ancienne, en jours. */
  joursRetard: number;
  nbVentesOuvertes: number;
}

/** Client professionnel qui peut acheter à crédit (quincaillerie). */
export interface Client extends EtatCompte {
  id: string;
  boutiqueId: string;
  nom: string;
  telephone: string | null;
  /** Encours maximum ; null = sans limite. Fixé par l'admin. */
  plafondCredit: string | null;
  notes: string | null;
  isActif: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Ligne du relevé : vente à crédit, règlement ou annulation de vente. */
export interface OperationCredit {
  id: string;
  clientId: string;
  type: TypeOperationCredit;
  montant: string;
  sortieId: string | null;
  transactionId: string | null;
  modePaiement: ModePaiement | null;
  /** AAAA-MM-JJ, pour une vente. */
  echeance: string | null;
  notes: string | null;
  userId: string;
  createdAt: string;
  /** Solde du compte juste après cette opération. */
  soldeApres: string;
  sortie?: { id: string; reference: string; totalMontant: string } | null;
  user?: { id: string; email: string } | null;
}

export interface ClientDetail extends Client {
  /** La plus récente en tête. */
  operations: OperationCredit[];
}

/** Vente à crédit : le client, son échéance et un éventuel acompte encaissé tout de suite. */
export interface VenteCreditOptions {
  clientId: string;
  echeanceJours: number;
  acompteMontant?: string;
  acompteMode?: ModePaiement;
}
