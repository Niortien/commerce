"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AppError } from "@/types";
import {
  addProduitImage,
  adjustVarianteStock,
  createProduit,
  deleteVariante,
  deleteProduit,
  reassignProduitBoutique,
  removeProduitImage,
  updateProduit,
  updateVariante,
  type AdjustStockBody,
  type CreateProduitBody,
  type UpdateProduitBody,
  type UpdateVarianteBody,
} from "../api/produits-api";
import { produitKeys } from "../query/produits-queries";

export function useCreateProduit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ body, boutiqueIds }: { body: CreateProduitBody; boutiqueIds?: string[] }) =>
      createProduit(body, boutiqueIds),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
  });
}

export function useUpdateProduit(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateProduitBody) => updateProduit(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
    onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur lors de la mise à jour"),
  });
}

export function useReassignProduitBoutique(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (boutiqueId: string | null) => reassignProduitBoutique(id, boutiqueId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
    onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur lors de la réattribution"),
  });
}

export function useDeleteProduit(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteProduit(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
  });
}

export function useUpdateVariante(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateVarianteBody) => updateVariante(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
  });
}

export function useAdjustStock(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AdjustStockBody) => adjustVarianteStock(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["stock"] });
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
    onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur ajustement stock"),
  });
}

export function useAddProduitImage(produitId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => addProduitImage(produitId, url),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: produitKeys.detail(produitId) });
    },
    onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur ajout image"),
  });
}

export function useRemoveProduitImage(produitId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) => removeProduitImage(produitId, imageId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: produitKeys.detail(produitId) });
    },
    onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur suppression image"),
  });
}

export function useDeleteVariante(produitId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (varianteId: string) => deleteVariante(varianteId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: produitKeys.detail(produitId) });
    },
    onError: (err) => toast.error((err as unknown as AppError).message ?? "Impossible de supprimer la variante"),
  });
}
