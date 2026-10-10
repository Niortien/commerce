import Link from "next/link";
import { COMMERCE_PROFILES, TYPES_COMMERCE, sectorStyle } from "@/lib/commerce";
import { slugGuide } from "@/lib/guides";

/** Le choix du guide sur le site public : un par type de commerce, les métiers à modules en premier. */
export function GuidesIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="mk-eyebrow">Guides d&apos;utilisation</p>
      <h1 className="mt-3 font-brand text-[1.8rem] font-semibold leading-tight tracking-[-0.03em] text-text md:text-[2.4rem]">
        Apprendre Mon Djossi, pas à pas.
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-text-muted">
        Choisis ton type de commerce : le guide t&apos;explique chaque page, dans l&apos;ordre où tu vas t&apos;en servir, avec des mots simples.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TYPES_COMMERCE.map((t) => {
          const p = COMMERCE_PROFILES[t];
          const Icon = p.icon;
          return (
            <li key={t} style={sectorStyle(t)}>
              <Link
                href={`/guides/${slugGuide(t)}`}
                className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-surface p-5 transition-colors duration-150 hover:border-[color:var(--sector)] focus-visible:outline-accent"
              >
                <span className="flex items-center gap-2 font-semibold text-text">
                  <Icon size={20} aria-hidden className="text-[color:var(--sector)]" />
                  {p.label}
                </span>
                <span className="text-sm text-text-muted">{p.description}</span>
                {p.moduleMetier && <span className="text-xs font-semibold text-[color:var(--sector)]">Avec ses fonctions métier</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
