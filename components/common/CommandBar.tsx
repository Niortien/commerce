"use client";

import { Input, Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { commandBar, getMotionVariant } from "@/lib/motionVariants";
import { useCommandBar } from "@/hooks/useCommandBar";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CommandBar() {
  const { input, parsed, isOpen, isLoading, lastError, setInput } = useCommandBar();
  const reduced = useReducedMotion();

  if (!isOpen) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={getMotionVariant(commandBar, reduced)}
      className="fixed bottom-6 left-1/2 z-[9000] w-[min(640px,calc(100vw-48px))] -translate-x-1/2 rounded-lg border border-border bg-surface px-4 py-3 shadow-md"
    >
      <Input
        aria-label="Command bar"
        value={input}
        onValueChange={setInput}
        placeholder="+5 jogging noir L @12000"
        variant="underlined"
        classNames={{ input: "font-[var(--font-mono)] text-text" }}
        endContent={isLoading ? <Spinner size="sm" color="warning" /> : null}
      />
      <div className="mt-2 min-h-5 text-xs text-text-muted">
        {lastError ? <span className="text-out">{lastError}</span> : parsed?.preview || "Commande en attente"}
      </div>
    </motion.div>
  );
}
