import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import type { ApiErrorResponse, ApiResponse, AppError, PageMeta } from "@/types";
import { useAuthStore } from "@/stores/authStore";

function getBaseUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  const url = rawUrl && rawUrl.length > 0 ? rawUrl.replace(/\/$/, "") : "http://localhost:8013";

  return /\/api\/v1$/i.test(url) ? url.replace(/\/api\/v1$/i, "") : url;
}

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

function notifyPendingRequests(token: string | null): void {
  pendingRequests.forEach((callback) => callback(token));
  pendingRequests = [];
}

function toAppError(error: AxiosError<ApiErrorResponse>): AppError {
  if (!error.response) {
    const isTimeout = error.code === "ECONNABORTED";
    return {
      code: 503,
      message: isTimeout
        ? "Le serveur met trop de temps à répondre. Réessaie dans quelques secondes."
        : "Connexion impossible. Vérifie ta connexion internet.",
      details: undefined,
    };
  }

  const payload = error.response.data as
    | (ApiErrorResponse & { error?: { code?: string; message?: string | string[]; details?: Record<string, unknown> } })
    | undefined;
  const statusCode = payload?.statusCode ?? error.response.status;
  const rawMessage = payload?.error?.message ?? payload?.message;
  const message = Array.isArray(rawMessage) ? rawMessage.join(" · ") : rawMessage;
  const details = payload?.error?.details ?? payload?.details;

  if (statusCode === 500) {
    return {
      code: 500,
      message: "Erreur serveur. Réessaie dans quelques secondes.",
      details,
    };
  }

  return {
    code: statusCode,
    message: message ?? "Erreur inconnue.",
    details,
  };
}

export const api = axios.create({
  baseURL: `${getBaseUrl()}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const statusCode = error.response?.status;

    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push((token) => {
            if (!token) {
              reject(error);
              return;
            }

            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          throw error;
        }

        const refreshResponse = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${getBaseUrl()}/api/v1/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = refreshResponse.data.data.accessToken;
        useAuthStore.getState().setTokens(newAccessToken, refreshToken);
        notifyPendingRequests(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        notifyPendingRequests(null);
        useAuthStore.getState().clearAuth();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(toAppError(error));
  }
);

function unwrapResponse<T>(response: ApiResponse<T>): { data: T; meta: PageMeta } {
  const meta = (response.meta ?? {}) as PageMeta;

  return {
    data: response.data,
    meta: {
      ...meta,
      pageCount: meta.pageCount ?? meta.totalPages,
    },
  };
}

export async function apiGet<T, P extends object = Record<string, unknown>>(
  url: string,
  params?: P
): Promise<{ data: T; meta: PageMeta }> {
  const response = await api.get<ApiResponse<T>>(url, { params: params as Record<string, unknown> | undefined });
  return unwrapResponse(response.data);
}

export async function apiPost<T, B extends object = Record<string, unknown>>(
  url: string,
  body: B,
  params?: Record<string, unknown>
): Promise<{ data: T; meta: PageMeta }> {
  const response = await api.post<ApiResponse<T>>(url, body, { params });
  return unwrapResponse(response.data);
}

export async function apiPatch<T, B extends object = Record<string, unknown>>(
  url: string,
  body: B,
  params?: Record<string, unknown>
): Promise<{ data: T; meta: PageMeta }> {
  const response = await api.patch<ApiResponse<T>>(url, body, { params });
  return unwrapResponse(response.data);
}

export async function apiDelete<T>(url: string): Promise<{ data: T; meta: PageMeta }> {
  const response = await api.delete<ApiResponse<T>>(url);
  return unwrapResponse(response.data);
}
