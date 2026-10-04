import {
  IconBoxSeam,
  IconBrandWhatsapp,
  IconBuildingStore,
  IconCashRegister,
  IconChartLine,
  IconPackageExport,
  IconPackageImport,
  IconReceipt2,
  IconRosetteDiscount,
  IconUsersGroup,
} from "@tabler/icons-react";

const ITEMS = [
  { icon: IconBoxSeam, label: "Stock par variante" },
  { icon: IconCashRegister, label: "Caisse en direct" },
  { icon: IconPackageImport, label: "Entrées tracées" },
  { icon: IconPackageExport, label: "Sorties tracées" },
  { icon: IconReceipt2, label: "Reçus 80 mm" },
  { icon: IconRosetteDiscount, label: "Promotions" },
  { icon: IconChartLine, label: "Rapports" },
  { icon: IconUsersGroup, label: "Caissiers" },
  { icon: IconBuildingStore, label: "Multi-boutiques" },
  { icon: IconBrandWhatsapp, label: "Commande WhatsApp" },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-3 pr-3">
      {ITEMS.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-muted"
        >
          <Icon size={16} aria-hidden className="text-accent-text" />
          {label}
        </li>
      ))}
    </ul>
  );
}

/** Bandeau défilant des capacités du produit. La seconde rangée est décorative (masquée aux lecteurs d'écran). */
export function MarketingMarquee() {
  return (
    <section
      aria-label="Ce que couvre Mon Djossi"
      className="marquee overflow-hidden border-b border-border bg-surface-high py-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <div className="marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
