/**
 * Classes partagées des boutons de la vitrine (design system « Façade ») : angles droits,
 * 52px de haut, un léger enfoncement à l'appui. À poser sur un `Button` HeroUI en `radius="none"`.
 *
 * - `action` : la seule action qui fait avancer la commande sur l'écran (vert).
 * - `calme` : fermer, filtrer, voir plus.
 * - `surMur` : posé sur le mur de couleur de la boutique.
 */
const BASE =
  "h-[52px] min-w-0 gap-2.5 px-5 text-base font-medium tracking-[-0.005em] transition-transform duration-[120ms] data-[pressed=true]:scale-[0.97]";

export const boutonFacade = {
  action: `${BASE} bg-fa-action text-fa-sur-action data-[hover=true]:bg-fa-action-appui data-[hover=true]:opacity-100`,
  calme: `${BASE} bg-fa-sol-pas text-fa-encre data-[hover=true]:opacity-100`,
  surMur: `${BASE} bg-fa-sur-mur text-fa-mur data-[hover=true]:opacity-90`,
} as const;

/** Marges de page : 20px sur téléphone, 32px à partir de 900px. */
export const MARGE = "px-5 min-[900px]:px-8";

/** Largeur maximale du contenu de la vitrine. */
export const LARGEUR = "mx-auto w-full max-w-[1600px]";
