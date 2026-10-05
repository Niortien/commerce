import type { Metadata } from "next";
import { MarketingView } from "@/components/marketing/MarketingView";
import { PLAN_PRIX_FCFA } from "@/lib/pricing";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Mon Djossi — Logiciel de gestion de boutiques : stock et caisse" },
  alternates: { canonical: "/" },
  description:
    "Mon Djossi réunit stock, caisse et entrées/sorties. Activez, suspendez et renouvelez l'accès de chaque boutique selon son abonnement.",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/images/mon-djossi/logo-icone.png` },
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
