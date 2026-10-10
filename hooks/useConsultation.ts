"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { consulterBoutique, consulterUtilisateur } from "@/features/super-admin/api/superadmin-consultation-api";
import { useAuthStore } from "@/stores/authStore";
import { Role, type AppError, type ConsultationOuverte } from "@/types";

/**
 * Le Super Admin ouvre l'espace d'un admin ou d'un caissier (lecture seule) puis revient au sien.
 * Le cache est vidé à chaque bascule : les données d'un espace ne doivent pas apparaître dans l'autre.
 */
export function useConsultation() {
  const qc = useQueryClient();
  const router = useRouter();
  const demarrer = useAuthStore((s) => s.demarrerConsultation);
  const terminer = useAuthStore((s) => s.terminerConsultation);

  const entrer = ({ data }: { data: ConsultationOuverte }) => {
    const { user } = data;
    const ok = demarrer(
      data.accessToken,
      {
        id: user.id,
        email: user.email,
        role: user.role,
        boutiqueId: user.boutiqueId,
        boutiqueName: user.boutiqueName,
      },
      data.expireDans
    );
    if (!ok) {
      toast.error("Reconnectez-vous en Super Admin pour consulter un espace");
      return;
    }
    qc.clear();
    // Même page d'arrivée qu'à la connexion de ce compte.
    router.push(user.role === Role.ADMIN ? "/dashboard" : "/stock");
  };

  const onError = (error: AppError) => toast.error(error?.message ?? "Impossible d'ouvrir cet espace");

  const parUtilisateur = useMutation({ mutationFn: (userId: string) => consulterUtilisateur(userId), onSuccess: entrer, onError });
  const parBoutique = useMutation({
    mutationFn: ({ boutiqueId, role }: { boutiqueId: string; role: "ADMIN" | "CAISSIER" }) => consulterBoutique(boutiqueId, role),
    onSuccess: entrer,
    onError,
  });

  const quitter = () => {
    terminer();
    qc.clear();
    router.push("/super-admin/boutiques");
  };

  return {
    ouvrirUtilisateur: parUtilisateur.mutate,
    ouvrirBoutique: parBoutique.mutate,
    quitter,
    isPending: parUtilisateur.isPending || parBoutique.isPending,
  };
}
