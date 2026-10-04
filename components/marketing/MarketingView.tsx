import { MarketingCta } from "@/components/marketing/MarketingCta";
import { MarketingFaq } from "@/components/marketing/MarketingFaq";
import { MarketingFeatures } from "@/components/marketing/MarketingFeatures";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingLifecycle } from "@/components/marketing/MarketingLifecycle";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingPillars } from "@/components/marketing/MarketingPillars";
import { MarketingPlans } from "@/components/marketing/MarketingPlans";
import { MarketingRoles } from "@/components/marketing/MarketingRoles";
import { MarketingVitrine } from "@/components/marketing/MarketingVitrine";

/** Site de présentation du produit Mon Djossi (route `/presentation`). */
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
        <MarketingPillars />
        <MarketingFeatures />
        <MarketingLifecycle />
        <MarketingRoles />
        <MarketingVitrine />
        <MarketingPlans />
        <MarketingFaq />
        <MarketingCta />
      </main>
      <MarketingFooter />
    </>
  );
}
