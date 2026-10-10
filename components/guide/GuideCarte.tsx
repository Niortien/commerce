"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { motion, type Variants } from "framer-motion";
import { IconAlertTriangle, IconArrowRight, IconBulb, IconHandFinger, IconRosette } from "@tabler/icons-react";
import type { EtapeGuide, SectionGuide } from "@/lib/guides";

export type CarteGuide =
  | { genre: "couverture"; id: string; section: SectionGuide; nbEtapes: number }
  | { genre: "etape"; id: string; etape: EtapeGuide }
  | { genre: "fin"; id: string; section: SectionGuide; suivante: SectionGuide | null };

interface GuideCarteProps {
  carte: CarteGuide;
  dansApp: boolean;
  reduit: boolean;
  /** Indication « glisse » sur la toute première carte, tant qu'on n'a jamais glissé. */
  montrerIndice: boolean;
  onSuivant: () => void;
}

const DOUX = [0.16, 1, 0.3, 1] as const;

/** Typographie française : « : ; ! ? » et les guillemets ne partent jamais seuls à la ligne. */
function typo(texte: string): string {
  return texte.replace(/ ([:;!?»])/g, "\u00a0$1").replace(/« /g, "«\u00a0");
}

const liste: Variants = {
  cache: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.18 } },
};
const geste: Variants = {
  cache: { opacity: 0, x: 18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.42, ease: DOUX } },
};
const gesteReduit: Variants = {
  cache: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

/** Astuce ou attention, collée sur la carte comme un autocollant, qui arrive après les gestes. */
function Autocollant({ ton, children, delai, reduit }: { ton: "astuce" | "attention"; children: string; delai: number; reduit: boolean }) {
  const astuce = ton === "astuce";
  return (
    <motion.p
      initial={reduit ? { opacity: 0 } : { opacity: 0, scale: 0.7, rotate: astuce ? -6 : 5 }}
      animate={reduit ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: astuce ? -1.2 : 1 }}
      transition={reduit ? { duration: 0.2, delay: delai } : { type: "spring", stiffness: 380, damping: 18, delay: delai }}
      className={[
        "flex gap-2 rounded-xl px-3.5 py-2.5 text-sm leading-relaxed shadow-[0_10px_22px_-14px_rgb(15_23_42/0.55)]",
        astuce ? "bg-in-dim text-in-text" : "bg-return-dim text-return-text",
      ].join(" ")}
    >
      {astuce ? <IconBulb size={18} aria-hidden className="mt-0.5 shrink-0" /> : <IconAlertTriangle size={18} aria-hidden className="mt-0.5 shrink-0" />}
      <span>
        <span className="font-semibold">{astuce ? "Astuce : " : "Attention : "}</span>
        {typo(children)}
      </span>
    </motion.p>
  );
}

function Couverture({ section, nbEtapes, montrerIndice, reduit }: { section: SectionGuide; nbEtapes: number; montrerIndice: boolean; reduit: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <h3 className="text-balance font-display text-[1.7rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-text md:text-[2rem]">
        {typo(section.titre)}
      </h3>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-text-muted">{typo(section.intro)}</p>
      <p className="mt-auto pt-6 text-sm font-semibold text-[color:var(--sector)]">
        {nbEtapes} carte{nbEtapes > 1 ? "s" : ""} dans ce chapitre
      </p>
      {montrerIndice && (
        <p className="mt-2 flex items-center gap-2 text-sm text-text-muted">
          <motion.span
            aria-hidden
            className="inline-flex text-[color:var(--sector)]"
            animate={reduit ? undefined : { x: [0, -14, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
          >
            <IconHandFinger size={20} />
          </motion.span>
          Fais glisser la carte vers la gauche
        </p>
      )}
    </div>
  );
}

function Fin({ section, suivante, reduit, onSuivant }: { section: SectionGuide; suivante: SectionGuide | null; reduit: boolean; onSuivant: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <svg viewBox="0 0 64 64" className="h-20 w-20 text-[color:var(--sector)]" aria-hidden>
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          initial={reduit ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: DOUX }}
        />
        <motion.path
          d="M20 33 l8 8 l16 -18"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduit ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: reduit ? 0 : 0.5, ease: DOUX }}
        />
      </svg>
      <h3 className="mt-5 text-balance font-display text-2xl font-extrabold tracking-[-0.02em] text-text">
        {suivante ? "Chapitre bouclé" : "Tu as tout vu"}
      </h3>
      <p className="mt-2 max-w-xs text-text-muted">
        {suivante
          ? `« ${section.titre} », c'est fait. On continue ?`
          : "Bravo ! Les pages du menu, les mots à connaître et les questions fréquentes sont juste en dessous."}
      </p>
      {suivante ? (
        <Button
          onPress={onSuivant}
          endContent={<IconArrowRight size={18} aria-hidden />}
          className="mt-6 min-h-11 rounded-xl bg-[color:var(--sector)] px-5 font-semibold text-white"
        >
          {suivante.titre}
        </Button>
      ) : (
        <a
          href="#pages"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[color:var(--sector)] px-5 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--sector)]"
        >
          <IconRosette size={18} aria-hidden />
          Voir les pages du menu
        </a>
      )}
    </div>
  );
}

