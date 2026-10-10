import Link from "next/link";
import { IconAlertTriangle, IconArrowRight, IconBulb, IconLock } from "@tabler/icons-react";
import { COMMERCE_PROFILES, sectorStyle } from "@/lib/commerce";
import type { EtapeGuide, Guide } from "@/lib/guides";
import { GuideFaq } from "./GuideFaq";

interface GuideViewProps {
  guide: Guide;
  /** Dans l'application, les noms de pages deviennent des liens ; sur le site public, de simples repères. */
  dansApp: boolean;
}

function Etape({ etape, numero, dansApp }: { etape: EtapeGuide; numero: number; dansApp: boolean }) {
  return (
    <li className="grid grid-cols-[2.25rem_1fr] gap-x-3">
      <span
        aria-hidden
        className="tabular flex h-9 w-9 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--sector)_14%,transparent)] text-sm font-bold text-[color:var(--sector)]"
      >
        {numero}
      </span>
      <div className="min-w-0 pb-6">
        <h4 className="text-[17px] font-semibold leading-snug text-text">{etape.titre}</h4>
        {etape.texte && <p className="mt-1.5 max-w-prose leading-relaxed text-text-muted">{etape.texte}</p>}
        {etape.gestes && (
          <ol className="mt-3 max-w-prose list-decimal space-y-1.5 pl-5 leading-relaxed text-text marker:font-semibold marker:text-text-muted">
            {etape.gestes.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ol>
        )}
        {etape.astuce && (
          <p className="mt-3 flex max-w-prose gap-2 rounded-lg bg-in-dim px-3 py-2 text-sm leading-relaxed text-in-text">
            <IconBulb size={18} aria-hidden className="mt-0.5 shrink-0" />
            <span>
              <span className="font-semibold">Astuce : </span>
              {etape.astuce}
            </span>
          </p>
        )}
        {etape.attention && (
          <p className="mt-3 flex max-w-prose gap-2 rounded-lg bg-return-dim px-3 py-2 text-sm leading-relaxed text-return-text">
            <IconAlertTriangle size={18} aria-hidden className="mt-0.5 shrink-0" />
            <span>
              <span className="font-semibold">Attention : </span>
              {etape.attention}
            </span>
          </p>
        )}
        {etape.page &&
          (dansApp ? (
            <Link
              href={etape.page.href}
              className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[color:var(--sector)] underline-offset-2 hover:underline focus-visible:outline-accent"
            >
              Ouvrir « {etape.page.libelle} »
              <IconArrowRight size={16} aria-hidden />
            </Link>
          ) : (
            <p className="mt-3 text-sm text-text-muted">
              Page : <span className="font-semibold text-text">{etape.page.libelle}</span>
            </p>
          ))}
      </div>
    </li>
  );
}

/**
 * Tutoriel d'un type de commerce : comprendre, installer, la journée type, les fonctions du métier,
 * puis les pages une par une, un petit lexique et les questions fréquentes.
 */
export function GuideView({ guide, dansApp }: GuideViewProps) {
  const profile = COMMERCE_PROFILES[guide.type];
  const Icon = profile.icon;
  const sommaire = [
    ...guide.sections.map((s) => ({ id: s.id, titre: s.titre })),
    { id: "pages", titre: "Les pages, une par une" },
    { id: "lexique", titre: "Les mots à connaître" },
    { id: "faq", titre: "Questions fréquentes" },
  ];

  return (
    <div style={sectorStyle(guide.type)} className="mx-auto max-w-6xl">
      <header className="rounded-2xl border border-border bg-surface p-5 md:p-8">
        <p className="flex items-center gap-2 text-sm font-semibold text-[color:var(--sector)]">
          <Icon size={18} aria-hidden />
          {profile.label}
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-text md:text-3xl">{guide.titre}</h1>
        <p className="mt-2 max-w-2xl text-text-muted">{guide.accroche}</p>
      </header>

      <div className="mt-6 grid gap-8 lg:grid-cols-[15rem_1fr]">
        <nav aria-label="Sommaire du guide" className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 text-sm font-semibold text-text">Sommaire</p>
          <ol className="space-y-1 text-sm">
            {sommaire.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex min-h-9 items-center gap-2 rounded-md px-2 text-text-muted hover:bg-surface-high hover:text-text focus-visible:outline-accent"
                >
                  <span className="tabular w-5 text-xs">{i + 1}.</span>
                  {s.titre}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 space-y-10">
          {guide.sections.map((section, i) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-titre`} className="scroll-mt-24">
              <h2 id={`${section.id}-titre`} className="text-xl font-bold text-text md:text-2xl">
                <span className="text-[color:var(--sector)]">{i + 1}. </span>
                {section.titre}
              </h2>
              <p className="mt-2 max-w-prose leading-relaxed text-text-muted">{section.intro}</p>
              <ol className="mt-5">
                {section.etapes.map((etape, n) => (
                  <Etape key={etape.titre} etape={etape} numero={n + 1} dansApp={dansApp} />
                ))}
              </ol>
            </section>
          ))}

          <section id="pages" aria-labelledby="pages-titre" className="scroll-mt-24">
            <h2 id="pages-titre" className="text-xl font-bold text-text md:text-2xl">
              <span className="text-[color:var(--sector)]">{guide.sections.length + 1}. </span>
              Les pages, une par une
            </h2>
            <p className="mt-2 max-w-prose text-text-muted">À quoi sert chaque page du menu, en une phrase.</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {guide.pages.map((p) => {
                const contenu = (
                  <>
                    <span className="flex items-center gap-2 font-semibold text-text">
                      {p.nom}
                      {p.admin && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-high px-2 py-0.5 text-[11px] font-medium text-text-muted">
                          <IconLock size={12} aria-hidden />
                          Admin
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-text-muted">{p.role}</span>
                  </>
                );
                return (
                  <li key={p.href + p.nom}>
                    {dansApp ? (
                      <Link
                        href={p.href}
                        className="block h-full rounded-xl border border-border bg-surface p-4 transition-colors duration-150 hover:border-border-active hover:bg-surface-high focus-visible:outline-accent"
                      >
                        {contenu}
                      </Link>
                    ) : (
                      <div className="h-full rounded-xl border border-border bg-surface p-4">{contenu}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <section id="lexique" aria-labelledby="lexique-titre" className="scroll-mt-24">
            <h2 id="lexique-titre" className="text-xl font-bold text-text md:text-2xl">
              <span className="text-[color:var(--sector)]">{guide.sections.length + 2}. </span>
              Les mots à connaître
            </h2>
            <dl className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
              {guide.lexique.map((l) => (
                <div key={l.mot} className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
                  <dt className="font-semibold text-text">{l.mot}</dt>
                  <dd className="text-text-muted">{l.sens}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="faq" aria-labelledby="faq-titre" className="scroll-mt-24">
            <h2 id="faq-titre" className="text-xl font-bold text-text md:text-2xl">
              <span className="text-[color:var(--sector)]">{guide.sections.length + 3}. </span>
              Questions fréquentes
            </h2>
            <div className="mt-4">
              <GuideFaq faq={guide.faq} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
