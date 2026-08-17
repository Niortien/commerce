"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/authStore";
import { logout } from "../api/auth-api";

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      router.push("/login");
    },
    onError: () => {
      clearAuth();
      router.push("/login");
      toast.error("Déconnexion forcée");
    },
  });
}
