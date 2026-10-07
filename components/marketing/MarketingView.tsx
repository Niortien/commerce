import { MarketingFeatures } from "@/components/marketing/MarketingFeatures";
import dynamic from "next/dynamic";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingSteps } from "@/components/marketing/MarketingSteps";
import { MarketingTrust } from "@/components/marketing/MarketingTrust";

// Sections sous la ligne de flottaison : chargées en morceaux séparés pour alléger le premier affichage.
const MarketingDay = dynamic(() => import("@/components/marketing/MarketingDay").then((m) => m.MarketingDay));
const MarketingTestimonials = dynamic(() => import("@/components/marketing/MarketingTestimonials").then((m) => m.MarketingTestimonials));
const MarketingLifecycle = dynamic(() => import("@/components/marketing/MarketingLifecycle").then((m) => m.MarketingLifecycle));
const MarketingRoles = dynamic(() => import("@/components/marketing/MarketingRoles").then((m) => m.MarketingRoles));
const MarketingPlans = dynamic(() => import("@/components/marketing/MarketingPlans").then((m) => m.MarketingPlans));
const MarketingFaq = dynamic(() => import("@/components/marketing/MarketingFaq").then((m) => m.MarketingFaq));
const MarketingCta = dynamic(() => import("@/components/marketing/MarketingCta").then((m) => m.MarketingCta));

/** Site de présentation du produit Mon Djossi (route `/`). */
export function MarketingView() {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-tooltip focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Aller au contenu
      </a>
      <MarketingNav />
      <main id="contenu">
        <MarketingHero />
        <MarketingTrust />
        <MarketingSteps />
        <MarketingDay />
        <MarketingFeatures />
        <MarketingRoles />
        <MarketingLifecycle />
        <MarketingTestimonials />
        <MarketingPlans />
        <MarketingFaq />
        <MarketingCta />
      </main>
      <MarketingFooter />
    </>
  );
}
