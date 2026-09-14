import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

/**
 * Caissiers de la boutique de l'ADMIN connecté. Le backend scope
 * automatiquement ces endpoints à sa propre boutique et refuse la création
 * de tout rôle autre que CAISSIER (voir UserController côté API).
 */
export interface AppUser {
  id: string;
  email: string;
  role: "ADMIN" | "CAISSIER";
  boutiqueId: string | null;
  boutique: { id: string; nom: string; ville: string | null } | null;
  createdAt: string;
}

export interface CreateCaissierBody {
  email: string;
  password: string;
}

export interface UpdateCaissierBody {
  email?: string;
  password?: string;
}

export const getUsers = () =>
  apiGet<AppUser[]>("/users");

export const createUser = (body: CreateCaissierBody) =>
  apiPost<AppUser, CreateCaissierBody>("/users", body);

export const updateUser = (id: string, body: UpdateCaissierBody) =>
  apiPatch<AppUser, UpdateCaissierBody>(`/users/${id}`, body);

export const deleteUser = (id: string) =>
  apiDelete<void>(`/users/${id}`);
