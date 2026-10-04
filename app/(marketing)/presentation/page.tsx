import type { Metadata } from "next";
import { MarketingView } from "@/components/marketing/MarketingView";

export const metadata: Metadata = {
  title: "Mon Djossi — Gérez vos boutiques selon leur abonnement",
  description:
    "Mon Djossi réunit stock, caisse, entrées/sorties et vitrine en ligne. Activez, suspendez et renouvelez l'accès de chaque boutique selon son abonnement.",
};

export default function PresentationPage() {
  return <MarketingView />;
}
