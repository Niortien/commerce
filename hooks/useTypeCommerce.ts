"use client";

import { useMyBoutique } from "@/features/boutiques/query/boutiques-queries";
import { resolveTypeCommerce } from "@/lib/commerce";
import type { TypeCommerce } from "@/types";

/** Type de commerce de la boutique connectée (VETEMENTS tant qu'il n'est pas connu). */
export function useTypeCommerce(): TypeCommerce {
  const { data } = useMyBoutique();
  return resolveTypeCommerce(data?.data?.typeCommerce);
}
