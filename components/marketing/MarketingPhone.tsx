import { IconAlertTriangle, IconCheck, IconPlus, IconStar } from "@tabler/icons-react";

// Valeurs d'exemple, annoncées comme telles sous la maquette.
const BARS = [55, 66, 48, 76, 62, 88, 100];

const NOTIFS = [
  {
    icon: IconCheck,
    tone: "bg-accent-dim text-accent-text",
    title: "Vente encaissée",
    text: "+ 12 500 FCFA · Caisse 1",
    pos: "left-0 top-16",
    delay: "1.6s, 2.4s",
    hideSmall: false,
  },
  {
    icon: IconAlertTriangle,
    tone: "bg-[#FFE9DB] text-[#B7470B]",
    title: "Alerte stock",
    text: "Robe wax, taille M : plus que 2",
    pos: "right-0 top-[268px]",
    delay: "2.2s, 3s",
    hideSmall: true,
  },
  {
    icon: IconStar,
    tone: "bg-[#FFF3CC] text-[#0F172A]",
    title: "Produit star du jour",
    text: "Robe wax · 9 ventes",
    pos: "bottom-[70px] left-2.5",
    delay: "2.8s, 3.6s",
    hideSmall: false,
  },
] as const;

/** Maquette animée de l'application mobile : encaissement, bilan du jour et notifications flottantes. */
export function MarketingPhone() {
  return (
    <div>
      <div aria-hidden className="relative mx-auto h-[660px] w-full max-w-[500px]">
        <div className="mk-phone absolute left-1/2 top-2.5 -ml-[150px] h-[620px] w-[300px] rounded-[48px] bg-[#0F172A] p-[11px] shadow-[0_60px_110px_-50px_rgba(15,29,51,0.55)]">
          <div className="flex h-full w-full flex-col gap-3 overflow-hidden rounded-[38px] bg-base px-4 pb-4 pt-[26px]">
            <div className="rounded-[20px] border border-border bg-surface p-3.5">
              <p className="text-xs font-semibold text-text-muted">Ventes du jour</p>
              <p className="mt-1 font-brand text-[21px] font-semibold leading-[1.1] tracking-[-0.03em] tabular-nums text-text">185 000 FCFA</p>
            </div>
            <div className="flex items-center gap-3.5 rounded-[20px] border border-border bg-surface p-3.5">
              <svg viewBox="0 0 80 80" className="h-16 w-16 shrink-0">
                <circle cx="40" cy="40" r="32" fill="none" strokeWidth="9" className="stroke-surface-high" />
                <circle cx="40" cy="40" r="32" fill="none" strokeWidth="9" strokeDasharray="201" strokeDashoffset="44" className="mk-ring" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-text-muted">Objectif du jour</p>
                <p className="font-brand text-xl font-semibold tracking-[-0.03em] text-text">78 %</p>
              </div>
            </div>
            <div className="rounded-[20px] border border-border bg-surface p-3.5">
              <p className="text-xs font-semibold text-text-muted">7 derniers jours</p>
              <div className="mt-2 flex h-[62px] items-end gap-[7px]">
                {BARS.map((h, i) => (
                  <i
                    key={i}
                    className={`mk-bar flex-1 rounded-t-[5px] rounded-b-[2px] ${i === BARS.length - 1 ? "bg-accent" : "bg-surface-high"}`}
                    style={{ height: `${h}%`, animationDelay: `${1.2 + i * 0.08}s` }}
                  />
                ))}
              </div>
            </div>
            <div className="relative mt-auto flex h-[50px] items-center justify-center gap-2 rounded-2xl bg-accent text-[15px] font-bold text-white">
              <span className="mk-halo absolute inset-0 rounded-2xl" />
              <IconPlus size={20} strokeWidth={2.6} />
              Nouvelle vente
            </div>
          </div>
        </div>

        {NOTIFS.map(({ icon: Icon, tone, title, text, pos, delay, hideSmall }) => (
          <div
            key={title}
            className={`mk-float absolute z-[2] flex items-center gap-3 whitespace-nowrap rounded-[18px] border border-border bg-surface py-3 pl-3 pr-4 text-sm leading-snug shadow-[0_24px_44px_-22px_rgba(15,29,51,0.35)] ${pos} ${hideSmall ? "max-[560px]:hidden" : ""}`}
            style={{ animationDelay: delay }}
          >
            <span className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl ${tone}`}>
              <Icon size={20} strokeWidth={2.4} />
            </span>
            <span>
              <b className="block text-[14.5px] text-text">{title}</b>
              <span className="text-text-muted">{text}</span>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-center text-[13px] text-text-muted">Données d&apos;exemple</p>
    </div>
  );
}
