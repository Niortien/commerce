import Link from "next/link";
import { BrandMark } from "@/components/common/BrandMark";

// Ancres préfixées par « / » : elles mènent aussi à l'accueil depuis les pages de guides.
const LINKS = [
  { href: "/#fonctionnalites", label: "Fonctionnalités" },
  { href: "/#metiers", label: "Métiers" },
  { href: "/#plans", label: "Abonnements" },
  { href: "/guides", label: "Guides" },
  { href: "/login", label: "Connexion" },
  { href: "/inscription", label: "Inscription" },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-base">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <BrandMark />
          <p className="mt-2 max-w-xs text-sm text-text-muted">Caisse, stock et gestion pour les commerces de Côte d&apos;Ivoire.</p>
        </div>
        <nav aria-label="Pied de page" className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((l) => {
            const className = "cursor-pointer text-sm font-medium text-text-muted transition-colors duration-150 hover:text-text";
            return l.href.startsWith("/#") ? (
              <a key={l.href} href={l.href} className={className}>
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className={className}>
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <p className="border-t border-border px-4 py-4 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} Mon Djossi
      </p>
    </footer>
  );
}
