"use client";

import { useMyBoutique } from "@/features/boutiques/query/boutiques-queries";
import { resolveTypeCommerce } from "@/lib/commerce";
import { getCommerceConfig, type CommerceConfig } from "@/lib/commerceConfig";
import type { TypeCommerce } from "@/types";

/** Configuration du type de commerce de la boutique connectée (vêtements tant que non chargé). */
export function useCommerceConfig(): { type: TypeCommerce; config: CommerceConfig } {
  const { data } = useMyBoutique();
  const type = resolveTypeCommerce(data?.data.typeCommerce);
  return { type, config: getCommerceConfig(type) };
}
