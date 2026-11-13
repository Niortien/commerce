import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/providers";
import { ThemeInit } from "@/components/common/ThemeInit";
import { ServiceWorkerInit } from "@/components/common/ServiceWorkerInit";
import { WebVitalsReporter } from "@/components/common/WebVitalsReporter";
import { SITE_DESCRIPTION, SITE_NAME, SITE_SOCIAL_TITLE, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

// Applique le thème persisté avant le premier paint pour éviter un flash

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var raw = localStorage.getItem('backoffice-theme');
    var preference = raw ? JSON.parse(raw).state.theme : 'system';
    // « system » (par défaut) suit le réglage clair/sombre de l'appareil.
    var theme = preference === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : preference;
    if (theme === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

// ERP + site de présentation : Plus Jakarta Sans (titres), Inter (corps), JetBrains Mono (données).
// Polices auto-hébergées (fichiers variables latins, licence OFL) : le build ne dépend plus de Google Fonts.
const displayFont = localFont({
  variable: "--font-display",
  display: "swap",
  src: [{ path: "./fonts/plus-jakarta-sans-latin.woff2", weight: "500 800", style: "normal" }],
});

const bodyFont = localFont({
  variable: "--font-body",
  display: "swap",
  src: [{ path: "./fonts/inter-latin.woff2", weight: "400 600", style: "normal" }],
});

// Données uniquement : pas préchargée, elle n'est téléchargée que sur les pages qui l'affichent.
const monoFont = localFont({
  variable: "--font-mono",
  display: "swap",
  preload: false,
  src: [{ path: "./fonts/jetbrains-mono-latin.woff2", weight: "400 500", style: "normal" }],
});

// Couleur de la barre du navigateur mobile, selon le thème de l'appareil.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F6FB" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1220" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Mon Djossi",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_SOCIAL_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_SOCIAL_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      // Le script de thème change la classe avant l'hydratation.
      suppressHydrationWarning
      lang="fr"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased light`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full bg-base text-text font-body flex flex-col">
        <ThemeInit />
        <ServiceWorkerInit />
        <WebVitalsReporter />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
