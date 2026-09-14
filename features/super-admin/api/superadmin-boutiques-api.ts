import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { Boutique, PlanAbonnement, StatutBoutique } from "@/types";

export interface RegisterBoutiqueBody {
  nom: string;
  adresse?: string;
  ville?: string;
  whatsapp?: string;
  email?: string;
  telephone?: string;
  adminEmail: string;
  adminPassword: string;
  plan?: PlanAbonnement;
  dureeJours?: number;
}

export interface UpdateBoutiqueBody {
  nom?: string;
  adresse?: string;
  ville?: string;
  whatsapp?: string;
  email?: string;
  telephone?: string;
  logoUrl?: string;
}

export const getSuperAdminBoutiques = (params?: { statut?: StatutBoutique; search?: string }) =>
  apiGet<Boutique[]>("/super-admin/boutiques", params);

export const getSuperAdminBoutique = (id: string) =>
  apiGet<Boutique>(`/super-admin/boutiques/${id}`);

export const registerBoutique = (body: RegisterBoutiqueBody) =>
  apiPost<{ boutique: Boutique }, RegisterBoutiqueBody>("/super-admin/boutiques", body);

export const updateSuperAdminBoutique = (id: string, body: UpdateBoutiqueBody) =>
  apiPatch<Boutique, UpdateBoutiqueBody>(`/super-admin/boutiques/${id}`, body);

export const changerStatutBoutique = (id: string, statut: StatutBoutique, motif?: string) =>
  apiPatch<Boutique, { statut: StatutBoutique; motif?: string }>(`/super-admin/boutiques/${id}/statut`, { statut, motif });

export const deleteSuperAdminBoutique = (id: string) =>
  apiDelete<Boutique>(`/super-admin/boutiques/${id}`);
