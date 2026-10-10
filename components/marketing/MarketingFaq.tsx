"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { formatFcfa, PLAN_PRIX_FCFA } from "@/lib/pricing";

const FAQ = [
  {
    q: "Mon commerce n'est pas une boutique de vêtements, est-ce pour moi ?",
    a: "Oui. À l'inscription, vous choisissez votre type de commerce : vêtements, restaurant, quincaillerie, friperie, chaussures, alimentation, supermarché, pharmacie, électronique, beauté ou autre. Restaurant, quincaillerie et friperie ont en plus leurs propres outils (fiches techniques, devis et crédit, balles et démarque).",
  },
  {
    q: "Comment apprendre à utiliser l'application ?",
    a: "Chaque type de commerce a son guide pas à pas, écrit avec des mots simples : il explique chaque page dans l'ordre où vous allez vous en servir. Il est disponible sur ce site (rubrique Guides) et dans l'application (menu « Guide »).",
  },
  {
    q: "Que se passe-t-il si internet coupe pendant la journée ?",
    a: "La caisse continue de fonctionner : les ventes sont enregistrées sur le téléphone et envoyées automatiquement dès que le réseau revient, sans jamais être comptées deux fois. Seule la vente à crédit attend le retour d'internet.",
  },
  {
    q: "J'ai déjà des centaines d'articles, dois-je tout ressaisir ?",
    a: "Non. Remplissez le modèle Excel fourni (une ligne par article) et importez-le : articles, catégories et stock de départ sont créés d'un coup. Les codes-barres de vos étiquettes peuvent être ajoutés dans le même fichier.",
  },
  {
    q: "Puis-je vendre à crédit à mes clients professionnels ?",
    a: "Oui, en quincaillerie : vous créez la fiche du client avec un plafond, vous vendez à crédit avec ou sans acompte, et l'application suit les échéances, les retards et les règlements, qui entrent dans la caisse du jour.",
  },
  {
    q: "Combien coûte Mon Djossi ?",
    a: `${formatFcfa(PLAN_PRIX_FCFA.MENSUEL)} par mois et par boutique, ${formatFcfa(PLAN_PRIX_FCFA.TRIMESTRIEL)} pour 3 mois ou ${formatFcfa(PLAN_PRIX_FCFA.ANNUEL)} pour un an. L'essai de 14 jours est gratuit, sans paiement.`,
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Pour un plan payant, vous vous inscrivez, puis vous recevez les instructions de paiement sur WhatsApp. Vous réglez par Mobile Money (Wave, Orange Money, MTN) et votre boutique est activée dès que le paiement est confirmé.",
  },
  {
    q: "Que se passe-t-il quand un abonnement expire ?",
    a: "La boutique passe au statut « Suspendue » : les actions de stock et de caisse sont bloquées et une bannière explique la situation à l'admin et aux caissiers. Une fois l'abonnement renouvelé par le Super Admin, l'accès est rétabli.",
  },
  {
    q: "Qui peut inscrire une boutique ?",
    a: "La boutique peut s'inscrire elle-même depuis la page d'inscription, et le Super Admin peut aussi l'inscrire directement avec l'email de son administrateur.",
  },
  {
    q: "Peut-on gérer plusieurs boutiques ?",
    a: "Oui. Chaque boutique a son propre espace, ses produits, son stock, ses caissiers et son abonnement. Le Super Admin les voit toutes et peut consulter l'activité de chacune.",
  },
  {
    q: "Les caissiers ont-ils accès à tout ?",
    a: "Non. La section Administration (boutique, caissiers, catégories) est réservée à l'admin de la boutique.",
  },
  {
    q: "Dans quelle devise sont affichés les montants ?",
    a: "L'interface affiche les montants en FCFA.",
  },
];

export function MarketingFaq() {
  return (
    <section id="faq" className="scroll-mt-20 bg-base pt-[clamp(72px,10vw,128px)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
        <Reveal>
          <SectionHeading eyebrow="Questions fréquentes" title="Vous vous demandez sûrement…" />
        </Reveal>
        <Reveal delay={0.05}>
          <Accordion variant="splitted" selectionMode="multiple" itemClasses={{ base: "!rounded-[20px] !border !border-border !bg-surface !shadow-none" }}>
            {FAQ.map(({ q, a }) => (
              <AccordionItem
                key={q}
                aria-label={q}
                title={<span className="text-md font-semibold text-text">{q}</span>}
                classNames={{ content: "pb-4 text-sm leading-relaxed text-text-muted" }}
              >
                {a}
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
