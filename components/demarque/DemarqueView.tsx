"use client";

import { useMemo, useState } from "react";
import { Button, Spinner } from "@heroui/react";
import { IconClockHour4, IconDiscount, IconHanger } from "@tabler/icons-react";
import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { StatTile } from "@/components/common/StatTile";
import { useAppliquerDemarque } from "@/features/demarque/mutation/demarque-mutations";
import { useDemarques } from "@/features/demarque/query/demarque-queries";
import { DUREES_DEMARQUE, prixDemarque } from "@/lib/balles";
import { formatCurrency } from "@/lib/formatCurrency";
import { useAuthStore } from "@/stores/authStore";
import { DemarqueActions, regleDe, type CleBaisse } from "./DemarqueActions";
import { PieceADemarquerList } from "./PieceADemarquerList";

const OPTIONS_DUREE = DUREES_DEMARQUE.map((j) => ({ key: String(j), label: `${j} j et +` }));

/**
 * Friperie : les pièces qui traînent en rayon (depuis leur mise en rayon ou leur dernière démarque).
 * L'admin choisit les pièces et la baisse ; le prix d'origine reste noté.
 */
export function DemarqueView() {
  const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN");
  const [duree, setDuree] = useState("30");
  const [baisse, setBaisse] = useState<CleBaisse>("30");
  const [prixFixe, setPrixFixe] = useState("");
  // On retient les pièces écartées : toute nouvelle pièce de la liste est choisie d'office.
  const [ecartees, setEcartees] = useState<ReadonlySet<string>>(new Set());

  const { data, isLoading } = useDemarques({ joursMin: Number(duree), limit: 200 });
  const pieces = useMemo(() => data?.data ?? [], [data]);
  const appliquer = useAppliquerDemarque();

  const selection = useMemo(() => new Set(pieces.filter((p) => !ecartees.has(p.id)).map((p) => p.id)), [pieces, ecartees]);
  const regle = useMemo(() => regleDe(baisse, prixFixe), [baisse, prixFixe]);

  // Aperçu, même calcul que le serveur : seules les pièces dont le prix baisse vraiment comptent.
  const apercu = useMemo(() => {
    const m = new Map<string, number>();
    if (!regle) return m;
    for (const p of pieces) {
      if (!selection.has(p.id)) continue;
      const nouveau = prixDemarque(Number(p.prixVente), regle.mode, regle.valeur);
      if (nouveau < Number(p.prixVente)) m.set(p.id, nouveau);
    }
    return m;
  }, [pieces, selection, regle]);

  const concernees = pieces.filter((p) => apercu.has(p.id));
  const totalAvant = concernees.reduce((s, p) => s + Number(p.prixVente), 0);
  const totalApres = concernees.reduce((s, p) => s + (apercu.get(p.id) ?? 0), 0);
  const valeurAttente = pieces.reduce((s, p) => s + Number(p.prixVente), 0);

  const basculer = (id: string) =>
    setEcartees((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <PageWrapper>
      <PageHero
        tone="return"
        icon={IconDiscount}
        eyebrow="Opérations"
        title="Démarque"
        description="Les pièces qui attendent en rayon depuis trop longtemps. Baissez leur prix pour les faire partir : le prix d'origine reste noté sur chaque pièce."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatTile tone="return" icon={IconClockHour4} label={`En rayon depuis ${duree} j et +`} value={data ? pieces.length : "—"} />
          <StatTile tone="cash" icon={IconHanger} label="Leur valeur en rayon" value={data ? formatCurrency(valeurAttente) : "—"} delay={0.05} />
        </div>
      </PageHero>

      <SegmentedControl ariaLabel="Ancienneté en rayon" options={OPTIONS_DUREE} value={duree} onChange={setDuree} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : pieces.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="max-w-md text-sm text-text-muted">
            Aucune pièce n&apos;attend en rayon depuis {duree} jours ou plus. Vos pièces tournent bien.
          </p>
          <Button as={Link} href="/balles" variant="bordered" className="min-h-11">
            Voir les balles
          </Button>
        </div>
      ) : (
        <>
          {isAdmin ? (
            <DemarqueActions
              baisse={baisse}
              onBaisse={setBaisse}
              prixFixe={prixFixe}
              onPrixFixe={setPrixFixe}
              nbConcernees={concernees.length}
              totalAvant={totalAvant}
              totalApres={totalApres}
              enCours={appliquer.isPending}
              onAppliquer={async () => {
                if (!regle) return;
                await appliquer.mutateAsync({ produitIds: concernees.map((p) => p.id), ...regle });
                setEcartees(new Set());
              }}
            />
          ) : (
            <p className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-text-muted">
              Seul l&apos;administrateur de la boutique peut baisser les prix. Signalez-lui ces pièces.
            </p>
          )}

          <PieceADemarquerList
            pieces={pieces}
            selection={selection}
            onBasculer={basculer}
            onToutBasculer={(tout) => setEcartees(tout ? new Set() : new Set(pieces.map((p) => p.id)))}
            apercu={apercu}
            selectionnable={isAdmin}
          />
        </>
      )}
    </PageWrapper>
  );
}
