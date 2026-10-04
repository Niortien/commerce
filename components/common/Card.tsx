import type { ElementType, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  /** Élévation réservée aux surfaces flottantes (menus, panneaux). */
  elevated?: boolean;
  /** Conservé pour compatibilité : le design system Mon Djossi (flat) n'utilise plus de glow. */
  glow?: boolean;
}

export function Card({ children, className = "", as, elevated = false }: CardProps) {
  const Tag = (as ?? "div") as ElementType;

  return (
    <Tag
      className={["rounded-lg border border-border bg-surface", elevated ? "shadow-md" : "shadow-card", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
