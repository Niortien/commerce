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
      className="rounded-lg border border-[var(--color-cash)]/30 bg-[linear-gradient(145deg,var(--color-cash-dim),var(--color-accent-dim))] p-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <IconCircleCheck size={15} className="shrink-0 text-in" />
          <CurrencyDisplay montant={transaction.montant} size="lg" tone="cash" />
        </div>
        <span className="text-xs text-text-muted">{transaction.modePaiement}</span>
      </div>
      <p className="mt-1 text-xs font-[var(--font-mono)] text-text-muted">{transaction.reference ?? "Sans reference"}</p>
    </motion.article>
  );
}
