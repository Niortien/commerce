"use client";

import { motion } from "framer-motion";
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
      className="rounded-lg border border-border/80 bg-[linear-gradient(145deg,rgba(143,126,245,0.16),rgba(34,54,81,0.72))] p-3"
    >
      <div className="flex items-center justify-between">
        <CurrencyDisplay montant={transaction.montant} size="lg" tone="cash" />
        <span className="text-xs text-text-muted">{transaction.modePaiement}</span>
      </div>
      <p className="mt-1 text-xs font-[var(--font-mono)] text-text-muted">{transaction.reference ?? "Sans reference"}</p>
    </motion.article>
  );
}
