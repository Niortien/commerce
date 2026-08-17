import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { Boutique } from "@/types";

export interface CreateBoutiqueBody {
  nom: string;
  adresse?: string;
  ville?: string;
  whatsapp?: string;
}

export const getBoutiques = () =>
  apiGet<Boutique[]>("/boutiques");

export const getBoutiqueById = (id: string) =>
  apiGet<Boutique>(`/boutiques/${id}`);

export const createBoutique = (body: CreateBoutiqueBody) =>
  apiPost<Boutique, CreateBoutiqueBody>("/boutiques", body);

export const updateBoutique = (id: string, body: Partial<CreateBoutiqueBody>) =>
  apiPatch<Boutique, Partial<CreateBoutiqueBody>>(`/boutiques/${id}`, body);

export const deleteBoutique = (id: string) =>
  apiDelete<void>(`/boutiques/${id}`);
