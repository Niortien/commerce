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
  const user  = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: categorieKeys.list(),
    queryFn:  adminGetCategories,
    enabled:  !!token && user?.role === "ADMIN",
    staleTime: 2 * 60_000,
  });
}
