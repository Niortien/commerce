"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface RevealProps {
  children: ReactNode;
  /** Décalage en secondes (cascade de 40–80 ms entre éléments frères). */
  delay?: number;
  className?: string;
}

/**
 * Apparition au scroll (opacity + translateY, une seule fois) pour les blocs situés sous la ligne de flottaison.
 *
 * Le contenu est visible par défaut (rendu serveur, JS désactivé, `prefers-reduced-motion`) ; il n'est masqué qu'après
 * hydratation, et seulement s'il est hors écran — donc aucun flash sur le hero et aucun écart d'hydratation.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setHidden(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHidden(false);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={cn("transition-[opacity,transform] duration-[380ms] ease-out", hidden && "translate-y-3 opacity-0", className)}
      style={hidden ? undefined : { transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
