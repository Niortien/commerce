import type { ComponentType } from "react";
import type { IconProps } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { TONE_CLASSES, type StatusTone } from "@/lib/subscription";

interface StatusChipProps {
  label: string;
  tone: StatusTone;
  icon?: ComponentType<IconProps>;
  /** Variante pour la barre latérale bleu nuit (fond sombre dans les deux thèmes). */
  onDark?: boolean;
  className?: string;
}

const ON_DARK: Record<StatusTone, string> = {
  in: "bg-emerald-400/15 text-emerald-300",
  return: "bg-amber-400/15 text-amber-300",
  out: "bg-rose-400/15 text-rose-300",
  neutral: "bg-white/10 text-slate-300",
};

/** Pastille de statut : teinte + icône + texte (jamais la couleur seule). */
export function StatusChip({ label, tone, icon: Icon, onDark = false, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        onDark ? ON_DARK[tone] : TONE_CLASSES[tone].chip,
        className
      )}
    >
      {Icon && <Icon size={12} aria-hidden />}
      {label}
    </span>
  );
}
