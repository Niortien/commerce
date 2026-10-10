"use client";

import { useTypeCommerce } from "@/hooks/useTypeCommerce";
import { getGuide } from "@/lib/guides";
import { GuideView } from "./GuideView";

/** Le guide du type de commerce de la boutique connectée, avec des liens vers ses pages. */
export function GuideApp() {
  const type = useTypeCommerce();
  return <GuideView guide={getGuide(type)} dansApp />;
}
