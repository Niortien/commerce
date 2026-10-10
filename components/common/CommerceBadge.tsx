import { COMMERCE_PROFILES, sectorStyle } from "@/lib/commerce";
import { cn } from "@/lib/utils";
import type { TypeCommerce } from "@/types";

interface CommerceBadgeProps {
  type: TypeCommerce;
  /** Sur la barre latérale bleu nuit. */
  onDark?: boolean;
  className?: string;
}

/** Type de commerce d'une boutique : icône et nom dans la teinte du secteur. */
export function CommerceBadge({ type, onDark = false, className }: CommerceBadgeProps) {
  const { label, icon: Icon } = COMMERCE_PROFILES[type];
  return (
    <span
      style={sectorStyle(type, onDark)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        "bg-[color:color-mix(in_srgb,var(--sector)_12%,transparent)] text-[color:var(--sector)]",
        className
      )}
    >
      <Icon size={14} aria-hidden className="shrink-0" />
      {label}
    </span>
  );
}
