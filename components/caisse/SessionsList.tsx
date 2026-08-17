"use client";

import { Button, DateRangePicker, Spinner } from "@heroui/react";
import { useMemo, useState } from "react";
import {
  getLocalTimeZone,
  today,
  type DateValue,
} from "@internationalized/date";
import { useSessionsList } from "@/features/caisse/query/caisse-queries";
import type { Session } from "@/types";
import { SessionCard } from "./SessionCard";
import { SessionDetailDrawer } from "./SessionDetailDrawer";

type DateRange = { start: DateValue; end: DateValue };

function dvToISO(dv: DateValue, endOfDay: boolean): string {
  const d = dv.toDate(getLocalTimeZone());
  if (endOfDay) d.setHours(23, 59, 59, 0);
  else d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function SessionsList() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const now = useMemo(() => today(getLocalTimeZone()), []);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const queryParams = useMemo(
    () => ({
      limit: 10,
      sortOrder: "desc" as const,
      ...(dateRange
        ? {
            dateDebut: dvToISO(dateRange.start, false),
            dateFin: dvToISO(dateRange.end, true),
          }
        : {}),
    }),
    [dateRange]
  );

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSessionsList(queryParams);

  const sessions = (data?.pages ?? []).flatMap((p) => p.data as Session[]);

  return (
    <>
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-text-muted">
            Historique des sessions
          </h2>
          {data && (
            <span className="text-xs text-text-dim">
              {data.pages[0]?.meta?.total ?? 0} session
              {(data.pages[0]?.meta?.total ?? 0) !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Filtre plage de date */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <DateRangePicker
            aria-label="Filtrer par période"
            value={dateRange}
            onChange={(val) => setDateRange(val)}
            maxValue={now}
            size="sm"
            classNames={{
              base: "max-w-[300px]",
              inputWrapper:
                "border border-border/60 bg-[var(--color-surface-high)] shadow-none hover:border-[var(--color-cash)]/50 focus-within:!border-[var(--color-cash)]/70 h-9",
              segment: "text-text focus:bg-[var(--color-cash)]/20",
              separator: "text-text-dim",
              calendarContent:
                "bg-[var(--color-surface)] border border-border/60 rounded-xl shadow-xl",
            }}
          />
          {dateRange && (
            <Button
              size="sm"
              variant="light"
              className="text-xs text-text-dim hover:text-text-muted"
              onPress={() => setDateRange(null)}
            >
              Réinitialiser
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner color="warning" size="sm" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-surface p-8 text-center">
            <p className="text-sm text-text-dim">
              {dateRange
                ? "Aucune session sur cette période"
                : "Aucune session enregistrée"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={setSelectedSession}
              />
            ))}
          </div>
        )}

        {hasNextPage && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="bordered"
              size="sm"
              isLoading={isFetchingNextPage}
              onPress={() => fetchNextPage()}
            >
              Charger plus
            </Button>
          </div>
        )}
      </div>

      <SessionDetailDrawer
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </>
  );
}
