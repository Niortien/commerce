"use client";

import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { StatutBalle, type AppError } from "@/types";
import {
  ajouterPieces,
  changerStatutBalle,
  createBalle,
  deleteBalle,
  retirerPiece,
  updateBalle,
  type CreateBalleBody,
  type PieceBody,
  type UpdateBalleBody,
} from "../api/balles-api";
import { balleKeys } from "../query/balles-queries";

/** Une balle touche aux pièces (produits), au stock et aux entrées (sa dépense). */
const rafraichir = (qc: QueryClient) =>
  Promise.all([
    qc.invalidateQueries({ queryKey: balleKeys.all }),
    qc.invalidateQueries({ queryKey: ["produits"] }),
    qc.invalidateQueries({ queryKey: ["stock"] }),
    qc.invalidateQueries({ queryKey: ["entrees"] }),
  ]);

export function useCreateBalle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBalleBody) => createBalle(body),
    onSuccess: async (res) => {
      await rafraichir(qc);
      toast.success(`Balle n°${res.data.numero} enregistrée`);
    },
    onError: (error: AppError) => toast.error(error?.message ?? "La balle n'a pas pu être enregistrée"),
  });
}

export function useUpdateBalle(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateBalleBody) => updateBalle(id, body),
    onSuccess: async () => {
      await rafraichir(qc);
      toast.success("Balle mise à jour");
    },
    onError: (error: AppError) => toast.error(error?.message ?? "La balle n'a pas pu être modifiée"),
  });
}

export function useChangerStatutBalle(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (statut: StatutBalle) => changerStatutBalle(id, statut),
    onSuccess: async (_res, statut) => {
      await qc.invalidateQueries({ queryKey: balleKeys.all });
      toast.success(statut === StatutBalle.TERMINEE ? "Déballage terminé" : "Déballage rouvert");
    },
    onError: (error: AppError) => toast.error(error?.message ?? "Le déballage n'a pas pu être modifié"),
  });
}

/** Pas de toast de succès : l'écran de déballage montre la pièce ajoutée en tête de liste. */
export function useAjouterPieces(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pieces: PieceBody[]) => ajouterPieces(id, pieces),
    onSuccess: () => rafraichir(qc),
    onError: (error: AppError) => toast.error(error?.message ?? "La pièce n'a pas pu être mise en rayon"),
  });
}

export function useRetirerPiece(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (produitId: string) => retirerPiece(id, produitId),
    onSuccess: async () => {
      await rafraichir(qc);
      toast.success("Pièce retirée de la balle");
    },
    onError: (error: AppError) => toast.error(error?.message ?? "La pièce n'a pas pu être retirée"),
  });
}

export function useDeleteBalle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBalle(id),
    onSuccess: async () => {
      await rafraichir(qc);
      toast.success("Balle supprimée");
    },
    onError: (error: AppError) => toast.error(error?.message ?? "La balle n'a pas pu être supprimée"),
  });
}
