"use client";

import { IconAlertTriangle, IconClockHour4 } from "@tabler/icons-react";
import { useMyBoutique } from "@/features/boutiques/query/boutiques-queries";
import { daysUntil, formatDaysLeft } from "@/lib/subscription";
import { StatutBoutique } from "@/types";

const BLOCKED_STATUTS = new Set<StatutBoutique>([StatutBoutique.SUSPENDU, StatutBoutique.ARCHIVE]);
const EXPIRY_WARNING_DAYS = 7;

/**
 * Bannière visible par l'ADMIN et le CAISSIER :
 * - abonnement suspendu/archivé → le backend bloque déjà les actions métier (EnsureBoutiqueActive), ceci explique pourquoi ;
 * - abonnement (ou essai) qui se termine dans moins de 7 jours → rappel avant le blocage.
 */
export function SubscriptionBanner() {
  const { data } = useMyBoutique();
  const boutique = data?.data;
  if (!boutique) return null;

  if (BLOCKED_STATUTS.has(boutique.statut)) {
    return (
      <div role="alert" className="flex items-start gap-2 border-b border-out-line bg-out-dim px-4 py-2.5 text-sm text-out-text">
        <IconAlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden />
        <span>
          <strong className="font-semibold">Accès suspendu.</strong> L&apos;abonnement de votre boutique est expiré ou le
          compte est désactivé : les actions de stock et de caisse sont bloquées. Contactez le support pour régulariser.
        </span>
      </div>
    );
  }

  const abonnement = boutique.abonnementActif;
  const days = abonnement ? daysUntil(abonnement.dateFin) : null;
  if (days === null || days > EXPIRY_WARNING_DAYS) return null;

  const isEssai = boutique.statut === StatutBoutique.ESSAI;
  return (
    <div role="status" className="flex items-start gap-2 border-b border-return-line bg-return-dim px-4 py-2.5 text-sm text-return-text">
      <IconClockHour4 size={18} className="mt-0.5 shrink-0" aria-hidden />
      <span>
        <strong className="font-semibold">{isEssai ? "Votre essai se termine bientôt" : "Votre abonnement se termine bientôt"}</strong>{" "}
        — {formatDaysLeft(days).toLowerCase()}. Contactez le support pour le renouveler et éviter toute interruption.
      </span>
    </div>
  );
}
