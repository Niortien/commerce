export interface PageMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  pageCount?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: PageMeta;
  timestamp: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface AppError {
  code: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface Boutique {
  id: string;
  nom: string;
  adresse: string | null;
  ville: string | null;
  whatsapp: string | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}
