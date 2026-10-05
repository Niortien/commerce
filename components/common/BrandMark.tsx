import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  /** `full` = chariot + « Mon Djossi » + signature ; `icon` = chariot seul. */
  variant?: "full" | "icon";
  /**
   * `true` force la variante claire (fond toujours sombre : barre latérale bleu nuit).
   * Omis : le logo suit le thème de la page (couleur en clair, variante claire en sombre).
   */
  onDark?: boolean;
  /** Hauteur Tailwind du logo (le ratio est conservé). */
  className?: string;
  priority?: boolean;
}

// Dimensions réelles des fichiers de `public/images/mon-djossi/` (ratio conservé par `w-auto`).
const FULL = { w: 1664, h: 413 };
const ICON = { w: 525, h: 525 };
const ALT = "Mon Djossi — Gérez, vendez, développez";

/** Logo Mon Djossi (assets officiels, fond transparent). */
export function BrandMark({ variant = "full", onDark, className, priority = false }: BrandMarkProps) {
  const isIcon = variant === "icon";
  const dims = isIcon ? ICON : FULL;
  // object-contain object-left : même étiré par un parent flex en colonne, le logo garde ses proportions.
  const size = cn("w-auto max-w-full select-none object-contain object-left", isIcon ? "h-9" : "h-10", className);
  const common = { width: dims.w, height: dims.h, priority };

  if (isIcon) {
    return <Image src="/images/mon-djossi/logo-icone.png" alt={ALT} {...common} className={size} />;
  }

  if (onDark) {
    return <Image src="/images/mon-djossi/logo-clair.png" alt={ALT} {...common} className={size} />;
  }

  // Thème suivi par CSS (classe `dark` sur <html>) : une seule image visible, l'autre est masquée et ignorée des lecteurs d'écran.
  return (
    <>
      <Image src="/images/mon-djossi/logo-couleur.png" alt={ALT} {...common} className={cn(size, "dark:hidden")} />
      <Image
        src="/images/mon-djossi/logo-clair.png"
        alt={ALT}
        {...common}
        priority={false}
        className={cn(size, "hidden dark:block")}
      />
    </>
  );
}
