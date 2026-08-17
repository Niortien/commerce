import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatCurrency";

type CurrencySize = "sm" | "md" | "lg" | "xl";
type CurrencyTone = "default" | "accent" | "in" | "out" | "cash" | "return";

interface CurrencyDisplayProps {
  montant: string;
  size?: CurrencySize;
  tone?: CurrencyTone;
  className?: string;
}

const SIZE_CLASS: Record<CurrencySize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
  xl: "text-6xl leading-none",
};

const TONE_CLASS: Record<CurrencyTone, string> = {
  default: "text-text",
  accent: "text-accent",
  in: "text-in",
  out: "text-out",
  cash: "text-cash",
  return: "text-return",
};

export function CurrencyDisplay({ montant, size = "md", tone = "default", className }: CurrencyDisplayProps) {
  return (
    <span className={cn("font-[var(--font-mono)] tracking-[0.02em]", SIZE_CLASS[size], TONE_CLASS[tone], className)}>
      {formatCurrency(montant)}
    </span>
  );
}
