import type { Metadata } from "next";
import { GuidesIndex } from "@/components/guide/GuidesIndex";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { openGraphPage } from "@/lib/seo";

const DESCRIPTION =
  "Comment gérer le stock et la caisse avec Mon Djossi, pas à pas, pour chaque type de commerce : vêtements, restaurant, quincaillerie, friperie et plus.";

export const metadata: Metadata = {
  title: "Guides : gestion de stock et caisse par commerce",
  alternates: { canonical: "/guides" },
  description: DESCRIPTION,
  openGraph: openGraphPage("Guides : gestion de stock et caisse par commerce | Mon Djossi", DESCRIPTION, "/guides"),
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
