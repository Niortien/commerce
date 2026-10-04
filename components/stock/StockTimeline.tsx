"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { EmptyRiver } from "@/components/common/EmptyRiver";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getMotionVariant, riverContainer, riverItem } from "@/lib/motionVariants";
import { cn } from "@/lib/utils";
import type { StockItem } from "@/types";
import { StockFlowRow } from "./StockFlowRow";

interface StockTimelineProps {
  items: StockItem[];
  density?: "compact" | "cozy";
}

export function StockTimeline({ items, density = "cozy" }: StockTimelineProps) {
  const reduced = useReducedMotion();

  if (!items.length) {
    return (
      <EmptyRiver
        message="Aucun article en stock"
        hint="Le stock se remplit avec vos entrées."
        action={
          <Button as={Link} href="/entrees" size="sm" className="bg-accent font-semibold text-white">
            Enregistrer une entrée
          </Button>
        }
      />
    );
  }

  return (
    <motion.ul
      role="feed"
      aria-label="Variantes en stock"
      initial="hidden"
      animate="visible"
      variants={getMotionVariant(riverContainer, reduced)}
      className={cn("grid sm:grid-cols-2 xl:grid-cols-3", density === "compact" ? "gap-2" : "gap-3.5")}
    >
      {items.map((item) => (
        <motion.li key={item.id} variants={getMotionVariant(riverItem, reduced)}>
          <StockFlowRow item={item} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
