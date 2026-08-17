// Backend renvoie la semaine au format MySQL DATE_FORMAT '%Y-%u' (ex: "2026-27")
export function formatSemaineLabel(semaine: string): string {
  const [annee, numero] = semaine.split("-");
  if (!annee || !numero) return semaine;
  return `S${numero} ${annee}`;
}
