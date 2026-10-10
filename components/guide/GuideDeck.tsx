"use client";

import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Button } from "@heroui/react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type PanInfo, type Variants } from "framer-motion";
import { IconArrowLeft, IconArrowRight, IconCircleCheckFilled } from "@tabler/icons-react";
import { COMMERCE_PROFILES } from "@/lib/commerce";
import type { Guide } from "@/lib/guides";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGuideProgression } from "@/hooks/useGuideProgression";
import { GuideCarte, type CarteGuide } from "./GuideCarte";

interface GuideDeckProps {
  guide: Guide;
  dansApp: boolean;
}

/** Au-delà de cette distance (ou d'un geste vif), la carte part. */
const SEUIL_PX = 90;
const SEUIL_VITESSE = 450;
const DOUX = [0.16, 1, 0.3, 1] as const;

const mouvement: Variants = {
  entree: (dir: number) => (dir >= 0 ? { opacity: 0, scale: 0.93, y: 22, x: 0 } : { opacity: 0, scale: 1, y: 0, x: -280 }),
  centre: { opacity: 1, scale: 1, y: 0, x: 0, transition: { duration: 0.45, ease: DOUX } },
  sortie: (dir: number) =>
    dir >= 0
      ? { opacity: 0, x: -480, transition: { duration: 0.32, ease: [0.4, 0, 1, 1] } }
      : { opacity: 0, scale: 0.93, y: 22, transition: { duration: 0.24 } },
};
const fondu: Variants = {
  entree: { opacity: 0 },
  centre: { opacity: 1, transition: { duration: 0.2 } },
  sortie: { opacity: 0, transition: { duration: 0.15 } },
};

function chapitres(guide: Guide): CarteGuide[][] {
  return guide.sections.map((section, i) => {
    const suivante = guide.sections[i + 1] ?? null;
    return [
      { genre: "couverture", id: `${section.id}:couverture`, section, nbEtapes: section.etapes.length },
      ...section.etapes.map((etape, n): CarteGuide => ({ genre: "etape", id: `${section.id}:${n}`, etape })),
      { genre: "fin", id: `${section.id}:fin`, section, suivante },
    ];
  });
}

interface CarteGlissanteProps {
  dir: number;
  reduit: boolean;
  indice: boolean;
  onAvant: () => void;
  onArriere: () => void;
  children: React.ReactNode;
}

/** La carte du dessus : elle suit le doigt, penche dans le sens du geste et part si on la lâche assez loin. */
function CarteGlissante({ dir, reduit, indice, onAvant, onArriere, children }: CarteGlissanteProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 0, 260], [-11, 0, 11]);

  // Première visite : la carte se pousse elle-même un peu vers la gauche pour montrer le geste.
  useEffect(() => {
    if (!indice || reduit) return;
    let actif = true;
    const id = window.setTimeout(async () => {
      for (let i = 0; i < 2 && actif; i++) {
        await animate(x, [0, -46, 0], { duration: 0.9, ease: "easeInOut" });
        await new Promise((r) => window.setTimeout(r, 500));
      }
    }, 1100);
    return () => {
      actif = false;
      window.clearTimeout(id);
    };
  }, [indice, reduit, x]);

  const lacher = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SEUIL_PX || info.velocity.x < -SEUIL_VITESSE) onAvant();
    else if (info.offset.x > SEUIL_PX || info.velocity.x > SEUIL_VITESSE) onArriere();
  };

  return (
    <motion.article
      custom={dir}
      variants={reduit ? fondu : mouvement}
      initial="entree"
      animate="centre"
      exit="sortie"
      drag="x"
      dragSnapToOrigin
      dragElastic={0.85}
      onDragEnd={lacher}
      style={reduit ? { x } : { x, rotate }}
      whileDrag={{ cursor: "grabbing" }}
      className="relative z-10 flex min-h-[25rem] cursor-grab touch-pan-y select-none flex-col rounded-2xl bg-surface p-6 shadow-[0_30px_60px_-28px_rgb(8_15_35/0.75)] [grid-area:1/1] md:p-8"
    >
      {children}
    </motion.article>
  );
}

/**
 * Le guide en cartes à faire glisser : un chapitre = une couverture, une carte par étape, une carte de fin.
 * Glisser à gauche (ou flèche droite) avance, glisser à droite recule. La progression reste sur l'appareil.
 */
