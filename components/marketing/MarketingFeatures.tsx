import {
  IconBoxSeam,
  IconBrandWhatsapp,
  IconCashRegister,
  IconChartLine,
  IconPackageImport,
  IconRosetteDiscount,
} from "@tabler/icons-react";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const FEATURES = [
  {
    icon: IconBoxSeam,
    title: "Stock juste, quelle que soit l'unité",
    text: "À la pièce, au mètre, au kilo ou au litre, par taille ou par format, avec des alertes de seuil : vous savez ce qu'il reste et quand réapprovisionner.",
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
    title: "Vente à crédit et devis",
    text: "Pour les clients pros : devis proforma imprimables, ventes à crédit avec acompte et échéance, relance WhatsApp des retards.",
  },
];

export function MarketingFeatures() {
  return (
    <section id="fonctionnalites" className="scroll-mt-20 bg-base pt-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Fonctionnalités"
            title="Tout pour gérer une boutique, au même endroit."
            description="Du réapprovisionnement à l'encaissement, chaque écran du back-office parle le même langage et partage les mêmes chiffres."
          />
        </Reveal>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={Math.min(i * 0.04, 0.2)} className="h-full">
                <article className="group flex h-full flex-col gap-3 rounded-3xl border border-border bg-surface p-7 transition-[transform,border-color] duration-500 hover:-translate-y-1.5 hover:border-[#B6C3D8]">
                  <span className="flex h-[50px] w-[50px] items-center justify-center rounded-2xl bg-accent-dim text-accent-text transition-[transform,background-color,color] duration-500 group-hover:-rotate-[8deg] group-hover:scale-110 group-hover:bg-[#FFF3CC] group-hover:text-[#0F172A]">
                    <Icon size={24} aria-hidden />
                  </span>
                  <h3 className="mt-1.5 text-xl font-extrabold leading-snug tracking-[-0.015em] text-text">{title}</h3>
                  <p className="text-md leading-relaxed text-text-muted">{text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
