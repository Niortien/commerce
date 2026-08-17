import type { Metadata } from "next";
import { JetBrains_Mono, Montserrat, Poppins } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const displayFont = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const bodyFont = Poppins({
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
  title: "Dri Valé — Gestion Boutique",
  description: "Gestion de stock et de caisse pour Dri Valé Boutique, Yopougon Abidjan",
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
        <link rel="preconnect" href="https://dri-vale.org" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full bg-base text-text font-[var(--font-body)] flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
