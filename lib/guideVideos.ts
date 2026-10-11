/**
 * Le tutoriel vidéo (motion design, source : `mon-djossi-tuto/`) : la version complète et ses épisodes.
 * Fichiers servis depuis `public/videos/guide/` (MP4 H.264 720×1280 + image d'aperçu JPG).
 * Tourné avec une boutique de vêtements ; les étapes sont les mêmes pour les autres commerces.
 */
export interface VideoGuide {
  id: string;
  titre: string;
  /** Ce qu'on y apprend, en une phrase. */
  resume: string;
  /** Durée affichée, ex. « 0:23 ». */
  duree: string;
  src: string;
  poster: string;
}

const dossier = "/videos/guide";
const video = (id: string, titre: string, resume: string, duree: string): VideoGuide => ({
  id,
  titre,
  resume,
  duree,
  src: `${dossier}/${id}.mp4`,
  poster: `${dossier}/${id}.jpg`,
});

export const VIDEO_COMPLETE = video(
  "tutoriel-complet",
  "Tout le tutoriel",
  "De l'inscription de la boutique au bilan du soir.",
  "2:31"
);

export const EPISODES_VIDEO: VideoGuide[] = [
  video("episode-1", "Inscrire ta boutique", "Type de commerce, formule d'essai et tes informations.", "0:23"),
  video("episode-2", "Préparer la boutique", "« Ma boutique » et les catégories.", "0:20"),
  video("episode-3", "Ajouter tes produits", "Prix, variantes, seuil d'alerte, stock de départ et import Excel.", "0:37"),
  video("episode-4", "Ajouter tes caissiers", "Un accès pour chaque personne au comptoir.", "0:14"),
  video("episode-5", "Ta première vente", "Ouvrir la caisse, vendre, encaisser, imprimer, vendre sans internet.", "0:39"),
  video("episode-6", "Fermer la journée", "Le total de la caisse et le Dashboard.", "0:21"),
];
