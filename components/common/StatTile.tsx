"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Icon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionDurations, motionEasing } from "@/lib/motionVariants";
import { TONE_CLASS, type Tone } from "@/components/common/tone";

interface StatTileProps {
  tone?: Tone;
  icon?: Icon;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  /** Décalage d'apparition (s) pour une cascade courte entre tuiles. */
  delay?: number;
  className?: string;
}

/** Indicateur : pastille icône teintée, libellé, valeur en `font-display`, sous-texte. */
export function StatTile({ tone = "accent", icon: Icon, label, value, hint, delay = 0, className }: StatTileProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDurations.slow, ease: motionEasing.outExpo, delay }}
      className={cn(
        TONE_CLASS[tone],
        "flex min-w-0 items-center gap-3 rounded-lg border border-border bg-surface/80 p-3.5 backdrop-blur-sm",
        className
      )}
    >
      {Icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--tone)_14%,transparent)] text-[var(--tone-text)]">
          <Icon size={20} aria-hidden />
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-text-muted">{label}</p>
        <p className="truncate font-display text-xl font-extrabold leading-tight tabular-nums text-text">{value}</p>
        {hint && <p className="truncate text-xs text-text-muted">{hint}</p>}
      </div>
    </motion.div>
  );
}
