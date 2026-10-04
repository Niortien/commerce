import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Actions principales alignées à droite (empilées sous le titre en mobile). */
  actions?: ReactNode;
  /** Petit libellé au-dessus du titre (ex. section ou date). */
  eyebrow?: ReactNode;
}

export function PageHeader({ title, description, actions, eyebrow }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-text">{eyebrow}</p>}
        <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-text md:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
