"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AppError } from "@/types";
import {
  createCategorie,
  deleteCategorie,
  updateCategorie,
  type CreateCategorieBody,
  type UpdateCategorieBody,
} from "../api/categories-api";
import { categorieKeys } from "../query/categories-queries";

const invalidateAll = async (qc: ReturnType<typeof useQueryClient>) => {
  await qc.invalidateQueries({ queryKey: categorieKeys.all });
  await qc.invalidateQueries({ queryKey: ["categories"] });
};

export function useCreateCategorie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCategorieBody) => createCategorie(body),
    onSuccess: async () => { await invalidateAll(qc); toast.success("Catégorie créée"); },
    onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur création"),
  });
}

export function useUpdateCategorie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCategorieBody }) =>
      updateCategorie(id, body),
    onSuccess: async () => { await invalidateAll(qc); toast.success("Catégorie mise à jour"); },
    onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur mise à jour"),
  });
}

export function useDeleteCategorie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategorie(id),
    onSuccess: async () => { await invalidateAll(qc); toast.success("Catégorie supprimée"); },
    onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur suppression"),
  });
}
