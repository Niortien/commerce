import axios from "axios";
import type { Produit, Categorie, LookbookPhoto, PublicLookbookPhoto } from "@/types";

function getBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  const url = raw && raw.length > 0 ? raw.replace(/\/$/, "") : "http://localhost:8013";
  return /\/api\/v1$/i.test(url) ? url.replace(/\/api\/v1$/i, "") : url;
}

// Axios public — aucun intercepteur auth (routes marquées @Public() côté backend)
const publicApi = axios.create({
  baseURL: `${getBaseUrl()}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

export interface VitrineProduitParams {
  page?: number;
  limit?: number;
  categorieId?: string;
  search?: string;
  enPromo?: boolean;
}

// Forme réelle de l'enveloppe backend (TransformInterceptor)
export interface VitrinePageResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
  };
  timestamp: string;
}

export interface VitrineSingleResponse<T> {
  data: T;
  meta: null;
  timestamp: string;
}

export const getVitrineProduits = (
  params: VitrineProduitParams = {}
): Promise<VitrinePageResponse<Produit>> =>
  publicApi
    .get<VitrinePageResponse<Produit>>("/produits", {
      params: { ...params, isActif: true },
    })
    .then((r) => r.data);

export const getVitrineProduit = (id: string): Promise<VitrineSingleResponse<Produit>> =>
  publicApi.get<VitrineSingleResponse<Produit>>(`/produits/${id}`).then((r) => r.data);

export const getVitrineCategories = (): Promise<VitrineSingleResponse<Categorie[]>> =>
  publicApi.get<VitrineSingleResponse<Categorie[]>>("/produits/categories").then((r) => r.data);

export interface UploadLookbookPhotoBody {
  photo: string; // data URL base64
  nom?: string;
  telephone?: string;
  message?: string;
}

export const uploadLookbookPhoto = (
  body: UploadLookbookPhotoBody
): Promise<VitrineSingleResponse<LookbookPhoto>> =>
  publicApi
    .post<VitrineSingleResponse<LookbookPhoto>>("/lookbook-photos", body)
    .then((r) => r.data);

export const getPublicLookbookPhotos = (): Promise<VitrineSingleResponse<PublicLookbookPhoto[]>> =>
  publicApi
    .get<VitrineSingleResponse<PublicLookbookPhoto[]>>("/lookbook-photos/publiees")
    .then((r) => r.data);
