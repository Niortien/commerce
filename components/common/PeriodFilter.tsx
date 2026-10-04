"use client";

import { useMemo } from "react";
import { DateRangePicker } from "@heroui/react";
import {
  endOfMonth,
  endOfWeek,
  getLocalTimeZone,
  startOfMonth,
  startOfWeek,
  today,
} from "@internationalized/date";
import { useLocale } from "react-aria";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import type { Tone } from "@/components/common/tone";
import type { DateRange } from "@/lib/dateRange";

interface PeriodFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  ariaLabel: string;
  tone?: Tone;
  /** Ajoute « Hier », « Semaine passée » et « 90 j » (analyses). */
  extended?: boolean;
}

/** Sélecteur de période : raccourcis (pastille animée) + sélecteur de plage libre. */
export function PeriodFilter({ value, onChange, ariaLabel, tone = "accent", extended = false }: PeriodFilterProps) {
  const { locale } = useLocale();
  const now = useMemo(() => today(getLocalTimeZone()), []);

  const presets = useMemo(() => {
    const base = [
      { key: "today", label: "Aujourd'hui", value: { start: now, end: now } },
      { key: "week", label: "Semaine", value: { start: startOfWeek(now, locale), end: endOfWeek(now, locale) } },
      { key: "7d", label: "7 j", value: { start: now.subtract({ days: 6 }), end: now } },
      { key: "30d", label: "30 j", value: { start: now.subtract({ days: 29 }), end: now } },
      { key: "month", label: "Ce mois", value: { start: startOfMonth(now), end: endOfMonth(now) } },
      {
        key: "lastMonth",
        label: "Mois dernier",
        value: {
          start: startOfMonth(now.subtract({ months: 1 })),
          end: endOfMonth(now.subtract({ months: 1 })),
        },
      },
    ];
    if (!extended) return base;
    const lastWeekStart = startOfWeek(now, locale).subtract({ weeks: 1 });
    return [
      base[0],
      { key: "yesterday", label: "Hier", value: { start: now.subtract({ days: 1 }), end: now.subtract({ days: 1 }) } },
      base[1],
      { key: "lastWeek", label: "Semaine passée", value: { start: lastWeekStart, end: endOfWeek(lastWeekStart, locale) } },
      ...base.slice(2, 4),
      ...base.slice(4),
      { key: "90d", label: "90 j", value: { start: now.subtract({ days: 89 }), end: now } },
    ];
  }, [locale, now, extended]);

  const active = presets.find((p) => value.start.compare(p.value.start) === 0 && value.end.compare(p.value.end) === 0);

  return (
    <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
      <SegmentedControl
        ariaLabel={ariaLabel}
        tone={tone}
        value={active?.key ?? null}
        onChange={(key) => {
          const preset = presets.find((p) => p.key === key);
          if (preset) onChange(preset.value);
        }}
        options={presets.map(({ key, label }) => ({ key, label }))}
      />
      <DateRangePicker
        aria-label={`${ariaLabel} — plage personnalisée`}
        value={value}
        onChange={(val) => val && onChange(val)}
        maxValue={now}
        visibleMonths={2}
        size="sm"
        classNames={{
          base: "w-full lg:max-w-[320px]",
          inputWrapper:
            "h-10 border border-border bg-surface shadow-none hover:border-[var(--color-accent)] focus-within:!border-[var(--color-accent)]",
          segment: "text-text",
          separator: "text-text-muted",
          calendarContent: "bg-surface border border-border rounded-xl shadow-lg",
        }}
      />
    </div>
  );
}
