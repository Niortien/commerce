import { apiGet, apiPatch, apiPost } from "@/lib/api";
import type { Abonnement, PlanAbonnement, StatutAbonnement } from "@/types";

export interface CreateAbonnementBody {
  boutiqueId: string;
  plan: PlanAbonnement;
  dateDebut?: string;
  dateFin: string;
  montant?: number;
  devise?: string;
  notes?: string;
}

export interface UpdateAbonnementBody {
  statut?: StatutAbonnement;
  dateFin?: string;
  montant?: number;
  notes?: string;
}

export const getAbonnements = (params?: { boutiqueId?: string; statut?: StatutAbonnement }) =>
  apiGet<Abonnement[]>("/super-admin/abonnements", params);

export const createAbonnement = (body: CreateAbonnementBody) =>
  apiPost<Abonnement, CreateAbonnementBody>("/super-admin/abonnements", body);

export const updateAbonnement = (id: string, body: UpdateAbonnementBody) =>
  apiPatch<Abonnement, UpdateAbonnementBody>(`/super-admin/abonnements/${id}`, body);
