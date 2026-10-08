import { apiGet, apiPatch } from "@/lib/api";
import type { Boutique, TypeCommerce } from "@/types";

export interface UpdateMyBoutiqueBody {
  nom?: string;
  typeCommerce?: TypeCommerce;
  adresse?: string;
  ville?: string;
  whatsapp?: string;
  email?: string;
  telephone?: string;
  logoUrl?: string;
}

/** Profil de la boutique de l'ADMIN/CAISSIER connecté. */
export const getMyBoutique = () =>
  apiGet<Boutique>("/boutiques/me");

export const updateMyBoutique = (body: UpdateMyBoutiqueBody) =>
  apiPatch<Boutique, UpdateMyBoutiqueBody>("/boutiques/me", body);
