import { apiGet, apiPost } from "@/lib/api";
import type { ModePaiement, ResumeJour, Session, Transaction } from "@/types";

export interface SessionsListParams {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  modePaiement?: ModePaiement;
  dateDebut?: string;
  dateFin?: string;
  boutiqueId?: string;
}

export interface SessionTransactionsParams {
  sortOrder?: "asc" | "desc";
  modePaiement?: ModePaiement;
  dateDebut?: string;
  dateFin?: string;
}

export interface OuvrirSessionBody {
  montantOuverture: string;
}

export interface FermerSessionBody {
  montantFermeture: string;
}

export interface CreateTransactionBody {
  montant: string;
  modePaiement: ModePaiement;
  sortieId?: string;
  reference?: string;
  notes?: string;
}

// GET /caisse/sessions — liste toutes les sessions avec filtres
export const listSessions = (params?: SessionsListParams) =>
  apiGet<Session[]>("/caisse/sessions", params as Record<string, unknown> | undefined);

export const getActiveSession = (boutiqueId?: string) =>
  apiGet<Session | null>("/caisse/sessions/active", boutiqueId ? { boutiqueId } : undefined);

export const ouvrirSession = (body: OuvrirSessionBody, boutiqueId?: string) =>
  apiPost<Session, OuvrirSessionBody>("/caisse/sessions/ouvrir", body, boutiqueId ? { boutiqueId } : undefined);

export const fermerSession = (id: string, body: FermerSessionBody) =>
  apiPost<Session, FermerSessionBody>(`/caisse/sessions/${id}/fermer`, body);

// GET /caisse/sessions/:id/transactions — liste les transactions d'une session
export const listSessionTransactions = (sessionId: string, params?: SessionTransactionsParams) =>
  apiGet<Transaction[]>(`/caisse/sessions/${sessionId}/transactions`, params as Record<string, unknown> | undefined);

export const createTransaction = (body: CreateTransactionBody, boutiqueId?: string) =>
  apiPost<Transaction, CreateTransactionBody>("/caisse/transactions", body, boutiqueId ? { boutiqueId } : undefined);

export const getResumeJour = (boutiqueId?: string) =>
  apiGet<ResumeJour>("/caisse/resume-jour", boutiqueId ? { boutiqueId } : undefined);
