"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { adminGetLookbookPhotos, type AdminLookbookPhotosParams } from "../api/lookbook-photos-api";

export const lookbookPhotoKeys = {
  all: ["admin-lookbook-photos"] as const,
  list: (params: AdminLookbookPhotosParams) => ["admin-lookbook-photos", "list", params] as const,
};

export function useAdminLookbookPhotos(params: AdminLookbookPhotosParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  const user  = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: lookbookPhotoKeys.list(params),
    queryFn:  () => adminGetLookbookPhotos(params),
    enabled:  !!token && user?.role === "ADMIN",
    staleTime: 30_000,
  });
}