function Etape({ etape, dansApp, reduit }: { etape: EtapeGuide; dansApp: boolean; reduit: boolean }) {
  const nbGestes = etape.gestes?.length ?? 0;
  const apresGestes = 0.3 + nbGestes * 0.14;
  return (
    <div className="flex h-full flex-col">
      <h3 className="text-balance font-display text-[1.45rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-text md:text-[1.6rem]">
        {typo(etape.titre)}
      </h3>
      {etape.texte && (
        <p className={nbGestes > 0 ? "mt-3 leading-relaxed text-text-muted" : "mt-4 text-[1.12rem] leading-relaxed text-text"}>{typo(etape.texte)}</p>
      )}
      {etape.gestes && (
        <motion.ol variants={liste} initial="cache" animate="visible" className="mt-4 space-y-2">
          {etape.gestes.map((g, i) => (
            <motion.li key={g} variants={reduit ? gesteReduit : geste} className="flex gap-3 rounded-xl bg-surface-high px-3 py-2.5">
              <span
                aria-hidden
                className="tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--sector)] text-[13px] font-bold text-white"
              >
                {i + 1}
              </span>
              <span className="pt-0.5 leading-snug text-text">{typo(g)}</span>
            </motion.li>
          ))}
        </motion.ol>
      )}
      {(etape.astuce || etape.attention) && (
        <div className="mt-4 space-y-2.5">
          {etape.astuce && (
            <Autocollant ton="astuce" delai={apresGestes} reduit={reduit}>
              {etape.astuce}
            </Autocollant>
          )}
          {etape.attention && (
            <Autocollant ton="attention" delai={apresGestes + 0.12} reduit={reduit}>
              {etape.attention}
            </Autocollant>
          )}
        </div>
      )}
      {etape.page &&
        (dansApp ? (
          <Link
            href={etape.page.href}
            className="mt-5 inline-flex min-h-11 items-center gap-1.5 self-start font-semibold text-[color:var(--sector)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--sector)]"
          >
            Ouvrir « {etape.page.libelle} »
            <IconArrowRight size={18} aria-hidden />
          </Link>
        ) : (
          <p className="mt-5 text-sm text-text-muted">
            Dans l&apos;application : <span className="font-semibold text-text">{etape.page.libelle}</span>
          </p>
        ))}
    </div>
  );
}

/** Contenu d'une carte du guide (la mise en mouvement est gérée par le paquet de cartes). */
export function GuideCarte({ carte, dansApp, reduit, montrerIndice, onSuivant }: GuideCarteProps) {
  if (carte.genre === "couverture") {
    return <Couverture section={carte.section} nbEtapes={carte.nbEtapes} montrerIndice={montrerIndice} reduit={reduit} />;
  }
  if (carte.genre === "fin") {
    return <Fin section={carte.section} suivante={carte.suivante} reduit={reduit} onSuivant={onSuivant} />;
  }
  return <Etape etape={carte.etape} dansApp={dansApp} reduit={reduit} />;
}
