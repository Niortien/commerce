import type { Metadata } from "next";
import { MarketingView } from "@/components/marketing/MarketingView";
import { PLAN_PRIX_FCFA } from "@/lib/pricing";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  alternates: { canonical: "/" },
  description:
    "Gestion de stock et caisse pour les commerces en Côte d'Ivoire : vêtements, restaurant, quincaillerie, pharmacie… Wave, Orange Money. Essai gratuit 14 jours.",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", name: SITE_NAME, url: SITE_URL, inLanguage: "fr" },
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/images/mon-djossi/logo-icone.png`,
      areaServed: { "@type": "Country", name: "Côte d'Ivoire" },
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "fr",
      description: SITE_DESCRIPTION,
      offers: (["MENSUEL", "TRIMESTRIEL", "ANNUEL"] as const).map((plan) => ({
        "@type": "Offer",
        name: `Abonnement ${plan.toLowerCase()}`,
        price: PLAN_PRIX_FCFA[plan],
        priceCurrency: "XOF",
        url: `${SITE_URL}/inscription?plan=${plan}`,
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <MarketingView />
    </>
  );
}
