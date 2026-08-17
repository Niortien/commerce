"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getUsers } from "../api/users-api";

export const userKeys = {
  all: ["users"] as const,
  list: () => ["users", "list"] as const,
};

export function useUsers() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: getUsers,
    enabled: !!token,
  });
}
