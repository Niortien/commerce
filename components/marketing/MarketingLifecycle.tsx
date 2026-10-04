import {
  IconAlertTriangle,
  IconArchive,
  IconBellRinging,
  IconCircleCheck,
  IconClockHour4,
  IconHourglassHigh,
} from "@tabler/icons-react";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

// Reflète l'enum StatutBoutique du backend : EN_ATTENTE → ESSAI → ACTIF → SUSPENDU → ARCHIVE.
const STEPS = [
  {
    icon: IconHourglassHigh,
    code: "EN_ATTENTE",
    title: "Inscription",
    text: "La boutique est inscrite, par elle-même ou par le Super Admin, en attendant son activation.",
    tone: "bg-white/10 text-slate-200",
  },
  {
    icon: IconClockHour4,
    code: "ESSAI",
    title: "Essai",
    text: "Accès à l'outil pendant une période d'essai dont la durée est fixée à l'inscription.",
    tone: "bg-amber-400/15 text-amber-300",
  },
  {
    icon: IconCircleCheck,
    code: "ACTIF",
    title: "Abonné",
    text: "Abonnement en cours — mensuel, trimestriel ou annuel. Tout fonctionne.",
    tone: "bg-emerald-400/15 text-emerald-300",
  },
  {
    icon: IconAlertTriangle,
    code: "SUSPENDU",
    title: "Suspendu",
    text: "Abonnement expiré ou compte désactivé : stock et caisse sont bloqués et une bannière explique pourquoi.",
    tone: "bg-rose-400/15 text-rose-300",
  },
  {
    icon: IconArchive,
    code: "ARCHIVE",
    title: "Archivé",
    text: "Boutique clôturée : l'accès métier reste bloqué.",
    tone: "bg-white/10 text-slate-200",
  },
];

export function MarketingLifecycle() {
  return (
    <section id="abonnements" className="scroll-mt-20 bg-sidebar py-16 text-sidebar-text md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            onDark
            eyebrow="Le cœur de Mon Djossi"
            title="L'abonnement pilote ce que chaque boutique peut faire"
            description="Le statut d'une boutique décide de l'accès à l'outil. Le Super Admin le change en un clic, et la boutique voit toujours où elle en est."
          />
        </Reveal>

        <ol className="mt-10 grid gap-3 md:grid-cols-5">
          {STEPS.map(({ icon: Icon, code, title, text, tone }, i) => (
            <li key={code}>
              <Reveal delay={i * 0.05} className="h-full">
                <div className="flex h-full flex-col rounded-lg border border-sidebar-border bg-sidebar-hover p-4">
                  <div className="flex items-center justify-between">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-md ${tone}`}>
                      <Icon size={18} aria-hidden />
                    </span>
                    <span className="font-mono text-xs text-sidebar-muted">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-display text-md font-bold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-sidebar-muted">{text}</p>
                  <p className="mt-auto pt-4 font-mono text-[11px] tracking-wide text-sidebar-muted">{code}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-sidebar-border bg-sidebar-hover p-4">
            <IconBellRinging size={20} className="mt-0.5 shrink-0 text-sidebar-accent" aria-hidden />
            <p className="text-sm leading-relaxed text-sidebar-muted">
              <strong className="font-semibold text-sidebar-text">Aucune mauvaise surprise.</strong> L&apos;admin voit son
              plan et le nombre de jours restants dans la navigation, et une bannière le prévient 7 jours avant l&apos;échéance.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
