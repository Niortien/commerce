import type { CSSProperties, ReactNode } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import { prixAffiche } from "@/lib/vitrine";
import type { VitrineBoutique, VitrineProduit } from "@/types";

interface Etape {
  titre: string;
  texte: string;
  /** Hauteur du vide avant l'image : variable d'une colonne à l'autre, les images montent et descendent. */
  vide: string;
  image: ReactNode;
}

/**
 * Comment commander, raconté de gauche à droite et glissé du pouce. Les images sont faites avec les vrais
 * articles de la boutique : la photo d'un article, le panier, puis le message WhatsApp tel qu'il partira.
 */
export function VitrineEtapes({ boutique, produits }: { boutique: VitrineBoutique; produits: VitrineProduit[] }) {
  const [premier, second] = produits;
  if (!premier) return null;
  const exemples = [premier, second].filter((p): p is VitrineProduit => p !== undefined);
  const total = exemples.reduce((s, p) => s + prixAffiche(p), 0);

  const etapes: Etape[] = [
    {
      titre: "Vous choisissez",
      texte: "Touchez un article pour voir ses photos et ses tailles, puis ajoutez-le au panier.",
      vide: "h-8 sm:h-16",
      image: premier.images[0] ? (
        <img src={premier.images[0]} alt="" width={400} height={500} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full items-end bg-surface-high p-4 font-display text-3xl font-bold leading-[0.95] text-text">{premier.nom}</span>
      ),
    },
    {
      titre: "Le panier se remplit",
      texte: "Ajoutez autant d'articles que vous voulez, dans plusieurs tailles. Le total se calcule tout seul.",
      vide: "h-16 sm:h-36",
      image: (
        <div data-ui className="flex h-full flex-col justify-end gap-3 bg-surface-high p-4">
          {exemples.map((p) => (
            <div key={p.id} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="line-clamp-1 text-text">1 × {p.nom}</span>
              <span className="shrink-0 tabular-nums text-text-muted">{formatCurrency(prixAffiche(p))}</span>
            </div>
          ))}
          <div className="mt-2 flex items-baseline justify-between bg-surface p-3 text-sm font-semibold">
            <span className="text-text">Total</span>
            <span className="tabular-nums text-text">{formatCurrency(total)}</span>
          </div>
        </div>
      ),
    },
    {
      titre: "Le message part sur WhatsApp",
      texte: `Un seul bouton : votre commande arrive chez ${boutique.nom}, déjà écrite, avec le total.`,
      vide: "h-10 sm:h-24",
      image: (
        <div data-ui className="flex h-full flex-col justify-end bg-[#e7dfd4] p-4 dark:bg-[#1f2c33]">
          <p className="ml-auto max-w-[92%] whitespace-pre-line bg-[#d9fdd3] p-3 text-sm leading-snug text-[#111b21] dark:bg-[#005c4b] dark:text-[#e9edef]">
            {`Bonjour ${boutique.nom}, je souhaite commander :\n${exemples.map((p) => `• 1 × ${p.nom}`).join("\n")}\nTotal : ${formatCurrency(total)}`}
          </p>
        </div>
      ),
    },
    {
      titre: "La boutique vous répond",
      texte: "Elle confirme la disponibilité, puis le paiement et la livraison avec vous, directement.",
      vide: "h-20 sm:h-44",
      image: boutique.logoUrl ? (
        <img src={boutique.logoUrl} alt="" width={400} height={500} loading="lazy" className="h-full w-full bg-white object-contain p-10" />
      ) : (
        <span className="flex h-full items-center justify-center bg-[color:var(--sector)] font-display text-8xl font-bold text-white">
          {boutique.nom.charAt(0).toUpperCase()}
        </span>
      ),
    },
  ];

  return (
    <section aria-labelledby="etapes-titre" className="py-24 sm:py-36">
      <h2 id="etapes-titre" className="vitrine-entre mx-auto w-full max-w-[1600px] px-5 font-display text-3xl font-bold tracking-[-0.02em] text-text sm:px-8 sm:text-4xl">
        Commander, simplement
      </h2>
      <ol className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:gap-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
        {etapes.map((e, i) => (
          <li
            key={e.titre}
            className="vitrine-entre flex w-[72vw] shrink-0 snap-start flex-col sm:w-[300px]"
            style={{ "--vitrine-decalage": `${i * 8}%` } as CSSProperties}
          >
            <h3 className="text-lg font-bold text-text">{e.titre}</h3>
            <p className="mt-2 text-base text-text-muted">{e.texte}</p>
            <div aria-hidden className={e.vide} />
            <div className="aspect-[4/5] w-full overflow-hidden">{e.image}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}
