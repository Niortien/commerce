import { Card, CardBody, Chip } from "@heroui/react";
import { IconPhoto } from "@tabler/icons-react";
import { formatCurrency } from "@/lib/formatCurrency";
import type { VitrineProduit } from "@/types";

interface Props {
  produit: VitrineProduit;
  onOuvrir: (p: VitrineProduit) => void;
}

export function ProduitVitrineCard({ produit, onOuvrir }: Props) {
  const enPromo = produit.prixPromo !== null;
  const dernieres = produit.variantes.every((v) => v.dernieresPieces);

  return (
    <Card
      isPressable
      onPress={() => onOuvrir(produit)}
      shadow="none"
      className="h-full w-full border border-border bg-surface"
      aria-label={`${produit.nom}, ${formatCurrency(produit.prixPromo ?? produit.prixVente)}`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface-high">
        {produit.images[0] ? (
          <img src={produit.images[0]} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-dim">
            <IconPhoto size={36} aria-hidden />
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {enPromo ? (
            <Chip size="sm" className="bg-accent font-semibold text-white">
              Promo
            </Chip>
          ) : null}
          {dernieres ? (
            <Chip size="sm" variant="solid" color="warning" className="font-semibold">
              Dernières pièces
            </Chip>
          ) : null}
        </div>
      </div>
      <CardBody className="gap-1 p-3 text-left">
        <p className="line-clamp-2 text-sm font-semibold text-text">{produit.nom}</p>
        <p className="flex flex-wrap items-baseline gap-x-2 font-mono text-sm">
          <span className="font-semibold text-accent-text">{formatCurrency(produit.prixPromo ?? produit.prixVente)}</span>
          {enPromo ? <span className="text-xs text-text-muted line-through">{formatCurrency(produit.prixVente)}</span> : null}
        </p>
      </CardBody>
    </Card>
  );
}
