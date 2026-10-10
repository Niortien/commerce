import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { Client, ClientDetail, EtatCompte, ModePaiement, OperationCredit } from "@/types";

export type ClientsListParams = {
  search?: string;
  /** AVEC_SOLDE : qui doit quelque chose ; EN_RETARD : dont une échéance est passée. */
  filtre?: "AVEC_SOLDE" | "EN_RETARD";
  /** Seulement les clients qui peuvent encore acheter à crédit. */
  actifs?: boolean;
};

export interface ClientBody {
  nom: string;
  telephone?: string | null;
  /** Encours maximum (ADMIN) ; null = sans limite. */
  plafondCredit?: number | null;
  notes?: string | null;
}

export type UpdateClientBody = Partial<ClientBody> & { isActif?: boolean };

export interface ReglementBody {
  montant: number;
  modePaiement: ModePaiement;
  notes?: string;
}

export const getClients = (params?: ClientsListParams) => apiGet<Client[]>("/clients", params);

export const getClient = (id: string) => apiGet<ClientDetail>(`/clients/${id}`);

export const createClient = (body: ClientBody) => apiPost<Client, ClientBody>("/clients", body);

/** Modifier la fiche, le plafond ou désactiver le client (ADMIN). */
export const updateClient = (id: string, body: UpdateClientBody) => apiPatch<Client, UpdateClientBody>(`/clients/${id}`, body);

/** Le client paie : l'argent entre dans la caisse ouverte. */
export const reglerClient = (id: string, body: ReglementBody) =>
  apiPost<EtatCompte & { reglement: OperationCredit }, ReglementBody>(`/clients/${id}/reglements`, body);

/** Supprimer un client sans historique (ADMIN). */
export const deleteClient = (id: string) => apiDelete<{ id: string }>(`/clients/${id}`);
