"use client";

import { motion } from "framer-motion";
import { IconCircleCheck } from "@tabler/icons-react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { getMotionVariant, newTransaction } from "@/lib/motionVariants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Transaction } from "@/types";

interface TransactionPulseProps {
  transaction: Transaction;
}

export function TransactionPulse({ transaction }: TransactionPulseProps) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      initial="hidden"
      animate="visible"
      variants={getMotionVariant(newTransaction, reduced)}
      className="tone-cash flex items-center gap-3 rounded-lg border border-border border-l-[3px] border-l-cash bg-surface p-3"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-in-dim text-in-text">
        <IconCircleCheck size={18} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <CurrencyDisplay montant={transaction.montant} size="lg" tone="cash" className="font-display font-extrabold leading-tight" />
        <p className="truncate font-mono text-xs text-text-muted">{transaction.reference ?? "Sans référence"}</p>
      </div>
      <span className="shrink-0 rounded-full bg-surface-high px-2.5 py-1 text-xs font-medium text-text-muted">
        {transaction.modePaiement}
      </span>
    </motion.article>
  );
}
