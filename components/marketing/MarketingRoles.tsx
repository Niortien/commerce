import { IconBuildingStore, IconCashRegister, IconCheck, IconShieldCheck } from "@tabler/icons-react";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

// Reflète l'enum Role du backend : SUPER_ADMIN, ADMIN, CAISSIER.
const ROLES = [
  {
    icon: IconShieldCheck,
    name: "Super Admin",
    scope: "La plateforme",
    points: [
      "Inscrit les boutiques et leur administrateur",
      "Crée, renouvelle et change le plan des abonnements",
      "Active, suspend ou archive une boutique",
      "Consulte l'activité de n'importe quelle boutique",
    ],
  },
  {
    icon: IconBuildingStore,
    name: "Admin de boutique",
    scope: "Une boutique",
    points: [
      "Gère produits, catégories et promotions",
      "Suit stock, entrées, sorties et rapports",
      "Crée les comptes caissiers",
      "Consulte l'activité et l'historique de sa boutique",
    ],
  },
  {
    icon: IconCashRegister,
    name: "Caissier",
    scope: "Le comptoir",
    points: [
      "Ouvre sa session de caisse et encaisse",
      "Enregistre les ventes et imprime le reçu",
      "Consulte le stock pour répondre au client",
      "N'accède pas à l'administration de la boutique",
    ],
  },
];

export function MarketingRoles() {
  return (
    <section id="roles" className="scroll-mt-20 bg-base pt-[clamp(72px,10vw,128px)]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Trois rôles"
            title="Chacun voit ce dont il a besoin. Rien de plus."
            description="Les droits suivent l'organisation réelle : la plateforme, la boutique, le comptoir."
          />
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {ROLES.map(({ icon: Icon, name, scope, points }, i) => (
            <Reveal key={name} delay={i * 0.05} className="h-full">
              <article className="flex h-full flex-col gap-[18px] rounded-[28px] border border-border bg-surface p-7 md:p-9">
                <div className="flex items-center gap-3">
                  <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[var(--mk-ink)] text-white">
                    <Icon size={22} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[22px] font-extrabold leading-tight tracking-[-0.015em] text-text">{name}</h3>
                    <p className="text-sm font-medium text-text-muted">{scope}</p>
                  </div>
                </div>
                <ul className="flex flex-col gap-3">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[16.5px] leading-relaxed text-text">
                      <span aria-hidden className="mt-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-accent text-white">
                        <IconCheck size={13} strokeWidth={3.2} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
