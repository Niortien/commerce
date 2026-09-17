"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { adminGetCategories } from "../api/categories-api";

export const categorieKeys = {
  all: ["admin-categories"] as const,
  list: () => ["admin-categories", "list"] as const,
};

export function useAdminCategories() {
  const token = useAuthStore((s) => s.accessToken);
  // Lecture ouverte à ADMIN + CAISSIER côté API (voir routes/api.php côté
  // backend) — seules les mutations (create/update/delete) sont réservées
  // à l'ADMIN, voir la vérification de rôle dans CategoriesView.
  return useQuery({
    queryKey: categorieKeys.list(),
    queryFn:  adminGetCategories,
    enabled:  !!token,
    staleTime: 2 * 60_000,
  });
}
