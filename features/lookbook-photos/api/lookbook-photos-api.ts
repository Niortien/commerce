import { apiDelete, apiGet, apiPatch } from "@/lib/api";
import type { LookbookPhoto, LookbookPhotoStatut } from "@/types";

export interface AdminLookbookPhotosParams {
  statut?: LookbookPhotoStatut;
  page?: number;
  limit?: number;
}

export const adminGetLookbookPhotos = (params: AdminLookbookPhotosParams = {}) =>
  apiGet<LookbookPhoto[]>("/lookbook-photos", params as Record<string, unknown>);

export const updateLookbookPhotoStatut = (id: string, statut: LookbookPhotoStatut) =>
  apiPatch<LookbookPhoto, { statut: LookbookPhotoStatut }>(`/lookbook-photos/${id}`, { statut });

export const updateLookbookPhotoPubliee = (id: string, publiee: boolean) =>
  apiPatch<LookbookPhoto, { publiee: boolean }>(`/lookbook-photos/${id}/publier`, { publiee });

export const deleteLookbookPhoto = (id: string) =>
  apiDelete<LookbookPhoto>(`/lookbook-photos/${id}`);
