import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/providers";
import { ThemeInit } from "@/components/common/ThemeInit";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
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
const displayFont = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
    default: "Mon Djossi — Logiciel de gestion de boutiques : stock et caisse",
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
    title: "Mon Djossi — Gérez vos boutiques : stock, caisse, abonnements",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mon Djossi — Gérez vos boutiques : stock, caisse, abonnements",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
