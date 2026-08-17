"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { getMotionVariant, pageEnter } from "@/lib/motionVariants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const reduced = useReducedMotion();
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={getMotionVariant(pageEnter, reduced)}
      className="mx-auto flex w-full max-w-6xl flex-col gap-5"
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  );
}
