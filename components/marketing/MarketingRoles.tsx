import { IconBuildingStore, IconCashRegister, IconShieldCheck } from "@tabler/icons-react";
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
    <section id="roles" className="scroll-mt-20 bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Trois rôles"
            title="Chacun voit ce qui le concerne, pas plus"
            description="Les droits suivent l'organisation réelle : la plateforme, la boutique, le comptoir."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {ROLES.map(({ icon: Icon, name, scope, points }, i) => (
            <Reveal key={name} delay={i * 0.05} className="h-full">
              <article className="flex h-full flex-col rounded-lg border border-border bg-base p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-dim text-accent-text">
                    <Icon size={20} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-text">{name}</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{scope}</p>
                  </div>
                </div>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-text-muted">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
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
