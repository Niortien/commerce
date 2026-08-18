import { MarqueView } from "@/components/vitrine/marque/MarqueView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Marque — Luxury Boutique | Marcory Abidjan",
  description:
    "Découvrez Luxury Boutique, votre boutique multi-marques à Marcory Abidjan. Vêtements, maroquineries, chaussures et accessoires de luxe homme et femme.",
};

export default function MarquePage() {
  return <MarqueView />;
}
