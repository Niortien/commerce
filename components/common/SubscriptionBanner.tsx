"use client";

import { IconAlertTriangle } from "@tabler/icons-react";
import { useMyBoutique } from "@/features/boutiques/query/boutiques-queries";
import { StatutBoutique } from "@/types";

const BLOCKED_STATUTS = new Set<StatutBoutique>([StatutBoutique.SUSPENDU, StatutBoutique.ARCHIVE]);

/**
 * Bannière visible par l'ADMIN et le CAISSIER quand l'abonnement de leur
 * boutique est suspendu/archivé — le backend bloque déjà les actions
 * métier dans ce cas (EnsureBoutiqueActive), ceci explique pourquoi.
 */
export function SubscriptionBanner() {
  const { data } = useMyBoutique();
  const statut = data?.data.statut;

  if (!statut || !BLOCKED_STATUTS.has(statut)) return null;

  return (
    <div className="flex items-center gap-2 border-b border-danger/30 bg-danger/10 px-4 py-2 text-sm text-danger">
      <IconAlertTriangle size={16} className="shrink-0" />
      <span>
        L&apos;accès de votre boutique est actuellement suspendu (abonnement expiré ou compte désactivé).
        Contactez le support pour régulariser votre abonnement.
      </span>
    </div>
  );
}
