import { IconQuote } from "@tabler/icons-react";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

// À VALIDER : textes rédigés comme brouillons à partir de l'usage réel de Dri Valé. Remplacer par les citations
// exactes du gérant et de l'équipe de caisse avant diffusion large.
const TESTIMONIALS = [
  {
    quote:
      "Grâce à Mon Djossi, nous suivons mieux nos finances, le stock de nos produits et nos recettes. Je vois mes ventes et mes alertes en temps réel, même quand je ne suis pas à la boutique.",
    name: "Le gérant",
    role: "Dri Valé · streetwear, Abidjan",
    avatar: "bg-[var(--mk-ink)]",
  },
  {
    quote:
      "La caisse est simple : on choisit le produit, la taille, on encaisse. Chaque vente est enregistrée en FCFA et le stock se met à jour tout seul.",
    name: "L'équipe caisse",
    role: "Dri Valé · streetwear, Abidjan",
    avatar: "bg-accent",
  },
];

export function MarketingTestimonials() {
  return (
    <section id="temoignages" className="scroll-mt-20 bg-base pt-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Témoignages"
            title="Ils gèrent leur boutique avec Mon Djossi."
            description="Chez Dri Valé, Mon Djossi sert à suivre les finances, le stock des produits et les recettes, au quotidien."
          />
        </Reveal>
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {TESTIMONIALS.map(({ quote, name, role, avatar }, i) => (
            <li key={name}>
              <Reveal delay={i * 0.06} className="h-full">
                <figure className="flex h-full flex-col gap-5 rounded-[28px] border border-border bg-surface p-7 md:p-9">
                  <IconQuote size={38} aria-hidden className="text-accent" />
                  <blockquote className="text-lg leading-relaxed text-text">{quote}</blockquote>
                  <figcaption className="mt-auto flex items-center gap-3">
                    <span aria-hidden className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-brand text-sm font-semibold text-white ${avatar}`}>
                      DV
                    </span>
                    <span>
                      <span className="block text-md font-extrabold text-text">{name}</span>
                      <span className="text-sm text-text-muted">{role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
