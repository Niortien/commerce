import { Button, Card } from "@heroui/react";
import { IconPlus } from "@tabler/icons-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { prixAffiche } from "@/lib/vitrine";
import type { VitrineProduit } from "@/types";

interface Props {
  produit: VitrineProduit;
  onOuvrir: (p: VitrineProduit) => void;
  /** Article sans choix de taille : ajout direct ; sinon la fiche s'ouvre pour choisir. */
  onAjouter: (p: VitrineProduit) => void;
  /** Une seule vue agrandie par rangée : l'article en promotion. */
  agrandi?: boolean;
}

/** Une vue de la planche : la photo bord à bord, coins carrés, le nom et le prix dessous à la même petite taille. */
export function ProduitVitrineCard({ produit, onOuvrir, onAjouter, agrandi = false }: Props) {
  const enPromo = produit.prixPromo !== null;
  const dernieres = produit.variantes.length > 0 && produit.variantes.every((v) => v.dernieresPieces);
  const plusieursChoix = produit.variantes.length > 1;

  return (
    <div className="group relative h-full">
      <Card
        isPressable
        radius="none"
        shadow="none"
        onPress={() => onOuvrir(produit)}
        className="block h-full w-full bg-transparent text-left"
        aria-label={`${produit.nom}, ${formatCurrency(prixAffiche(produit))}`}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-high">
          {produit.images[0] ? (
            <img
              src={produit.images[0]}
              alt=""
              width={480}
              height={600}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <span
              aria-hidden
              className={`absolute inset-0 flex items-end p-3 font-display font-bold leading-[0.95] tracking-[-0.02em] text-text ${
                agrandi ? "text-4xl" : "text-2xl"
              }`}
            >
              {produit.nom}
            </span>
          )}
        </div>
        <div className="pb-1 pr-12 pt-2.5">
          <p className={`line-clamp-2 text-text ${agrandi ? "text-base font-medium" : "text-sm"}`}>{produit.nom}</p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-text">{formatCurrency(prixAffiche(produit))}</p>
          {enPromo ? (
            <p className="text-sm tabular-nums text-text-muted">
              <span className="sr-only">au lieu de </span>
              <s>{formatCurrency(produit.prixVente)}</s>
            </p>
          ) : null}
          {dernieres ? <p className="mt-0.5 text-sm text-return-text">Dernières pièces</p> : null}
          {plusieursChoix && !dernieres ? <p className="mt-0.5 text-sm text-text-muted">{produit.variantes.length} choix</p> : null}
        </div>
      </Card>

      <Button
        isIconOnly
        radius="full"
        onPress={() => onAjouter(produit)}
        aria-label={plusieursChoix ? `Choisir la taille de ${produit.nom}` : `Ajouter ${produit.nom} au panier`}
        className="absolute bottom-1 right-0 z-10 h-10 w-10 min-w-10 bg-[color:var(--sector)] text-white transition-transform hover:scale-105 active:scale-95"
      >
        <IconPlus size={20} aria-hidden />
      </Button>
    </div>
  );
}
