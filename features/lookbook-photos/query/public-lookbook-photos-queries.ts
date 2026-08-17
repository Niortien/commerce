"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicLookbookPhotos } from "@/lib/vitrine-api";

export const publicLookbookPhotoKeys = {
  all: ["public-lookbook-photos"] as const,
};

export function usePublicLookbookPhotos() {
  return useQuery({
    queryKey: publicLookbookPhotoKeys.all,
    queryFn: getPublicLookbookPhotos,
    staleTime: 60_000,
  });
}
