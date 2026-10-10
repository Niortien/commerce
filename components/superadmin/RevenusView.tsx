"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Spinner } from "@heroui/react";
import { PageHeader } from "@/components/common/PageHeader";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { useRevenus } from "@/features/super-admin/query/superadmin-revenus-queries";
import { COMMERCE_PROFILES, sectorStyle } from "@/lib/commerce";
import { formatCurrency } from "@/lib/formatCurrency";

// Recharts est lourd : le graphique ne se charge qu'à l'ouverture de la page.
const RevenusChart = dynamic(() => import("./RevenusChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center">
      <Spinner />
    </div>
  ),
});

const ANNEE_COURANTE = new Date().getFullYear();
const ANNEES = [ANNEE_COURANTE, ANNEE_COURANTE - 1, ANNEE_COURANTE - 2].map((a) => ({ key: String(a), label: String(a) }));

/**
 * Ce que rapportent les abonnements, secteur par secteur : l'année, le mois en cours et le revenu mensuel
 * récurrent des abonnements en cours. Sans montant saisi, un abonnement compte au tarif de son plan.
 */
export function RevenusView() {
  const [annee, setAnnee] = useState(String(ANNEE_COURANTE));
  const { data, isLoading } = useRevenus(Number(annee));
  const revenus = data?.data;

  // Secteurs qui ont des boutiques ou des revenus, du plus rentable au moins rentable.
  const lignes = useMemo(
    () =>
      (revenus?.parSecteur ?? [])
        .filter((s) => s.nbBoutiques > 0 || s.revenusAnnee > 0)
        .sort((a, b) => b.revenusAnnee - a.revenusAnnee || b.nbBoutiques - a.nbBoutiques),
    [revenus]
  );
  const secteursPayants = useMemo(() => lignes.filter((l) => l.revenusAnnee > 0).map((l) => l.typeCommerce), [lignes]);
  const total = revenus?.totalAnnee ?? 0;

  const chiffres = [
    { label: `Revenus ${annee}`, valeur: revenus ? formatCurrency(revenus.totalAnnee) : "—" },
    { label: "Ce mois-ci", valeur: revenus ? formatCurrency(revenus.totalMoisCourant) : "—" },
    { label: "Revenu mensuel récurrent", valeur: revenus ? formatCurrency(revenus.revenuMensuelRecurrent) : "—", detail: "abonnements en cours, ramenés au mois" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        eyebrow="Plateforme"
        title="Revenus par secteur"
        description="Ce que rapportent les abonnements de chaque type de commerce. Un abonnement compte au mois où il commence ; sans montant saisi, au tarif de son plan."
        actions={<SegmentedControl ariaLabel="Année" options={ANNEES} value={annee} onChange={setAnnee} />}
      />

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {chiffres.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-surface p-4">
            <dt className="text-xs text-text-muted">{c.label}</dt>
            <dd className="tabular mt-1 text-2xl font-semibold text-text">{c.valeur}</dd>
            {c.detail && <dd className="text-xs text-text-muted">{c.detail}</dd>}
          </div>
        ))}
      </dl>

      {isLoading || !revenus ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <section aria-labelledby="revenus-mois" className="rounded-xl border border-border bg-surface p-4 text-text-muted">
            <h2 id="revenus-mois" className="mb-3 font-semibold text-text">
              Mois par mois
            </h2>
            {secteursPayants.length === 0 ? (
              <p className="py-10 text-center text-sm">Aucun abonnement payé en {annee}.</p>
            ) : (
              <RevenusChart parMois={revenus.parMois} secteurs={secteursPayants} />
            )}
          </section>

          <section aria-labelledby="revenus-secteurs" className="overflow-x-auto rounded-xl border border-border bg-surface">
            <h2 id="revenus-secteurs" className="px-4 pt-4 font-semibold text-text">
              Par secteur
            </h2>
            <table className="mt-2 w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="text-left text-xs text-text-muted">
                  <th scope="col" className="px-4 py-2 font-normal">Secteur</th>
                  <th scope="col" className="px-4 py-2 text-right font-normal">Boutiques</th>
                  <th scope="col" className="px-4 py-2 text-right font-normal">Abonnements payés</th>
                  <th scope="col" className="px-4 py-2 text-right font-normal">Revenus {annee}</th>
                  <th scope="col" className="px-4 py-2 text-right font-normal">Ce mois</th>
                  <th scope="col" className="px-4 py-2 text-right font-normal">Récurrent / mois</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lignes.map((l) => {
                  const profile = COMMERCE_PROFILES[l.typeCommerce];
                  const Icon = profile.icon;
                  const part = total > 0 ? Math.round((l.revenusAnnee / total) * 100) : 0;
                  return (
                    <tr key={l.typeCommerce} style={sectorStyle(l.typeCommerce)}>
                      <th scope="row" className="px-4 py-3 text-left font-medium text-text">
                        <span className="flex items-center gap-2">
                          <Icon size={18} aria-hidden className="shrink-0 text-[color:var(--sector)]" />
                          {profile.pluriel}
                        </span>
                        {/* Part du secteur dans les revenus de l'année */}
                        <span className="mt-1.5 block h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-surface-high" aria-hidden>
                          <span className="block h-full rounded-full bg-[color:var(--sector)]" style={{ width: `${part}%` }} />
                        </span>
                        <span className="text-xs font-normal text-text-muted">{part} % des revenus</span>
                      </th>
                      <td className="tabular px-4 py-3 text-right text-text">
                        {l.nbBoutiques}
                        <span className="block text-xs text-text-muted">
                          {l.nbActives} active{l.nbActives > 1 ? "s" : ""} · {l.nbEssai} en essai
                        </span>
                      </td>
                      <td className="tabular px-4 py-3 text-right text-text">{l.nbAbonnementsPayes}</td>
                      <td className="tabular px-4 py-3 text-right font-semibold text-text">{formatCurrency(l.revenusAnnee)}</td>
                      <td className="tabular px-4 py-3 text-right text-text">{formatCurrency(l.revenusMoisCourant)}</td>
                      <td className="tabular px-4 py-3 text-right text-text">{formatCurrency(l.revenuMensuelRecurrent)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
