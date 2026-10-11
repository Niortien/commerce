import type { MetadataRoute } from "next";

/** Permet d'installer Mon Djossi sur l'écran d'accueil du téléphone, comme une application. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mon Djossi — stock et caisse",
    short_name: "Mon Djossi",
    description: "Stock, caisse et ventes de ta boutique, même sans internet.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#0B1220",
    theme_color: "#0B1220",
    lang: "fr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
