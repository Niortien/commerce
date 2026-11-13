import type { ReactNode } from "react";
import { imageVitrine, prixAffiche, prixCourt, srcsetVitrine } from "@/lib/vitrine";
import type { VitrineBoutique, VitrineProduit } from "@/types";

interface Etape {
  titre: string;
  texte: string;
  /** Les images grandissent d'une étape à l'autre : leur taille dit l'ordre, sans numéros. */
  hauteur: string;
  image: ReactNode;
}

/**
 * « Commander, simplement » : trois étapes dont les images grandissent, faites avec les vrais articles
 * de la boutique (la photo d'un article, le panier, puis le message WhatsApp tel qu'il partira).
 */
export function VitrineEtapes({ boutique, produits }: { boutique: VitrineBoutique; produits: VitrineProduit[] }) {
  const [premier, second] = produits;
  if (!premier || !boutique.whatsapp) return null;
  const exemples = [premier, second].filter((p): p is VitrineProduit => p !== undefined);
  const total = exemples.reduce((s, p) => s + prixAffiche(p), 0);

  const etapes: Etape[] = [
    {
      titre: "Vous choisissez",
      texte: "Touchez un article pour voir ses photos et ses tailles, puis « + » pour l'ajouter.",
      hauteur: "h-[34vw] max-h-[300px] min-[900px]:h-[30vh]",
      image: premier.images[0] ? (
        <img
          src={imageVitrine(premier.images[0], 768)}
          srcSet={srcsetVitrine(premier.images[0], [480, 768, 1080])}
          sizes="(min-width: 900px) 25vw, 100vw"
          alt=""
          width={480}
          height={600}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full items-end bg-fa-gris-vert p-4 text-3xl font-semibold leading-[0.95] tracking-[-0.03em]">{premier.nom}</span>
      ),
    },
    {
      titre: "Votre panier se remplit",
      texte: "Plusieurs articles, plusieurs tailles : tout part en une seule commande, le total se calcule tout seul.",
      hauteur: "h-[46vw] max-h-[420px] min-[900px]:h-[44vh]",
      image: (
        <div className="flex h-full flex-col justify-end gap-3 bg-fa-sable p-4">
          {exemples.map((p) => (
            <div key={p.id} className="flex items-baseline justify-between gap-3 text-[15px]">
              <span className="line-clamp-1">1 × {p.nom}</span>
              <span className="shrink-0 tabular-nums">{prixCourt(prixAffiche(p))}</span>
            </div>
          ))}
          <div className="flex items-baseline justify-between bg-fa-papier p-3 font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{prixCourt(total)}</span>
          </div>
        </div>
      ),
    },
    {
      titre: "Le message part sur WhatsApp",
      texte: `Votre commande arrive chez ${boutique.nom}, déjà écrite. La boutique vous répond pour le paiement et la livraison.`,
      hauteur: "h-[62vw] max-h-[560px] min-[900px]:h-[60vh]",
      image: (
        <div className="flex h-full flex-col justify-end bg-fa-mur p-4">
          <p className="ml-auto max-w-[92%] whitespace-pre-line bg-fa-bulle p-3 text-[15px] leading-snug text-fa-encre">
            {`Bonjour ${boutique.nom}, je souhaite commander :\n${exemples.map((p) => `• 1 × ${p.nom}`).join("\n")}\nTotal : ${prixCourt(total)}`}
          </p>
        </div>
      ),
    },
  ];

  return (
    <section aria-labelledby="etapes-titre" className="mx-auto w-full max-w-[1600px] px-5 py-[72px] min-[900px]:px-8 min-[900px]:py-[120px]">
      <h2 id="etapes-titre" className="text-[32px] font-semibold leading-none tracking-[-0.035em] min-[900px]:text-[44px]">
        Commander, simplement
      </h2>
      <ol className="mt-7 grid gap-8 min-[900px]:mt-12 min-[900px]:grid-cols-[3fr_4fr_5fr] min-[900px]:items-end min-[900px]:gap-3">
        {etapes.map((e) => (
          <li key={e.titre} className="fa-defile flex flex-col gap-2.5">
            <div aria-hidden className={`w-full overflow-hidden ${e.hauteur}`}>
              {e.image}
            </div>
            <h3 className="mt-1 text-xl font-medium leading-tight tracking-[-0.01em]">{e.titre}</h3>
            <p className="max-w-[44ch] text-base text-fa-encre-douce">{e.texte}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
