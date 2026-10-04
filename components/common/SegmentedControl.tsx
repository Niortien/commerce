"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TONE_CLASS, type Tone } from "@/components/common/tone";

export interface SegmentOption<K extends string> {
  key: K;
  label: string;
  /** Compteur optionnel affiché à droite du libellé. */
  count?: number;
}

interface SegmentedControlProps<K extends string> {
  options: SegmentOption<K>[];
  /** `null` = aucune option active (ex. plage de dates personnalisée). */
  value: K | null;
  onChange: (key: K) => void;
  ariaLabel: string;
  tone?: Tone;
  className?: string;
}

/** Filtre à choix unique : la pastille active glisse d'une option à l'autre (layout animation). */
export function SegmentedControl<K extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  tone = "accent",
  className,
}: SegmentedControlProps<K>) {
  const id = useId();
  const reduced = useReducedMotion();

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        TONE_CLASS[tone],
        "inline-flex max-w-full gap-0.5 overflow-x-auto rounded-lg border border-border bg-surface-high p-0.5",
        className
      )}
    >
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.key)}
            className={cn(
              "relative flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--tone)]",
              active ? "text-white" : "text-text-muted hover:text-text"
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                aria-hidden
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                className="absolute inset-0 rounded-md bg-[var(--tone)] shadow-sm"
              />
            )}
            <span className="relative">{o.label}</span>
            {o.count !== undefined && (
              <span
                className={cn(
                  "relative rounded-full px-1.5 font-mono text-[11px] tabular-nums",
                  active ? "bg-white/25 text-white" : "bg-border text-text-muted"
                )}
              >
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
