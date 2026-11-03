/** Racine du serveur d'API (sans « /api/v1 »), utilisable côté serveur comme côté navigateur. */
export function getApiBaseUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  const url = rawUrl && rawUrl.length > 0 ? rawUrl.replace(/\/$/, "") : "http://localhost:8013";

  return /\/api\/v1$/i.test(url) ? url.replace(/\/api\/v1$/i, "") : url;
}