export function GuideDeck({ guide, dansApp }: GuideDeckProps) {
  const reduit = useReducedMotion();
  const profile = COMMERCE_PROFILES[guide.type];
  const Icon = profile.icon;
  const paquets = useMemo(() => chapitres(guide), [guide]);
  const prog = useGuideProgression(guide.slug);
  const [dir, setDir] = useState(1);

  const chapitre = Math.min(Math.max(prog.chapitre, 0), paquets.length - 1);
  const paquet = paquets[chapitre];
  const index = Math.min(Math.max(prog.carte, 0), paquet.length - 1);
  const carte = paquet[index];
  const totalEtapes = guide.sections.reduce((n, s) => n + s.etapes.length, 0);
  const minutes = Math.max(1, Math.round((totalEtapes * 20) / 60));
  const premiereFois = prog.pret && !prog.aGlisse && chapitre === 0 && index === 0;

  // Téléphone : le chapitre en cours reste visible dans la bande des chapitres.
  useEffect(() => {
    document.getElementById(`chapitre-${guide.sections[chapitre].id}`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduit ? "auto" : "smooth" });
  }, [chapitre, guide.sections, reduit]);

  const { marquerVue } = prog;
  useEffect(() => {
    if (prog.pret && carte.genre === "etape") marquerVue(carte.id);
  }, [carte, marquerVue, prog.pret]);

  const avancer = () => {
    setDir(1);
    prog.noterGlisse();
    if (index < paquet.length - 1) prog.aller(chapitre, index + 1);
    else if (chapitre < paquets.length - 1) prog.aller(chapitre + 1, 0);
  };
  const reculer = () => {
    setDir(-1);
    prog.noterGlisse();
    if (index > 0) prog.aller(chapitre, index - 1);
    else if (chapitre > 0) prog.aller(chapitre - 1, paquets[chapitre - 1].length - 1);
  };
  const ouvrirChapitre = (i: number) => {
    setDir(i >= chapitre ? 1 : -1);
    prog.aller(i, 0);
  };
  const auBout = chapitre === paquets.length - 1 && index === paquet.length - 1;
  const auDebut = chapitre === 0 && index === 0;

  const clavier = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" && !auBout) {
      e.preventDefault();
      avancer();
    } else if (e.key === "ArrowLeft" && !auDebut) {
      e.preventDefault();
      reculer();
    }
  };

  const vuesDans = (i: number) => guide.sections[i].etapes.filter((_, n) => prog.vues.includes(`${guide.sections[i].id}:${n}`)).length;
  const libelleCarte =
    carte.genre === "couverture" ? carte.section.titre : carte.genre === "fin" ? "Fin du chapitre" : carte.etape.titre;

  const scene: CSSProperties = {
    backgroundColor: "#0F1B33",
    backgroundImage: [
      "radial-gradient(110% 70% at 88% 0%, color-mix(in srgb, var(--sector) 62%, transparent), transparent 62%)",
      "radial-gradient(80% 60% at 0% 100%, color-mix(in srgb, var(--sector) 30%, transparent), transparent 70%)",
    ].join(", "),
  };

  return (
    <section aria-labelledby="guide-titre" style={scene} className="overflow-hidden rounded-[20px] px-4 py-7 text-white md:px-10 md:py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-12">
        <div className="flex min-w-0 flex-col">
          <p className="flex items-center gap-2 font-semibold text-[color:var(--sector-soft)]">
            <Icon size={20} aria-hidden />
            {profile.label}
          </p>
          <h1 id="guide-titre" className="mt-3 text-balance font-display text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[3rem]">
            Apprends Mon Djossi en {totalEtapes} cartes
          </h1>
          <p className="mt-3 max-w-md text-[1.05rem] leading-relaxed text-[#C9D5E8]">
            Pas de long texte : fais glisser, regarde les gestes, essaie dans l&apos;appli. Environ {minutes} minutes en tout.
          </p>

          <nav aria-label="Chapitres du guide" className="-mx-4 mt-7 overflow-x-auto px-4 pb-1 lg:mx-0 lg:mt-9 lg:overflow-visible lg:px-0">
            <ol className="flex gap-2 lg:flex-col lg:gap-1.5">
              {guide.sections.map((s, i) => {
                const vues = vuesDans(i);
                const fini = vues === s.etapes.length;
                const actif = i === chapitre;
                return (
                  <li key={s.id} id={`chapitre-${s.id}`} className="shrink-0">
                    <Button
                      variant="light"
                      onPress={() => ouvrirChapitre(i)}
                      aria-current={actif ? "step" : undefined}
                      className={[
                        "relative h-auto min-h-12 w-56 justify-start overflow-hidden rounded-xl px-3.5 py-2.5 text-left text-white lg:w-full",
                        actif ? "bg-white/[0.14]" : "bg-white/[0.05] data-[hover=true]:bg-white/10",
                      ].join(" ")}
                    >
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold">{s.titre}</span>
                          {fini && <IconCircleCheckFilled size={16} aria-label="terminé" className="shrink-0 text-[color:var(--sector-soft)]" />}
                        </span>
                        <span className="tabular text-xs text-[#9FB0C8]">
                          {vues}/{s.etapes.length} vues
                        </span>
                      </span>
                      <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
                        <motion.span
                          className="block h-full origin-left bg-[color:var(--sector-soft)]"
                          initial={false}
                          animate={{ scaleX: s.etapes.length ? vues / s.etapes.length : 0 }}
                          transition={{ duration: reduit ? 0 : 0.5, ease: DOUX }}
                        />
                      </span>
                    </Button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        <div className="min-w-0">
          <div
            role="group"
            aria-roledescription="paquet de cartes"
            aria-label={`Chapitre ${chapitre + 1} : ${guide.sections[chapitre].titre}`}
            tabIndex={0}
            onKeyDown={clavier}
            className="relative grid rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--sector-soft)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F1B33]"
          >
            {/* Les cartes suivantes, en dessous : on voit qu'il en reste. */}
            {index < paquet.length - 1 && (
              <span aria-hidden className="pointer-events-none origin-bottom rounded-2xl bg-surface/40 [grid-area:1/1] [transform:translateY(24px)_scale(0.9)]" />
            )}
            {index < paquet.length - 2 && (
              <span aria-hidden className="pointer-events-none origin-bottom rounded-2xl bg-surface/70 [grid-area:1/1] [transform:translateY(12px)_scale(0.95)]" />
            )}
            <AnimatePresence initial={false} custom={dir}>
              <CarteGlissante key={carte.id} dir={dir} reduit={reduit} indice={premiereFois} onAvant={auBout ? () => undefined : avancer} onArriere={auDebut ? () => undefined : reculer}>
                <GuideCarte
                  carte={carte}
                  dansApp={dansApp}
                  reduit={reduit}
                  montrerIndice={premiereFois}
                  onSuivant={avancer}
                />
              </CarteGlissante>
            </AnimatePresence>
          </div>

          <div className="mt-9 flex items-center gap-3">
            <Button isIconOnly aria-label="Carte précédente" isDisabled={auDebut} onPress={reculer} className="h-12 w-12 min-w-12 rounded-full bg-white/10 text-white">
              <IconArrowLeft size={22} aria-hidden />
            </Button>
            <div className="flex flex-1 flex-col gap-2">
              <div aria-hidden className="flex gap-1">
                {paquet.map((c, i) => (
                  <span key={c.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                    <motion.span
                      className="block h-full origin-left rounded-full bg-[color:var(--sector-soft)]"
                      initial={false}
                      animate={{ scaleX: i <= index ? 1 : 0 }}
                      transition={{ duration: reduit ? 0 : 0.35, ease: DOUX }}
                    />
                  </span>
                ))}
              </div>
              <p className="tabular text-center text-xs text-[#9FB0C8]">
                Carte {index + 1} sur {paquet.length}
              </p>
            </div>
            <Button
              isIconOnly
              aria-label="Carte suivante"
              isDisabled={auBout}
              onPress={avancer}
              className="h-12 w-12 min-w-12 rounded-full bg-[color:var(--sector-soft)] text-[#0F1B33]"
            >
              <IconArrowRight size={22} aria-hidden />
            </Button>
          </div>
          <p className="sr-only" aria-live="polite">
            {libelleCarte}, carte {index + 1} sur {paquet.length}
          </p>
        </div>
      </div>
    </section>
  );
}
