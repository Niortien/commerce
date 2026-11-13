"use client";

import { useMemo, useState } from "react";
import { Spinner } from "@heroui/react";
import { PageHeader } from "@/components/common/PageHeader";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { useVitesseSite } from "@/features/super-admin/query/superadmin-vitesse-queries";
import { formaterMesure, noteDe, SEUILS_WEB_VITALS } from "@/lib/webVitals";
import type { MetriqueWebVital, NoteWebVital, VitessePage } from "@/types";

type Periode = "7" | "28" | "90";
const PERIODES: Array<{ key: Periode; label: string }> = [
  { key: "7", label: "7 jours" },
  { key: "28", label: "28 jours" },
  { key: "90", label: "90 jours" },
];

/** Les trois mesures qui comptent pour Google, puis la réponse du serveur. */
const COLONNES: MetriqueWebVital[] = ["LCP", "INP", "CLS", "TTFB"];

const STYLE_NOTE: Record<NoteWebVital, { classe: string; libelle: string }> = {
  good: { classe: "text-in-text", libelle: "bon" },
  "needs-improvement": { classe: "text-return-text", libelle: "à améliorer" },
  poor: { classe: "text-out-text", libelle: "lent" },
};

/**
 * Vitesse réelle du site, mesurée chez les visiteurs (Web Vitals) : pour chaque page et chaque type
 * d'appareil, la valeur que 75 % des visites atteignent ou dépassent en mieux (le 75e centile).
 */
export function VitesseView() {
  const [periode, setPeriode] = useState<Periode>("28");
  const { data, isLoading } = useVitesseSite(Number(periode));
  const vitesse = data?.data;

  const chiffres = useMemo(() => {
    const pages = vitesse?.parPage ?? [];
    const mobiles = pages.filter((p) => p.appareil === "mobile");
    const rapides = mobiles.filter((p) => {
      const lcp = p.metriques.find((m) => m.metrique === "LCP");
      return lcp !== undefined && noteDe("LCP", lcp.p75) === "good";
    });
    return [
      { label: "Visites mesurées", valeur: pages.reduce((s, p) => s + p.nbVisites, 0).toLocaleString("fr-FR") },
      { label: "Pages suivies", valeur: String(new Set(pages.map((p) => p.page)).size) },
      { label: "Pages rapides sur téléphone", valeur: mobiles.length > 0 ? `${rapides.length} sur ${mobiles.length}` : "—" },
    ];
  }, [vitesse]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Vitesse du site"
        description="Mesurée chez les vrais visiteurs, sur leur téléphone et leur réseau. Chaque valeur est atteinte par 75 % des visites."
        actions={<SegmentedControl ariaLabel="Période" value={periode} onChange={setPeriode} options={PERIODES} />}
      />

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {chiffres.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-surface p-4">
            <dt className="text-xs text-text-muted">{c.label}</dt>
            <dd className="tabular mt-1 text-2xl font-semibold text-text">{c.valeur}</dd>
          </div>
        ))}
      </dl>

      {isLoading || !vitesse ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : vitesse.parPage.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface px-4 py-10 text-center text-sm text-text-muted">
          Aucune mesure sur cette période. Elles arrivent dès que des visiteurs ouvrent le site en production.
        </p>
      ) : (
        <section aria-labelledby="vitesse-pages" className="overflow-x-auto rounded-xl border border-border bg-surface">
          <h2 id="vitesse-pages" className="px-4 pt-4 font-semibold text-text">
            Par page
          </h2>
          <table className="mt-2 w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="text-left text-xs text-text-muted">
                <th scope="col" className="px-4 py-2 font-normal">Page</th>
                <th scope="col" className="px-4 py-2 font-normal">Appareil</th>
                <th scope="col" className="px-4 py-2 text-right font-normal">Visites</th>
                {COLONNES.map((m) => (
                  <th key={m} scope="col" className="px-4 py-2 text-right font-normal">
                    {SEUILS_WEB_VITALS[m].libelle}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vitesse.parPage.map((p) => (
                <LignePage key={`${p.page}|${p.appareil}`} page={p} />
              ))}
            </tbody>
          </table>
          <p className="px-4 pb-4 pt-2 text-xs text-text-muted">
            Seuils de Google : affichage principal bon sous 2,5 s, réaction au toucher sous 200 ms, stabilité sous 0,1, réponse du serveur sous 800 ms.
          </p>
        </section>
      )}
    </div>
  );
}

function LignePage({ page }: { page: VitessePage }) {
  return (
    <tr>
      <th scope="row" className="px-4 py-3 text-left font-mono text-xs font-normal text-text">
        {page.page}
      </th>
      <td className="px-4 py-3 text-text">{page.appareil === "mobile" ? "Téléphone" : "Ordinateur"}</td>
      <td className="tabular px-4 py-3 text-right text-text">{page.nbVisites.toLocaleString("fr-FR")}</td>
      {COLONNES.map((m) => {
        const resume = page.metriques.find((x) => x.metrique === m);
        if (!resume) {
          return (
            <td key={m} className="px-4 py-3 text-right text-text-muted">
              —
            </td>
          );
        }
        const note = STYLE_NOTE[noteDe(m, resume.p75)];
        return (
          <td key={m} className={`tabular px-4 py-3 text-right font-semibold ${note.classe}`}>
            {formaterMesure(m, resume.p75)}
            <span className="sr-only"> ({note.libelle})</span>
          </td>
        );
      })}
    </tr>
  );
}
