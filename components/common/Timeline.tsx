"use client";

import { Children, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getMotionVariant, riverContainer, riverItem } from "@/lib/motionVariants";

interface TimelineProps {
  children: ReactNode;
  className?: string;
  density?: "compact" | "cozy";
  /** Lecteurs d'écran : annonce les nouveaux éléments d'un flux en direct. */
  live?: boolean;
}

/** Flux vertical animé (apparition en cascade) : `role="feed"` pour les listes qui s'allongent. */
export function Timeline({ children, className, density = "cozy", live = false }: TimelineProps) {
  const reduced = useReducedMotion();
  const items = Children.toArray(children);

  return (
    <motion.section
      role="feed"
      aria-live={live ? "polite" : undefined}
      initial="hidden"
      animate="visible"
      variants={getMotionVariant(riverContainer, reduced)}
      className={cn("flex flex-col", density === "compact" ? "gap-1.5" : "gap-3", className)}
    >
      {items.map((child, index) => (
        <motion.div key={index} variants={getMotionVariant(riverItem, reduced)}>
          {child}
        </motion.div>
      ))}
    </motion.section>
  );
}
