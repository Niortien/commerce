import { Reveal } from "@/components/marketing/Reveal";

/** Preuve d'usage : Dri Valé gère ses activités avec Mon Djossi. */
export function MarketingTrust() {
  return (
    <section aria-label="Boutiques utilisatrices" className="bg-base pb-2">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-3xl border border-border bg-surface px-5 py-[18px] text-center md:px-7">
            <span className="text-[13px] font-bold uppercase tracking-[0.06em] text-text-muted">Déjà utilisé par</span>
            <span className="font-brand text-[22px] font-semibold tracking-[-0.03em] text-text">Dri Valé</span>
            <span className="max-w-xl text-md text-text-muted">
              La boutique de streetwear Dri Valé utilise Mon Djossi pour gérer ses activités : caisse, stock et rapports.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
