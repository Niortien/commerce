"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AppError } from "@/types";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import {
  annulerSortie,
  createSortie,
  deleteSortie,
  updateSortie,
  type CreateSortieBody,
  type UpdateSortieBody,
} from "../api/sorties-api";
import { sortieKeys } from "../query/sorties-queries";
import { produitKeys } from "@/features/produits/query/produits-queries";

function isAppError(e: unknown): e is AppError {
  return typeof e === "object" && e !== null && "code" in e && "message" in e;
}

export function useCreateSortie() {
  const qc = useQueryClient();
  const boutiqueId = useBoutiqueId();
  return useMutation({
    mutationFn: (body: CreateSortieBody) => createSortie(body, boutiqueId),
    onError: (error) => {
      if (!isAppError(error)) {
        toast.error("Erreur inattendue");
        return;
      }
      if (error.code === 422 && error.details) {
        const disponible = error.details.disponible as number | undefined;
        const demande = error.details.demande as number | undefined;
        toast.error(`Stock insuffisant : ${disponible ?? 0} dispo, ${demande ?? 0} demandé`);
        return;
      }
      if (error.code === 409) {
        toast.error("Ouvre d'abord une session de caisse");
        return;
      }
      toast.error(error.message);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: sortieKeys.all });
      await qc.invalidateQueries({ queryKey: ["stock"] });
      await qc.invalidateQueries({ queryKey: ["caisse"] });
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
  });
}

export function useAnnulerSortie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => annulerSortie(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: sortieKeys.all });
      await qc.invalidateQueries({ queryKey: ["stock"] });
      await qc.invalidateQueries({ queryKey: ["caisse"] });
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
    onError: (error) => {
      if (isAppError(error)) toast.error(error.message);
    },
  });
}

export function useUpdateSortie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateSortieBody }) =>
      updateSortie(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: sortieKeys.all });
    },
    onError: (error) => {
      if (isAppError(error)) toast.error(error.message);
    },
  });
}

export function useDeleteSortie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSortie(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: sortieKeys.all });
      await qc.invalidateQueries({ queryKey: ["stock"] });
      await qc.invalidateQueries({ queryKey: ["caisse"] });
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
    onError: (error) => {
      if (isAppError(error)) toast.error(error.message);
    },
  });
}
