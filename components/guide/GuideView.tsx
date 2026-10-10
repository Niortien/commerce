import type { CSSProperties } from "react";
import Link from "next/link";
import { IconAlertTriangle, IconBulb, IconChevronRight, IconLock } from "@tabler/icons-react";
import { COMMERCE_PROFILES } from "@/lib/commerce";
import type { EtapeGuide, Guide } from "@/lib/guides";
import { GuideDeck } from "./GuideDeck";
import { GuideFaq } from "./GuideFaq";
import { GuideMots } from "./GuideMots";
import { GuideTexteComplet } from "./GuideTexteComplet";

interface GuideViewProps {
  guide: Guide;
  /** Dans l'application, les noms de pages deviennent des liens ; sur le site public, de simples repères. */
  dansApp: boolean;
}

/** Une étape en version texte (dans « Tout le guide à lire »). */
function EtapeTexte({ etape }: { etape: EtapeGuide }) {
  return (
    <li className="pb-5 last:pb-1">
      <h4 className="font-semibold text-text">{etape.titre}</h4>
      {etape.texte && <p className="mt-1 max-w-prose leading-relaxed text-text-muted">{etape.texte}</p>}
      {etape.gestes && (
        <ol className="mt-2 max-w-prose list-decimal space-y-1 pl-5 leading-relaxed text-text marker:text-text-muted">
          {etape.gestes.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ol>
      )}
      {etape.astuce && (
        <p className="mt-2 flex max-w-prose gap-2 text-sm text-in-text">
          <IconBulb size={16} aria-hidden className="mt-0.5 shrink-0" />
          {etape.astuce}
        </p>
      )}
      {etape.attention && (
        <p className="mt-2 flex max-w-prose gap-2 text-sm text-return-text">
          <IconAlertTriangle size={16} aria-hidden className="mt-0.5 shrink-0" />
          {etape.attention}
        </p>
      )}
    </li>
  );
}

function TitreBloc({ id, children, sousTitre }: { id: string; children: string; sousTitre: string }) {
  return (
    <div className="mb-5">
      <h2 id={id} className="text-balance font-display text-2xl font-extrabold tracking-[-0.02em] text-text md:text-[1.75rem]">
        {children}
      </h2>
      <p className="mt-1 text-text-muted">{sousTitre}</p>
    </div>
  );
}

/**
 * Tutoriel d'un type de commerce, pensé pour qui n'aime pas lire : un paquet de cartes à faire glisser
 * (une étape par carte), le menu de l'application tel qu'on le voit, les mots à toucher, les questions
 * fréquentes, et tout le texte replié pour ceux qui veulent quand même lire.
 */
export function GuideView({ guide, dansApp }: GuideViewProps) {
  const { colorVar } = COMMERCE_PROFILES[guide.type];
  const couleurs: CSSProperties & Record<"--sector" | "--sector-soft", string> = {
    "--sector": `var(${colorVar})`,
    "--sector-soft": `var(${colorVar}-soft)`,
  };

  return (
    <div style={couleurs} className="mx-auto max-w-6xl space-y-14 md:space-y-16">
      <GuideDeck guide={guide} dansApp={dansApp} />

      <section id="pages" aria-labelledby="pages-titre" className="scroll-mt-24">
        <TitreBloc id="pages-titre" sousTitre={dansApp ? "Touche une page pour l'ouvrir." : "À quoi sert chaque page, en une phrase."}>
          Le menu, page par page
        </TitreBloc>
        <ul className="overflow-hidden rounded-2xl bg-[var(--sidebar-bg)] p-2 text-[var(--sidebar-text)] shadow-[0_24px_48px_-30px_rgb(8_15_35/0.8)]">
          {guide.pages.map((p) => {
            const contenu = (
              <>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-semibold">
                    {p.nom}
                    {p.admin && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-[var(--sidebar-text-muted)]">
                        <IconLock size={12} aria-hidden />
                        Admin
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-[var(--sidebar-text-muted)]">{p.role}</span>
                </span>
                {dansApp && (
                  <IconChevronRight
                    size={18}
                    aria-hidden
                    className="shrink-0 text-[var(--sidebar-text-muted)] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[color:var(--sector-soft)]"
                  />
                )}
              </>
            );
            return (
              <li key={p.href + p.nom}>
                {dansApp ? (
                  <Link
                    href={p.href}
                    className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-150 hover:bg-[var(--sidebar-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[color:var(--sector-soft)]"
                  >
                    {contenu}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3">{contenu}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section id="lexique" aria-labelledby="lexique-titre" className="scroll-mt-24">
        <TitreBloc id="lexique-titre" sousTitre="Touche un mot pour voir ce qu'il veut dire.">
          Les mots à connaître
        </TitreBloc>
        <GuideMots mots={guide.lexique} />
      </section>

      <section id="faq" aria-labelledby="faq-titre" className="scroll-mt-24">
        <TitreBloc id="faq-titre" sousTitre="Les questions qu'on nous pose le plus.">
          Questions fréquentes
        </TitreBloc>
        <GuideFaq faq={guide.faq} />
      </section>

      <section id="texte" aria-labelledby="texte-titre" className="scroll-mt-24">
        <TitreBloc id="texte-titre" sousTitre="Les mêmes explications, chapitre par chapitre, pour ceux qui préfèrent lire ou imprimer.">
          Tout le guide en texte
        </TitreBloc>
        <GuideTexteComplet
          chapitres={guide.sections.map((s) => ({
            id: s.id,
            titre: s.titre,
            contenu: (
              <div className="pb-2">
                <p className="max-w-prose leading-relaxed text-text-muted">{s.intro}</p>
                <ol className="mt-4">
                  {s.etapes.map((e) => (
                    <EtapeTexte key={e.titre} etape={e} />
                  ))}
                </ol>
              </div>
            ),
          }))}
        />
      </section>
    </div>
  );
}
