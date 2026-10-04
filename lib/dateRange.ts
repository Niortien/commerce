import { getLocalTimeZone, type DateValue } from "@internationalized/date";

export type DateRange = { start: DateValue; end: DateValue };

/** Début ou fin de journée locale, en ISO, pour les paramètres `dateDebut` / `dateFin` de l'API. */
export function dvToISO(dv: DateValue, endOfDay: boolean): string {
  const d = dv.toDate(getLocalTimeZone());
  if (endOfDay) d.setHours(23, 59, 59, 0);
  else d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
