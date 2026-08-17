import type { ElementType, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  elevated?: boolean;
  glow?: boolean;
}

export function Card({ children, className = "", as, elevated = false, glow = false }: CardProps) {
  const Tag = (as ?? "div") as ElementType;

  return (
    <Tag
      className={[
        "rounded-lg border border-border/50 bg-surface",
        elevated ? "shadow-md" : "shadow-card",
        glow && "shadow-glow-orange",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
