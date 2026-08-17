export type LookbookPhotoStatut = "nouveau" | "vu" | "traite";

export interface LookbookPhoto {
  id: string;
  url: string;
  nom: string | null;
  telephone: string | null;
  message: string | null;
  statut: LookbookPhotoStatut;
  publiee: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicLookbookPhoto {
  id: string;
  url: string;
  nom: string | null;
  createdAt: string;
}
