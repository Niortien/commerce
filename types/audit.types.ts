import type { Role, TypeCommerce } from "./enums";

/** Ligne du journal d'audit : qui a fait quoi, sur quoi, et quand. */
export interface AuditLog {
  id: string;
  userId: string | null;
  /** Code de l'action : CONNEXION, CONSULTATION_ESPACE, SORTIE_ANNULER… */
  action: string;
  entityType: string;
  entityId: string | null;
  description: string | null;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    role: Role;
    boutiqueId: string | null;
    boutique?: { id: string; nom: string; typeCommerce: TypeCommerce | null } | null;
  } | null;
}

/** Espace d'un admin ou d'un caissier ouvert par le Super Admin, en lecture seule. */
export interface ConsultationOuverte {
  accessToken: string;
  /** Durée de validité du jeton, en secondes. */
  expireDans: number;
  user: {
    id: string;
    email: string;
    role: Role;
    boutiqueId: string | null;
    boutiqueName: string | null;
    boutiqueStatut: string | null;
  };
}

/** Revenus des abonnements d'un secteur (type de commerce). */
export interface RevenuSecteur {
  typeCommerce: TypeCommerce;
  nbBoutiques: number;
  nbActives: number;
  nbEssai: number;
  nbAbonnementsPayes: number;
  revenusAnnee: number;
  revenusMoisCourant: number;
  /** Abonnements en cours ramenés au mois (annuel ÷ 12, trimestriel ÷ 3). */
  revenuMensuelRecurrent: number;
}

export interface RevenusPlateforme {
  annee: number;
  totalAnnee: number;
  totalMoisCourant: number;
  revenuMensuelRecurrent: number;
  parSecteur: RevenuSecteur[];
  /** Les 12 mois de l'année, avec le détail par secteur (secteurs à zéro absents). */
  parMois: Array<{ mois: string; total: number; parSecteur: Array<{ typeCommerce: TypeCommerce; montant: number }> }>;
}
