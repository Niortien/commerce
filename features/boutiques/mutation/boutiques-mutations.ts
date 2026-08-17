"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBoutique, updateBoutique, deleteBoutique } from "../api/boutiques-api";
import { boutiqueKeys } from "../query/boutiques-queries";

export function useCreateBoutique() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBoutique,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: boutiqueKeys.list() });
      toast.success("Boutique créée");
    },
    onError: () => toast.error("Erreur lors de la création"),
  });
}

export function useUpdateBoutique() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof updateBoutique>[1] }) =>
      updateBoutique(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: boutiqueKeys.list() });
      toast.success("Boutique mise à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });
}

export function useDeleteBoutique() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBoutique,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: boutiqueKeys.list() });
      toast.success("Boutique supprimée");
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });
}
