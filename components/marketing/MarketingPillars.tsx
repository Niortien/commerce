import { IconChartLine, IconCoin, IconBuildingStore } from "@tabler/icons-react";
import { Reveal } from "@/components/marketing/Reveal";

// Les trois verbes de la signature du logo, reliés à ce que fait réellement le produit.
const PILLARS = [
  {
    verb: "Gérez",
    icon: IconBuildingStore,
    text: "Stock par variante, entrées et sorties tracées, caissiers et abonnement de chaque boutique au même endroit.",
  },
  {
    verb: "Vendez",
    icon: IconCoin,
    text: "Caisse en temps réel, reçus imprimables, vitrine en ligne et commandes directement sur WhatsApp.",
  },
  {
    verb: "Développez",
    icon: IconChartLine,
    text: "Rapports du jour et de la semaine, top produits, promotions et plusieurs boutiques sous un même compte.",
  },
];

export function MarketingPillars() {
  return (
    <section aria-label="Gérez, vendez, développez" className="border-b border-border bg-surface py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3 md:gap-6 md:px-6">
        {PILLARS.map(({ verb, icon: Icon, text }, i) => (
          <Reveal key={verb} delay={i * 0.05}>
            <div className="flex items-start gap-4">
              <span className="float-slow flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-dim text-accent-text" style={{ animationDelay: `${i * 0.6}s` }}>
                <Icon size={22} aria-hidden />
              </span>
              <div>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-shimmer-gradient">{verb}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
