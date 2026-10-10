"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AppError, StatutDevis, VenteCreditOptions } from "@/types";
import { changerStatutDevis, convertirDevis, createDevis, type CreateDevisBody } from "../api/devis-api";
import { devisKeys } from "../query/devis-queries";

export function useCreateDevis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDevisBody) => createDevis(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: devisKeys.all });
      toast.success("Devis créé");
    },
    onError: (error: AppError) => toast.error(error?.message ?? "Le devis n'a pas pu être créé"),
  });
}

const STATUT_TOAST: Record<string, string> = {
  ACCEPTE: "Devis marqué accepté",
  ANNULE: "Devis annulé",
  EN_COURS: "Devis remis en cours",
};

export function useChangerStatutDevis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: Exclude<StatutDevis, StatutDevis.CONVERTI> }) =>
      changerStatutDevis(id, statut),
    onSuccess: async (_res, { statut }) => {
      await qc.invalidateQueries({ queryKey: devisKeys.all });
      toast.success(STATUT_TOAST[statut] ?? "Devis mis à jour");
    },
    onError: (error: AppError) => toast.error(error?.message ?? "Le devis n'a pas pu être modifié"),
  });
}

/** Le paiement est enregistré à part (caisse), par l'écran qui convertit. */
export function useConvertirDevis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, credit }: { id: string; credit?: VenteCreditOptions }) => convertirDevis(id, credit),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: devisKeys.all }),
        qc.invalidateQueries({ queryKey: ["sorties"] }),
        qc.invalidateQueries({ queryKey: ["stock"] }),
        qc.invalidateQueries({ queryKey: ["produits"] }),
        qc.invalidateQueries({ queryKey: ["clients"] }),
      ]);
    },
    onError: (error: AppError) => toast.error(error?.message ?? "Le devis n'a pas pu devenir une vente"),
  });
}
