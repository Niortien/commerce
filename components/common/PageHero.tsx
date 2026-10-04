"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Icon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionDurations, motionEasing } from "@/lib/motionVariants";
import { TONE_CLASS, type Tone } from "@/components/common/tone";

interface PageHeroProps {
  tone?: Tone;
  eyebrow?: string;
  icon?: Icon;
  title: ReactNode;
  description?: ReactNode;
  /** Actions principales (une seule primaire par écran). */
  actions?: ReactNode;
  /** Rangée de `StatTile` ou contenu libre sous le titre. */
  children?: ReactNode;
  className?: string;
}

/**
 * En-tête de page : surface teintée par le rôle couleur de la page, halos qui dérivent lentement et grille de points.
 * Les halos sont décoratifs (`aria-hidden`) et figés sous `prefers-reduced-motion`.
 */
export function PageHero({ tone = "accent", eyebrow, icon: Icon, title, description, actions, children, className }: PageHeroProps) {
  const reduced = useReducedMotion();

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDurations.slow, ease: motionEasing.outExpo }}
      className={cn(
        TONE_CLASS[tone],
        "relative isolate overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--tone)_28%,var(--color-border))] bg-surface p-5 md:p-7",
        className
      )}
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--tone)_7%,transparent)]" />
        <div className="dot-grid absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom_left,black,transparent_70%)]" />
        <span className="aurora-blob aurora-a -right-10 -top-16 h-56 w-56 bg-[color-mix(in_srgb,var(--tone)_30%,transparent)]" />
        <span className="aurora-blob aurora-b -bottom-24 left-1/3 h-52 w-52 bg-[color-mix(in_srgb,var(--color-cash)_16%,transparent)]" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {(eyebrow || Icon) && (
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--tone-text)]">
              {Icon && (
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--tone)_16%,transparent)]">
                  <Icon size={16} aria-hidden />
                </span>
              )}
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-text md:text-4xl">{title}</h1>
          {description && <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-text-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>

      {children && <div className="mt-5">{children}</div>}
    </motion.header>
  );
}
