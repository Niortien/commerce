import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { COMMERCE_PROFILES, TYPES_COMMERCE, sectorStyle } from "@/lib/commerce";
import { slugGuide } from "@/lib/guides";
import { TypeCommerce } from "@/types";

/** Ce que chaque métier trouve en plus des pages communes (caisse, stock, rapports). */
const METIERS: Array<{ type: TypeCommerce; titre: string; points: string[] }> = [
  {
    type: TypeCommerce.RESTAURANT,
    titre: "Le plat vendu, les ingrédients décomptés.",
    points: [
      "Fiche technique de chaque plat : coût matière, marge, portions encore possibles",
      "Vendre un garba retire l'attiéké, le poulet et le piment de la réserve",
      "Sur place avec numéro de table, à emporter ou en livraison",
    ],
  },
  {
    type: TypeCommerce.QUINCAILLERIE,
    titre: "Au mètre, au sac, et à crédit pour les pros.",
    points: [
      "Vente au mètre, au kilo ou au litre (12,5 m de câble), au sac ou au carton",
      "Devis et factures proforma imprimables, transformés en vente en un geste",
      "Crédit clients : plafond, acompte, échéances, retards et relance WhatsApp",
    ],
  },
  {
    type: TypeCommerce.FRIPERIE,
    titre: "Chaque balle sait si elle est rentabilisée.",
    points: [
      "Déballage rapide : pièces uniques numérotées, tas à prix unique, prix ronds",
      "Coût de la balle réparti sur ses articles, jauge de remboursement",
      "Tri 1er / 2e / 3e choix et démarque des pièces qui traînent",
    ],
  },
  {
    type: TypeCommerce.VETEMENTS,
    titre: "Tailles, couleurs et collections.",
    points: [
      "Stock par taille et par couleur, alertes avant la rupture",
      "Promotions datées, reçus au nom de la boutique",
      "Le même esprit pour les chaussures, la beauté ou l'électronique",
    ],
  },
];

const AUTRES = TYPES_COMMERCE.filter((t) => !METIERS.some((m) => m.type === t));

export function MarketingMetiers() {
  return (
    <section id="metiers" className="scroll-mt-20 bg-base pt-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Votre métier"
            title="Un logiciel qui parle votre métier."
            description="À l'inscription, vous choisissez votre type de commerce. Les pages, les mots et les outils s'adaptent : un restaurant parle de plats, une friperie de balles."
          />
        </Reveal>
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {METIERS.map(({ type, titre, points }, i) => {
            const profile = COMMERCE_PROFILES[type];
            const Icon = profile.icon;
            return (
              <li key={type} style={sectorStyle(type)}>
                <Reveal delay={Math.min(i * 0.05, 0.2)} className="h-full">
                  <article className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-surface p-7">
                    <p className="flex items-center gap-2.5 text-sm font-bold text-[color:var(--sector)]">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--sector)_12%,transparent)]">
                        <Icon size={22} aria-hidden />
                      </span>
                      {profile.label}
                    </p>
                    <h3 className="text-xl font-extrabold leading-snug tracking-[-0.015em] text-text">{titre}</h3>
                    <ul className="flex flex-1 flex-col gap-2 text-md leading-relaxed text-text-muted">
                      {points.map((p) => (
                        <li key={p} className="flex gap-2.5">
                          <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--sector)]" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/guides/${slugGuide(type)}`}
                      className="inline-flex min-h-11 w-fit items-center gap-1.5 font-semibold text-[color:var(--sector)] underline-offset-4 hover:underline"
                    >
                      Lire le guide {profile.label.toLowerCase()}
                      <IconArrowRight size={18} aria-hidden />
                    </Link>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 text-md leading-relaxed text-text-muted">
          Aussi disponible pour :{" "}
          {AUTRES.map((t, i) => (
            <span key={t}>
              <Link href={`/guides/${slugGuide(t)}`} className="font-semibold text-text underline-offset-4 hover:underline">
                {COMMERCE_PROFILES[t].label.toLowerCase()}
              </Link>
              {i < AUTRES.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
