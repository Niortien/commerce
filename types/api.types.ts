export interface PageMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  pageCount?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: PageMeta;
  timestamp: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface AppError {
  code: number;
  message: string;
  details?: Record<string, unknown>;
}

import type { PlanAbonnement, StatutAbonnement, StatutBoutique } from "./enums";

export interface Boutique {
  id: string;
  nom: string;
  slug: string;
  adresse: string | null;
  ville: string | null;
  whatsapp: string | null;
  email: string | null;
  telephone: string | null;
  logoUrl: string | null;
  isActive: boolean;
  statut: StatutBoutique;
  createdAt: string;
  updatedAt: string;
  /** Présent uniquement sur les endpoints qui l'incluent (ex: /boutiques/me, super-admin) */
  abonnementActif?: Abonnement | null;
  usersCount?: number;
  produitsCount?: number;
}

export interface Abonnement {
  id: string;
  boutiqueId: string;
  plan: PlanAbonnement;
  statut: StatutAbonnement;
  dateDebut: string;
  dateFin: string;
  montant: string | null;
  devise: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  boutique?: Boutique;
}
