"use client";

import { useMemo, useState } from "react";
import { Button, Chip, DateRangePicker } from "@heroui/react";
import {
  endOfMonth,
  endOfWeek,
  getLocalTimeZone,
  startOfMonth,
  startOfWeek,
  today,
  type DateValue,
} from "@internationalized/date";
import { useLocale } from "react-aria";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useEntreesList } from "@/features/entrees/query/entrees-queries";
import { EntreesTable } from "./EntreesTable";
import { EntreeCreatePanel } from "./EntreeCreatePanel";

type DateRange = { start: DateValue; end: DateValue };

function dvToISO(dv: DateValue, endOfDay: boolean): string {
  const d = dv.toDate(getLocalTimeZone());
  if (endOfDay) d.setHours(23, 59, 59, 0);
  else d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function EntreesView() {
  const { locale } = useLocale();
  const [panelOpen, setPanelOpen] = useState(false);

  const now = useMemo(() => today(getLocalTimeZone()), []);

  const presets = useMemo(
    () => [
      { label: "Aujourd'hui", value: { start: now, end: now } },
      { label: "7j", value: { start: now.subtract({ days: 6 }), end: now } },
      { label: "30j", value: { start: now.subtract({ days: 29 }), end: now } },
      { label: "Ce mois", value: { start: startOfMonth(now), end: endOfMonth(now) } },
      { label: "Mois dernier", value: { start: startOfMonth(now.subtract({ months: 1 })), end: endOfMonth(now.subtract({ months: 1 })) } },
      { label: "Cette semaine", value: { start: startOfWeek(now, locale), end: endOfWeek(now, locale) } },
    ],
    [locale, now]
  );

  const [dateRange, setDateRange] = useState<DateRange>({ start: now, end: now });

  const isPresetActive = (p: DateRange) =>
    dateRange.start.compare(p.start) === 0 && dateRange.end.compare(p.end) === 0;

  const params = useMemo(
    () => ({
      limit: 50,
      dateDebut: dvToISO(dateRange.start, false),
      dateFin: dvToISO(dateRange.end, true),
    }),
    [dateRange]
  );

  const { data } = useEntreesList(params);
  const items = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <EntreeCreatePanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />

      <PageWrapper>
        {/* En-tête */}
        <div className="flex flex-wrap items-end justify-between gap-3 rounded-xl border border-border/80 bg-[linear-gradient(120deg,rgba(57,211,83,0.18),rgba(34,54,81,0.42))] p-4 md:p-5">
          <div>
            <h1 className="font-[var(--font-display)] text-2xl text-in md:text-4xl">Entrées</h1>
            <p className="mt-1 text-sm text-text-muted">
              {items.length} entrée{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button className="bg-in font-semibold text-black" onPress={() => setPanelOpen(true)}>
            + Nouvelle entrée
          </Button>
        </div>

        {/* Filtres date */}
        <div className="flex flex-col gap-2">
          <DateRangePicker
            aria-label="Période des entrées"
            value={dateRange}
            onChange={(val) => val && setDateRange(val)}
            maxValue={now}
            visibleMonths={2}
            size="sm"
            classNames={{
              base: "max-w-[340px]",
              inputWrapper:
                "border border-border/60 bg-[var(--color-surface-high)] shadow-none hover:border-in/50 focus-within:!border-in/70 h-9",
              segment: "text-text focus:bg-in/20",
              separator: "text-text-dim",
            }}
          />
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <Chip
                key={p.label}
                variant="flat"
                className={
                  isPresetActive(p.value)
                    ? "cursor-pointer bg-in font-semibold text-black"
                    : "cursor-pointer bg-[var(--color-surface-high)] text-text-muted hover:text-text"
                }
                onClick={() => setDateRange(p.value)}
              >
                {p.label}
              </Chip>
            ))}
          </div>
        </div>

        <EntreesTable data={items} />
      </PageWrapper>
    </>
  );
}
