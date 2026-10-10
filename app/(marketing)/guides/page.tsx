import type { Metadata } from "next";
import { GuidesIndex } from "@/components/guide/GuidesIndex";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";

export const metadata: Metadata = {
  title: "Guides d'utilisation",
  alternates: { canonical: "/guides" },
  description: "Comment utiliser Mon Djossi, pas à pas, pour chaque type de commerce : vêtements, restaurant, quincaillerie, friperie et plus.",
};

export default function GuidesPage() {
  return (
    <>
      <MarketingNav />
      <main id="contenu" className="bg-base">
        <GuidesIndex />
      </main>
      <MarketingFooter />
    </>
  );
}
