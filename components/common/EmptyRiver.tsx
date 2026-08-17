import { Button } from "@heroui/react";

interface EmptyRiverProps {
  message: string;
  cta?: string;
}

export function EmptyRiver({ message, cta }: EmptyRiverProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface p-8 text-center">
      <p className="text-sm text-text-muted">{message}</p>
      {cta ? (
        <Button variant="light" className="mt-3 text-accent">
          {cta}
        </Button>
      ) : null}
    </div>
  );
}
