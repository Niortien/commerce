import Link from "next/link";
import { lienMonDjossi } from "@/lib/vitrine";

/** Une seule ligne calme pour finir. La mention Mon Djossi fait connaître l'outil aux autres commerçants. */
export function VitrineFooter({ slug, boutiqueNom }: { slug: string; boutiqueNom: string }) {
  return (
    <footer className="mx-auto grid w-full max-w-[1600px] gap-2 px-5 pb-28 pt-[20svh] text-sm sm:grid-cols-[1fr_auto_1fr] sm:items-baseline sm:gap-6 sm:px-8 sm:pb-8 sm:pt-[24svh]">
      <p className="text-text-muted">Vitrine de {boutiqueNom}</p>
      <p className="text-text-muted">
        <a href="#articles" className="text-text underline-offset-4 hover:underline">
          Voir les articles
        </a>
      </p>
      <p className="text-text-muted sm:text-right">
        {new Date().getFullYear()} · Propulsée par{" "}
        <Link href={lienMonDjossi(slug)} className="font-medium text-text underline-offset-4 hover:underline">
          Mon Djossi
        </Link>
        , la caisse et la vitrine des commerçants
      </p>
    </footer>
  );
}
