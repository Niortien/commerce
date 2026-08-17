import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

export interface AppUser {
  id: string;
  email: string;
  role: "ADMIN" | "VENDEUR";
  boutiqueId: string | null;
  boutique: { id: string; nom: string; ville: string | null } | null;
  createdAt: string;
}

export interface CreateUserBody {
  email: string;
  password: string;
  role: "ADMIN" | "VENDEUR";
  boutiqueId?: string | null;
}

export interface UpdateUserBody {
  email?: string;
  password?: string;
  role?: "ADMIN" | "VENDEUR";
  boutiqueId?: string | null;
}

export const getUsers = () =>
  apiGet<AppUser[]>("/users");

export const createUser = (body: CreateUserBody) =>
  apiPost<AppUser, CreateUserBody>("/users", body);

export const updateUser = (id: string, body: UpdateUserBody) =>
  apiPatch<AppUser, UpdateUserBody>(`/users/${id}`, body);

export const deleteUser = (id: string) =>
  apiDelete<void>(`/users/${id}`);
