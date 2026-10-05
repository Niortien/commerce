import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Seules la présentation et l'inscription sont à référencer : l'application elle-même reste privée.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/inscription"],
        disallow: [
          "/api/",
          "/login",
          "/forgot-password",
          "/reset-password",
          "/dashboard",
          "/activite",
          "/caisse",
          "/stock",
          "/entrees",
          "/sorties",
          "/produits",
          "/promotions",
          "/admin",
          "/super-admin",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
