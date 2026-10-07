import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const STEPS = [
  {
    title: "Inscrivez votre boutique",
    text: "Créez votre compte et choisissez votre formule. L'essai gratuit dure 14 jours.",
  },
  {
    title: "Ajoutez vos produits et vos caissiers",
    text: "Tailles, couleurs, stock de départ et seuils d'alerte. Chaque caissier reçoit son propre accès.",
  },
  {
    title: "Encaissez, suivez, décidez",
    text: "Chaque vente met à jour le stock et le bénéfice du jour. Le soir, votre bilan vous attend.",
  },
];

export function MarketingSteps() {
  return (
    <section id="comment" className="scroll-mt-20 bg-base pt-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Simple dès le premier jour"
            title="Prêt à encaisser en 3 étapes."
            description="Pas besoin d'être informaticien : si vous savez utiliser WhatsApp, vous savez utiliser Mon Djossi."
          />
        </Reveal>
        <ol className="mk-steps relative mt-14 grid gap-6 lg:grid-cols-3">
          {STEPS.map(({ title, text }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.06} className="h-full">
                <article className="relative flex h-full flex-col gap-3.5 rounded-3xl border border-border bg-surface p-7 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_50px_-36px_rgba(15,29,51,0.45)]">
                  <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-accent font-brand text-[22px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-1.5 text-xl font-extrabold leading-snug tracking-[-0.015em] text-text">{title}</h3>
                  <p className="text-md leading-relaxed text-text-muted">{text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
