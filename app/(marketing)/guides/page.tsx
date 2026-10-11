import type { Metadata } from "next";
import { GuidesIndex } from "@/components/guide/GuidesIndex";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { openGraphPage, twitterPage } from "@/lib/seo";

const TITRE = "Guides : gestion de stock et caisse par commerce";
const DESCRIPTION =
  "Comment gérer le stock et la caisse avec Mon Djossi, pas à pas, pour chaque type de commerce : vêtements, restaurant, quincaillerie, friperie et plus.";

export const metadata: Metadata = {
  title: TITRE,
  alternates: { canonical: "/guides" },
  description: DESCRIPTION,
  openGraph: openGraphPage(`${TITRE} | Mon Djossi`, DESCRIPTION, "/guides"),
  twitter: twitterPage(`${TITRE} | Mon Djossi`, DESCRIPTION),
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
