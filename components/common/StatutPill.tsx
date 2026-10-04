import { IconBan, IconCircleCheck } from "@tabler/icons-react";

/** Statut d'un mouvement : l'icône double la couleur (le sens ne repose jamais sur la couleur seule). */
export function StatutPill({ annulee }: { annulee: boolean }) {
  return annulee ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-out-dim px-2 py-0.5 text-xs font-semibold text-out-text">
      <IconBan size={12} aria-hidden />
      Annulée
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-in-dim px-2 py-0.5 text-xs font-semibold text-in-text">
      <IconCircleCheck size={12} aria-hidden />
      Active
    </span>
  );
}
