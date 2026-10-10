import { apiPost } from "@/lib/api";
import type { ConsultationOuverte } from "@/types";

/** Ouvrir l'espace d'un compte précis (ADMIN ou CAISSIER), en lecture seule. */
export const consulterUtilisateur = (userId: string) =>
  apiPost<ConsultationOuverte, Record<string, never>>(`/super-admin/users/${userId}/consulter`, {});

/** Ouvrir l'espace admin ou caissier d'une boutique, en lecture seule. */
export const consulterBoutique = (boutiqueId: string, role: "ADMIN" | "CAISSIER") =>
  apiPost<ConsultationOuverte, { role: "ADMIN" | "CAISSIER" }>(`/super-admin/boutiques/${boutiqueId}/consulter`, { role });
