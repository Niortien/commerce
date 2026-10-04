"use client";

import { useRef, type ElementType, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TONE_CLASS, type Tone } from "@/components/common/tone";

interface SpotlightCardProps {
  children: ReactNode;
  tone?: Tone;
  as?: "div" | "article" | "li" | "section";
  className?: string;
}

/**
 * Carte dont un halo suit le curseur (motif « spotlight »). Les coordonnées passent par des variables CSS posées
 * directement sur le nœud : aucun rendu React pendant le déplacement. Sans survol (tactile) la carte reste plate.
 */
export function SpotlightCard({ children, tone = "accent", as = "div", className }: SpotlightCardProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        TONE_CLASS[tone],
        "spotlight relative overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-[border-color,transform] duration-200 hover:border-[color-mix(in_srgb,var(--tone)_45%,var(--color-border))]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
