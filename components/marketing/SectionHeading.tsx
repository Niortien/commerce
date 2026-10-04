import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  /** `onDark` pour la section bleu nuit. */
  onDark?: boolean;
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, onDark = false, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className={cn("text-xs font-semibold uppercase tracking-wider", onDark ? "text-sidebar-accent" : "text-accent-text")}>
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl",
          onDark ? "text-sidebar-text" : "text-text"
        )}
        style={{ textWrap: "balance" }}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-3 text-md leading-relaxed md:text-lg", onDark ? "text-sidebar-muted" : "text-text-muted")}>
          {description}
        </p>
      )}
    </div>
  );
}
