"use client";

import { useMyBoutique } from "@/features/boutiques/query/boutiques-queries";
import { getCommerceConfig, type CommerceConfig } from "@/lib/commerceConfig";
import type { TypeCommerce } from "@/types";

/** Configuration du type de commerce de la boutique connectée (« Mode » tant que non chargé). */
export function useCommerceConfig(): { type: TypeCommerce | undefined; config: CommerceConfig } {
  const { data } = useMyBoutique();
  const type = data?.data.typeCommerce;
  return { type, config: getCommerceConfig(type) };
}
