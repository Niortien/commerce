export type PeriodeShorthand = "7j" | "30j" | "90j";

export function getPeriodeRange(periode: PeriodeShorthand): { dateDebut: string; dateFin: string } {
  const now = new Date();
  const days = periode === "7j" ? 7 : periode === "30j" ? 30 : 90;
  const debut = new Date(now.getTime() - days * 86_400_000);
  return { dateDebut: debut.toISOString(), dateFin: now.toISOString() };
}

export function formatDateFr(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}
