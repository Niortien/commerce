import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { Categorie } from "@/types";

/** `description` = le groupe de la catégorie, libre (« Grillades », « Plomberie »…) ; le serveur génère le slug. */
export interface CreateCategorieBody {
  nom: string;
  slug?: string;
  description?: string | null;
}

export interface UpdateCategorieBody {
  nom?: string;
  slug?: string;
  description?: string | null;
}

export const adminGetCategories = () =>
  apiGet<Categorie[]>("/categories");

export const createCategorie = (body: CreateCategorieBody) =>
  apiPost<Categorie, CreateCategorieBody>("/categories", body);

export const updateCategorie = (id: string, body: UpdateCategorieBody) =>
  apiPatch<Categorie, UpdateCategorieBody>(`/categories/${id}`, body);

export const deleteCategorie = (id: string) =>
  apiDelete<void>(`/categories/${id}`);
