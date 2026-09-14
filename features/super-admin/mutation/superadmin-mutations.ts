"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { StatutBoutique } from "@/types";
import {
  changerStatutBoutique,
  deleteSuperAdminBoutique,
  registerBoutique,
  updateSuperAdminBoutique,
} from "../api/superadmin-boutiques-api";
import { createAbonnement, updateAbonnement } from "../api/superadmin-abonnements-api";
import {
  createSuperAdminUser,
  deleteSuperAdminUser,
  updateSuperAdminUser,
} from "../api/superadmin-users-api";
import { superAdminKeys } from "../query/superadmin-queries";

function invalidateBoutiques(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: ["super-admin", "boutiques"] });
}

export function useRegisterBoutique() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registerBoutique,
    onSuccess: () => {
      invalidateBoutiques(qc);
      toast.success("Boutique inscrite avec succès");
    },
    onError: () => toast.error("Erreur lors de l'inscription de la boutique"),
  });
}

export function useUpdateSuperAdminBoutique() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof updateSuperAdminBoutique>[1] }) =>
      updateSuperAdminBoutique(id, body),
    onSuccess: () => {
      invalidateBoutiques(qc);
      toast.success("Boutique mise à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });
}

export function useChangerStatutBoutique() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statut, motif }: { id: string; statut: StatutBoutique; motif?: string }) =>
      changerStatutBoutique(id, statut, motif),
    onSuccess: () => {
      invalidateBoutiques(qc);
      toast.success("Statut de la boutique mis à jour");
    },
    onError: () => toast.error("Erreur lors du changement de statut"),
  });
}

export function useDeleteSuperAdminBoutique() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteSuperAdminBoutique,
    onSuccess: () => {
      invalidateBoutiques(qc);
      toast.success("Boutique archivée / supprimée");
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });
}

export function useCreateAbonnement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAbonnement,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["super-admin", "abonnements"] });
      invalidateBoutiques(qc);
      toast.success("Abonnement enregistré");
    },
    onError: () => toast.error("Erreur lors de l'enregistrement de l'abonnement"),
  });
}

export function useUpdateAbonnement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof updateAbonnement>[1] }) =>
      updateAbonnement(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["super-admin", "abonnements"] });
      invalidateBoutiques(qc);
      toast.success("Abonnement mis à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });
}

export function useCreateSuperAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSuperAdminUser,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["super-admin", "users"] });
      toast.success("Utilisateur créé");
    },
    onError: () => toast.error("Erreur lors de la création"),
  });
}

export function useUpdateSuperAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof updateSuperAdminUser>[1] }) =>
      updateSuperAdminUser(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["super-admin", "users"] });
      toast.success("Utilisateur mis à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });
}

export function useDeleteSuperAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteSuperAdminUser,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["super-admin", "users"] });
      toast.success("Utilisateur supprimé");
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });
}
