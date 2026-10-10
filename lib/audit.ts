import type { StatusTone } from "@/lib/subscription";
import { Role } from "@/types";

interface ActionMeta {
  label: string;
  tone: StatusTone;
}

/** Libellés des actions du journal ; les suppressions et annulations ressortent en rouge. */
const ACTIONS: Record<string, ActionMeta> = {
  CONNEXION: { label: "Connexion", tone: "neutral" },
  CONSULTATION_ESPACE: { label: "Consultation d'un espace", tone: "return" },
  BOUTIQUE_SELF_REGISTER: { label: "Inscription en ligne", tone: "in" },
  BOUTIQUE_REGISTER: { label: "Boutique inscrite", tone: "in" },
  BOUTIQUE_TYPE_COMMERCE: { label: "Type de commerce changé", tone: "return" },
  BOUTIQUE_ARCHIVE: { label: "Boutique archivée", tone: "out" },
  BOUTIQUE_DESTROY: { label: "Boutique supprimée", tone: "out" },
  ABONNEMENT_UPDATE: { label: "Abonnement modifié", tone: "return" },
  USER_CREATE: { label: "Compte créé", tone: "in" },
  USER_UPDATE: { label: "Compte modifié", tone: "return" },
  USER_DESTROY: { label: "Compte supprimé", tone: "out" },
  ENTREE_ANNULER: { label: "Entrée annulée", tone: "out" },
  ENTREE_DESTROY: { label: "Entrée supprimée", tone: "out" },
  SORTIE_ANNULER: { label: "Vente annulée", tone: "out" },
  SORTIE_DESTROY: { label: "Vente supprimée", tone: "out" },
  DEMARQUE: { label: "Démarque", tone: "return" },
};

/** « SORTIE_DESTROY » → « Sortie destroy » pour une action pas encore traduite. */
function humaniser(code: string): string {
  const texte = code.toLowerCase().replace(/_/g, " ");
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export function actionAudit(code: string): ActionMeta {
  return ACTIONS[code] ?? { label: humaniser(code), tone: "neutral" };
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: "Super admin",
  [Role.ADMIN]: "Admin",
  [Role.CAISSIER]: "Caissier",
};

/** « Aujourd'hui », « Hier » ou « lundi 6 octobre 2026 ». */
export function jourAudit(iso: string): string {
  const d = new Date(iso);
  const auj = new Date();
  const hier = new Date();
  hier.setDate(auj.getDate() - 1);
  const meme = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (meme(d, auj)) return "Aujourd'hui";
  if (meme(d, hier)) return "Hier";
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function heureAudit(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
