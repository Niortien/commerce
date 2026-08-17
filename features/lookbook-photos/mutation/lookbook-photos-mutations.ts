"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AppError, LookbookPhotoStatut } from "@/types";
import { uploadLookbookPhoto, type UploadLookbookPhotoBody } from "@/lib/vitrine-api";
import {
  deleteLookbookPhoto,
  updateLookbookPhotoPubliee,
  updateLookbookPhotoStatut,
} from "../api/lookbook-photos-api";
import { lookbookPhotoKeys } from "../query/lookbook-photos-queries";
import { publicLookbookPhotoKeys } from "../query/public-lookbook-photos-queries";

const invalidateAll = async (qc: ReturnType<typeof useQueryClient>) => {
  await qc.invalidateQueries({ queryKey: lookbookPhotoKeys.all });
  await qc.invalidateQueries({ queryKey: publicLookbookPhotoKeys.all });
};

export function useUploadLookbookPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UploadLookbookPhotoBody) => uploadLookbookPhoto(body),
    onSuccess: async () => { await invalidateAll(qc); toast.success("Photo ajoutée"); },
    onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur d'envoi"),
  });
}

export function useUpdateLookbookPhotoStatut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: LookbookPhotoStatut }) =>
      updateLookbookPhotoStatut(id, statut),
    onSuccess: async () => { await invalidateAll(qc); },
    onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur mise à jour"),
  });
}

export function useUpdateLookbookPhotoPubliee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, publiee }: { id: string; publiee: boolean }) =>
      updateLookbookPhotoPubliee(id, publiee),
    onSuccess: async (_data, variables) => {
      await invalidateAll(qc);
      toast.success(variables.publiee ? "Photo publiée sur le site" : "Photo retirée du site");
    },
    onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur mise à jour"),
  });
}

export function useDeleteLookbookPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLookbookPhoto(id),
    onSuccess: async () => { await invalidateAll(qc); toast.success("Photo supprimée"); },
    onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur suppression"),
  });
}
