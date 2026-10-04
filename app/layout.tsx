import type { Metadata } from "next";
import { JetBrains_Mono, Playfair_Display, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/providers";
import { ThemeInit } from "@/components/common/ThemeInit";
import "./globals.css";

// Applique le thème persisté avant le premier paint pour éviter un flash
// (le storefront [data-vitrine] a son propre thème indépendant, non concerné).
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var raw = localStorage.getItem('backoffice-theme');
    var theme = raw ? JSON.parse(raw).state.theme : 'light';
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

// Vitrine publique uniquement : le sélecteur [data-vitrine] ré-aiguille --font-display vers cette serif.
const serifFont = Playfair_Display({
  variable: "--font-serif",
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

export const metadata: Metadata = {
  title: "Mon Djossi — Gestion de boutiques par abonnement",
  description:
    "Mon Djossi : stock, caisse, entrées/sorties et vitrine pour vos boutiques, avec un abonnement géré par boutique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${displayFont.variable} ${serifFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased light`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full bg-base text-text font-body flex flex-col">
        <ThemeInit />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
