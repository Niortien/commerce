import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  /** `onDark` pour les sections bleu nuit. */
  onDark?: boolean;
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, onDark = false, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className={cn("mk-eyebrow", onDark && "mk-eyebrow-dark")}>{eyebrow}</p>
      <h2
        className={cn(
          "mt-3.5 font-brand text-[1.6rem] font-semibold leading-[1.15] tracking-[-0.035em] md:text-[2.1rem] lg:text-[2.6rem]",
          onDark ? "text-white" : "text-text"
        )}
        style={{ textWrap: "balance" }}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 max-w-2xl text-md leading-relaxed md:text-lg", onDark ? "text-[#B6C3D8]" : "text-text-muted")}>
          {description}
        </p>
      )}
    </div>
  );
}
