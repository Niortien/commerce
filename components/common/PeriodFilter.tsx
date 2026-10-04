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
}

/** Sélecteur de période : raccourcis (pastille animée) + sélecteur de plage libre. */
export function PeriodFilter({ value, onChange, ariaLabel, tone = "accent" }: PeriodFilterProps) {
  const { locale } = useLocale();
  const now = useMemo(() => today(getLocalTimeZone()), []);

  const presets = useMemo(
    () => [
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
    ],
    [locale, now]
  );

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
