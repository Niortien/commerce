import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

/** Vue transverse (toutes boutiques) du Super Admin sur tous les acteurs. */
export interface SuperAdminUser {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "CAISSIER";
  boutiqueId: string | null;
  boutique: { id: string; nom: string } | null;
  createdAt: string;
}

export interface CreateSuperAdminUserBody {
  email: string;
  password: string;
  role: "SUPER_ADMIN" | "ADMIN" | "CAISSIER";
  boutiqueId?: string | null;
}

export interface UpdateSuperAdminUserBody {
  email?: string;
  password?: string;
  role?: "SUPER_ADMIN" | "ADMIN" | "CAISSIER";
  boutiqueId?: string | null;
}

export const getSuperAdminUsers = (params?: { boutiqueId?: string; role?: string }) =>
  apiGet<SuperAdminUser[]>("/super-admin/users", params);

export const createSuperAdminUser = (body: CreateSuperAdminUserBody) =>
  apiPost<SuperAdminUser, CreateSuperAdminUserBody>("/super-admin/users", body);

export const updateSuperAdminUser = (id: string, body: UpdateSuperAdminUserBody) =>
  apiPatch<SuperAdminUser, UpdateSuperAdminUserBody>(`/super-admin/users/${id}`, body);

export const deleteSuperAdminUser = (id: string) =>
  apiDelete<SuperAdminUser>(`/super-admin/users/${id}`);
