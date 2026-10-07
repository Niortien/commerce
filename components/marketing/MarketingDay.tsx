import { IconBellRinging, IconCashRegister, IconChartBar, IconMoon, IconRefresh } from "@tabler/icons-react";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const MOMENTS = [
  {
    icon: IconBellRinging,
    time: "Le matin",
    title: "Une alerte vous prévient",
    text: "La Robe wax taille M est presque épuisée. Vous recommandez avant la rupture.",
    delay: "0s",
  },
  {
    icon: IconCashRegister,
    time: "Au comptoir",
    title: "Une vente en 3 touches",
    text: "Produit, taille, encaisser. Le reçu s'imprime, le stock se met à jour tout seul.",
    delay: "-6s",
  },
  {
    icon: IconChartBar,
    time: "Le soir",
    title: "Votre bilan vous attend",
    text: "Ventes, bénéfice et produit star : vous savez exactement ce que la journée a rapporté.",
    delay: "-4s",
  },
  {
    icon: IconMoon,
    time: "Avant de fermer",
    title: "Demain se prépare",
    text: "Vous fixez l'objectif de demain et ajustez vos seuils : les prochaines alertes seront encore plus justes.",
    delay: "-2s",
  },
];

/** « Votre nouvelle routine » : un point or parcourt la journée et allume chaque moment tour à tour. */
export function MarketingDay() {
  return (
    <section className="mt-[clamp(72px,10vw,128px)] bg-[#0F172A] py-[clamp(72px,9vw,120px)] text-[#F2F5EF]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            onDark
            eyebrow="Votre nouvelle routine"
            title="Mon Djossi travaille avec vous, du matin au soir."
            description="Une alerte au bon moment, une vente en quelques touches, un bilan clair chaque soir. Et le lendemain, tout est prêt."
          />
        </Reveal>
        <div aria-hidden className="mk-rail relative mt-14 h-0.5 rounded-sm bg-[#2A3E5F]" />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MOMENTS.map(({ icon: Icon, time, title, text, delay }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.05} className="h-full">
                <article className="flex h-full flex-col gap-3.5 rounded-3xl border border-[#2A3E5F] bg-[#14213A] p-[26px]">
                  <span className="mk-lit flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#1B2E4F] text-[#8FB2F0]" style={{ animationDelay: delay }}>
                    <Icon size={24} aria-hidden />
                  </span>
                  <p className="text-[13.5px] font-bold uppercase tracking-[0.05em] text-[#B6C3D8]">{time}</p>
                  <h3 className="text-xl font-extrabold leading-snug tracking-[-0.015em] text-white">{title}</h3>
                  <p className="text-md leading-relaxed text-[#C0CCDD]">{text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
        <p className="mt-9 flex items-center gap-3 text-md text-[#C0CCDD]">
          <IconRefresh size={22} aria-hidden className="mk-spin text-[#FFC531]" />
          Et le lendemain, la boucle recommence.
        </p>
      </div>
    </section>
  );
}
