import type { Metadata } from "next";
import { JetBrains_Mono, Playfair_Display, Inter } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Luxury Boutique — Gestion Boutique",
  description: "Gestion de stock et de caisse pour Luxury Boutique, Marcory Abidjan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-full bg-base text-text font-[var(--font-body)] flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
