"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AppError } from "@/types";
import {
  createClient,
  deleteClient,
  reglerClient,
  updateClient,
  type ClientBody,
  type ReglementBody,
  type UpdateClientBody,
} from "../api/clients-api";
import { clientKeys } from "../query/clients-queries";

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ClientBody) => createClient(body),
    onSuccess: async (res) => {
      await qc.invalidateQueries({ queryKey: clientKeys.all });
      toast.success(`Client « ${res.data.nom} » ajouté`);
    },
    onError: (error: AppError) => toast.error(error?.message ?? "Le client n'a pas pu être ajouté"),
  });
}

export function useUpdateClient(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateClientBody) => updateClient(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: clientKeys.all });
      toast.success("Fiche client mise à jour");
    },
    onError: (error: AppError) => toast.error(error?.message ?? "La fiche n'a pas pu être modifiée"),
  });
}

/** Un règlement entre aussi dans la caisse : on rafraîchit son résumé. */
export function useReglerClient(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ReglementBody) => reglerClient(id, body),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: clientKeys.all }),
        qc.invalidateQueries({ queryKey: ["caisse"] }),
      ]);
      toast.success("Règlement enregistré");
    },
    onError: (error: AppError) => toast.error(error?.message ?? "Le règlement n'a pas pu être enregistré"),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: clientKeys.all });
      toast.success("Client supprimé");
    },
    onError: (error: AppError) => toast.error(error?.message ?? "Le client n'a pas pu être supprimé"),
  });
}
