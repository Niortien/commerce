import Link from "next/link";
import { getCommerceProfile } from "@/lib/commerce";
import { articles, lienContact, lienMonDjossi } from "@/lib/vitrine";
import type { VitrineBoutique } from "@/types";

/** Le nom tient en deux lignes dans sa tuile : plus il est long, plus il est composé petit. */
function tailleDuNom(nom: string): string {
  if (nom.length <= 14) return "text-[min(15vw,132px)] min-[900px]:text-[min(8vw,132px)]";
  if (nom.length <= 24) return "text-[min(10vw,80px)] min-[900px]:text-[min(5.5vw,80px)]";
  return "text-[min(8vw,56px)] min-[900px]:text-[min(4vw,56px)]";
}

/**
 * Le pied de vitrine, en tuiles : le nom de la boutique en grand, la tuile verte pour écrire
 * sur WhatsApp, le retour aux articles et la mention « Vitrine propulsée par Mon Djossi ».
 */
export function VitrineFooter({ boutique, nombreProduits }: { boutique: VitrineBoutique; nombreProduits: number }) {
  const profil = boutique.typeCommerce ? getCommerceProfile(boutique.typeCommerce) : null;
  const quoi = [profil?.label, boutique.ville ? `à ${boutique.ville}` : null].filter(Boolean).join(" ");

  return (
    <footer className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-2 p-2 min-[900px]:grid-cols-12">
      <div
        className={`flex min-h-[220px] flex-col justify-between gap-6 bg-fa-encre p-5 text-fa-sol min-[900px]:min-h-[300px] min-[900px]:p-6 ${
          boutique.whatsapp ? "min-[900px]:col-span-8" : "min-[900px]:col-span-12"
        }`}
      >
        <p className={`font-semibold leading-[0.9] tracking-[-0.045em] [overflow-wrap:anywhere] ${tailleDuNom(boutique.nom)}`}>{boutique.nom}</p>
        {quoi ? <p className="text-base">{quoi}</p> : null}
      </div>

      {boutique.whatsapp ? (
        <a
          href={lienContact(boutique.whatsapp, boutique.nom)}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-h-[160px] flex-col justify-between gap-6 bg-fa-action p-5 text-fa-sur-action min-[900px]:col-span-4 min-[900px]:min-h-[300px] min-[900px]:p-6"
        >
          <span className="text-[28px] font-semibold leading-tight tracking-[-0.025em]">Écrire à la boutique sur WhatsApp</span>
          <svg
            viewBox="0 0 36 36"
            width={36}
            height={36}
            fill="none"
            stroke="currentColor"
            strokeWidth={4}
            strokeLinecap="square"
            aria-hidden
            className="self-end transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          >
            <path d="M6 18h22M20 9l9 9-9 9" />
          </svg>
        </a>
      ) : null}

      {nombreProduits > 0 ? (
        <a
          href="#articles"
          className="flex min-h-[120px] flex-col justify-between gap-4 bg-fa-papier p-5 min-[900px]:col-span-6 min-[900px]:min-h-[180px] min-[900px]:p-6"
        >
          <span className="text-[22px] font-semibold tracking-[-0.02em]">Revoir les {articles(nombreProduits)}</span>
          <span className="text-sm text-fa-encre-douce">Retour au catalogue</span>
        </a>
      ) : null}

      <div
        className={`flex min-h-[120px] flex-col justify-between gap-4 bg-fa-papier p-5 min-[900px]:min-h-[180px] min-[900px]:p-6 ${
          nombreProduits > 0 ? "min-[900px]:col-span-6" : "min-[900px]:col-span-12"
        }`}
      >
        <p className="text-base">
          Vitrine propulsée par{" "}
          <Link href={lienMonDjossi(boutique.slug)} className="font-semibold underline underline-offset-4">
            Mon Djossi
          </Link>
        </p>
        <p className="text-sm text-fa-encre-douce">La caisse et la vitrine des commerçants · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
