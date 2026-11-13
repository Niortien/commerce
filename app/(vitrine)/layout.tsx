import localFont from "next/font/local";

// Vitrines publiques uniquement : Switzer (design system « Façade »), auto-hébergée, trois graisses.
const facadeFont = localFont({
  variable: "--font-facade",
  display: "swap",
  src: [
    { path: "./fonts/Switzer-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Switzer-600.woff2", weight: "600", style: "normal" },
  ],
});

export default function VitrineLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={facadeFont.variable}>{children}</div>;
}
