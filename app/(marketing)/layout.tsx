import { Unbounded } from "next/font/google";

// Titres du site de présentation uniquement : la police n'est chargée que sur cette route.
const brandFont = Unbounded({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export default function MarketingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={brandFont.variable}>{children}</div>;
}
