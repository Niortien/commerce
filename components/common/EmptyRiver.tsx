import type { ReactNode } from "react";
import { IconInbox } from "@tabler/icons-react";

interface EmptyRiverProps {
  message: string;
  /** Texte d'aide sous le message. */
  hint?: string;
  /** Action concrète (bouton ou lien) à proposer. */
  action?: ReactNode;
}

export function EmptyRiver({ message, hint, action }: EmptyRiverProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-high text-text-muted">
        <IconInbox size={24} aria-hidden />
      </span>
      <div>
        <p className="text-sm font-semibold text-text">{message}</p>
        {hint && <p className="mt-1 text-sm text-text-muted">{hint}</p>}
      </div>
      {action}
    </div>
  );
}
