import type { ModePaiement, StatutSession } from "./enums";

export interface Transaction {
  id: string;
  sessionId: string;
  sortieId: string | null;
  montant: string;
  modePaiement: ModePaiement;
  reference: string | null;
  notes: string | null;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  dateOuverture: string;
  dateFermeture: string | null;
  montantOuverture: string;
  montantFermeture: string | null;
  statut: StatutSession;
  transactions?: Transaction[];
  user?: { email: string };
}

export interface ResumeJour {
  session: { id: string; statut: StatutSession; montantOuverture: string; dateOuverture: string } | null;
  totalVentes: string;
  totalTransactions: number;
  totalAchats: string;
  totalDepenses: string;
  beneficeNet: string;
  montantADeposer: string;
  parModePaiement: Partial<Record<ModePaiement, string>>;
}
