import { IconBellRinging, IconChevronRight } from "@tabler/icons-react";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

// Reflète l'enum StatutBoutique du backend : EN_ATTENTE → ESSAI → ACTIF → SUSPENDU → ARCHIVE.
const STATUTS = [
  { code: "EN_ATTENTE", label: "En attente", text: "La boutique est inscrite, en attendant son activation." },
  { code: "ESSAI", label: "Essai", text: "Accès à l'outil pendant une période d'essai dont la durée est fixée à l'inscription." },
  { code: "ACTIF", label: "Actif", text: "Abonnement en cours — mensuel, trimestriel ou annuel. Tout fonctionne.", current: true },
  { code: "SUSPENDU", label: "Suspendu", text: "Abonnement expiré ou compte désactivé : stock et caisse sont bloqués et une bannière explique pourquoi.", warn: true },
  { code: "ARCHIVE", label: "Archivé", text: "Boutique clôturée : l'accès métier reste bloqué." },
];

/** Cycle de vie d'une boutique selon son abonnement : bandeau d'alerte animé + statuts. */
export function MarketingLifecycle() {
  return (
    <section id="abonnements" className="scroll-mt-20 bg-base pt-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="flex flex-wrap items-center gap-10 rounded-[28px] border border-border bg-surface p-6 md:p-12">
            <div className="min-w-0 flex-[1_1_340px]">
              <SectionHeading
                eyebrow="Abonnement"
                title="Pas de mauvaise surprise sur l'abonnement."
                description="La plateforme Mon Djossi active, suspend ou renouvelle chaque boutique selon son abonnement. Les jours restants s'affichent dans votre menu et un bandeau vous prévient 7 jours avant l'échéance."
              />
            </div>
            <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
              <p className="mk-banner flex items-center gap-3 rounded-2xl bg-[#FFE9DB] px-4 py-3.5 text-[15px] font-semibold text-[#7A2E06]">
                <IconBellRinging size={20} aria-hidden className="shrink-0" />
                Votre abonnement se termine dans 7 jours.
                <a href="/login" className="ml-auto whitespace-nowrap font-extrabold text-[#7A2E06] underline-offset-2 hover:underline">
                  Renouveler
                </a>
              </p>
              <ol aria-label="Statuts d'une boutique" className="flex flex-wrap items-center gap-2 text-sm font-bold">
                {STATUTS.map(({ code, label, current, warn }, i) => (
                  <li key={code} className="flex items-center gap-2">
                    {i > 0 && <IconChevronRight size={16} aria-hidden className="text-text-dim" />}
                    <span
                      className={`rounded-full px-3.5 py-[7px] ${
                        current ? "mk-glow bg-accent text-white" : warn ? "bg-[#FFE9DB] text-[#7A2E06]" : "bg-surface-high text-text-muted"
                      }`}
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </ol>
              <dl className="grid gap-3 text-sm leading-relaxed text-text-muted sm:grid-cols-2">
                {STATUTS.filter((s) => s.code === "ESSAI" || s.code === "ACTIF" || s.code === "SUSPENDU").map(({ code, label, text }) => (
                  <div key={code}>
                    <dt className="font-bold text-text">{label}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
