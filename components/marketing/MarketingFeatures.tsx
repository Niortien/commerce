import {
  IconBoxSeam,
  IconBrandWhatsapp,
  IconCashRegister,
  IconChartLine,
  IconPackageImport,
  IconRosetteDiscount,
} from "@tabler/icons-react";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import type { Tone } from "@/components/common/tone";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const TONES: Tone[] = ["accent", "cash", "in", "return", "accent", "in"];

const FEATURES = [
  {
    icon: IconBoxSeam,
    title: "Stock par variante",
    text: "Produits, catégories, tailles de XS à XXXL et alertes de seuil : vous savez ce qu'il reste et quand réapprovisionner.",
  },
  {
    icon: IconCashRegister,
    title: "Caisse en temps réel",
    text: "Sessions de caisse, ventes et reçus 80 mm. L'activité de l'équipe remonte en direct dans le back-office.",
  },
  {
    icon: IconPackageImport,
    title: "Entrées et sorties tracées",
    text: "Chaque mouvement a sa référence : fournisseur et coût à l'entrée, vente ou retour fournisseur à la sortie.",
  },
  {
    icon: IconRosetteDiscount,
    title: "Promotions",
    text: "Créez des promotions sur votre catalogue et suivez leur effet sur les ventes.",
  },
  {
    icon: IconChartLine,
    title: "Rapports du jour et de la semaine",
    text: "Ventes sur 7 jours, top produits, bénéfice net du jour et recette hebdomadaire, sans tableur.",
  },
  {
    icon: IconBrandWhatsapp,
    title: "Abonnement géré boutique par boutique",
    text: "Activez, suspendez et renouvelez l'accès de chaque boutique selon son plan, depuis un seul tableau.",
  },
];

export function MarketingFeatures() {
  return (
    <section id="fonctionnalites" className="scroll-mt-20 bg-base py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Fonctionnalités"
            title="Tout ce qu'il faut pour tenir une boutique, au même endroit"
            description="Du réapprovisionnement à l'encaissement, chaque écran du back-office parle le même langage et partage les mêmes chiffres."
          />
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={Math.min(i * 0.04, 0.2)} className="h-full">
                <SpotlightCard as="article" tone={TONES[i % TONES.length]} className="group h-full p-5 hover:-translate-y-0.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--tone)_14%,transparent)] text-[var(--tone-text)] transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3">
                    <Icon size={20} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-text">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{text}</p>
                </SpotlightCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
