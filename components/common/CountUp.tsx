"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CountUpProps {
  value: number;
  className?: string;
  /** Formate la valeur affichée (par défaut séparateurs fr-FR). */
  format?: (n: number) => string;
}

const defaultFormat = (n: number) => Math.round(n).toLocaleString("fr-FR");

/** Compteur qui monte jusqu'à `value` à l'apparition. Valeur finale immédiate sous `prefers-reduced-motion`. */
export function CountUp({ value, className, format = defaultFormat }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const previous = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || !inView) {
      el.textContent = format(value);
      previous.current = value;
      return;
    }
    const controls = animate(previous.current, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => {
        el.textContent = format(n);
      },
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, inView, reduced, format]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
