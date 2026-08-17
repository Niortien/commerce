"use client";

import { Children, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getMotionVariant, riverContainer, riverItem } from "@/lib/motionVariants";

interface TimelineProps {
  children: ReactNode;
  className?: string;
  density?: "compact" | "cozy";
}

export function Timeline({ children, className, density = "cozy" }: TimelineProps) {
  const reduced = useReducedMotion();
  const items = Children.toArray(children);

  const gapClass = density === "compact" ? "gap-2" : "gap-3";

  return (
    <motion.section
      role="feed"
      initial="hidden"
      animate="visible"
      variants={getMotionVariant(riverContainer, reduced)}
      className={`rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.22)] p-3 md:p-4 flex flex-col ${gapClass} ${className || ""}`}
    >
      {items.map((child, index) => (
        <motion.div key={index} variants={getMotionVariant(riverItem, reduced)}>
          {child}
        </motion.div>
      ))}
    </motion.section>
  );
}
