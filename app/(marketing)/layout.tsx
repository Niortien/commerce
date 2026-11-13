import localFont from "next/font/local";

// Titres du site de présentation uniquement : la police n'est chargée que sur cette route.
const brandFont = localFont({
  variable: "--font-brand",
  display: "swap",
  src: [{ path: "../fonts/unbounded-latin.woff2", weight: "500 700", style: "normal" }],
});

export default function MarketingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={brandFont.variable}>{children}</div>;
}
