"use client";

import type { ReactNode } from "react";
import { Button, Tooltip } from "@heroui/react";
import { cn } from "@/lib/utils";

type RowActionTone = "neutral" | "accent" | "cash" | "out";

interface RowActionButtonProps {
  label: string;
  onPress: () => void;
  children: ReactNode;
  tone?: RowActionTone;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const TONE_CLASS: Record<RowActionTone, string> = {
  neutral: "bg-surface-high text-text-muted hover:text-text",
  accent: "bg-accent-dim text-accent-text",
  cash: "bg-cash-dim text-cash-text",
  out: "bg-out-dim text-out-text",
};

/** Bouton d'action de ligne : icône seule, libellé accessible + infobulle. */
export function RowActionButton({ label, onPress, children, tone = "neutral", isLoading, isDisabled }: RowActionButtonProps) {
  return (
    <Tooltip content={label} delay={300} closeDelay={0}>
      <Button
        isIconOnly
        size="sm"
        variant="flat"
        aria-label={label}
        isLoading={isLoading}
        isDisabled={isDisabled}
        onPress={onPress}
        className={cn("h-9 w-9 min-w-9 cursor-pointer", TONE_CLASS[tone])}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
