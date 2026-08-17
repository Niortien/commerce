import { MarqueView } from "@/components/vitrine/marque/MarqueView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Marque — Dri Valé | Boutique Yopougon",
  description:
    "Découvrez l'histoire de Dri Valé, notre boutique à Yopougon Abidjan. Vêtements, accessoires et produits importés USA.",
};

export default function MarquePage() {
  return <MarqueView />;
}
