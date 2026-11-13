"use client";

import { DateRangePicker } from "@heroui/react";
import type { CalendarDate } from "@internationalized/date";
import type { DateRange } from "@/lib/dateRange";

type Ton = "accent" | "cash";

export interface PlageDatesPickerProps {
  value: DateRange | null;
  onChange: (range: DateRange | null) => void;
  maxValue: CalendarDate;
  ariaLabel: string;
  ton?: Ton;
  visibleMonths?: 1 | 2;
  /** Classes de largeur du champ (reprises par la place réservée pendant le chargement). */
  largeur?: string;
}

const TONS: Record<Ton, { wrapper: string; segment: string }> = {
  accent: {
    wrapper: "hover:border-[var(--color-accent)] focus-within:!border-[var(--color-accent)]",
    segment: "text-text",
  },
  cash: {
    wrapper: "hover:border-[var(--color-cash)] focus-within:!border-[var(--color-cash)]",
    segment: "text-text focus:bg-cash/20",
  },
};

export const LARGEUR_DEFAUT = "w-full lg:max-w-[320px]";

/**
 * Sélecteur de plage libre (calendrier HeroUI). Isolé dans son propre fichier pour être chargé
 * à part : le calendrier pèse lourd et n'est pas nécessaire au premier affichage de la page.
 */
export function PlageDatesPicker({
  value,
  onChange,
  maxValue,
  ariaLabel,
  ton = "accent",
  visibleMonths = 2,
  largeur = LARGEUR_DEFAUT,
}: PlageDatesPickerProps) {
  return (
    <DateRangePicker
      aria-label={ariaLabel}
      value={value}
      onChange={(val) => onChange(val)}
      maxValue={maxValue}
      visibleMonths={visibleMonths}
      size="sm"
      classNames={{
        base: largeur,
        inputWrapper: `h-10 border border-border bg-surface shadow-none ${TONS[ton].wrapper}`,
        segment: TONS[ton].segment,
        separator: "text-text-muted",
        calendarContent: "bg-surface border border-border rounded-xl shadow-lg",
      }}
    />
  );
}
