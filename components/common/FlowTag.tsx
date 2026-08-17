import { Chip } from "@heroui/react";

type FlowTagType = "entree" | "sortie" | "ajustement" | "retour" | "vente";

interface FlowTagProps {
  type: FlowTagType;
}

const STYLE_BY_TYPE: Record<FlowTagType, string> = {
  entree: "bg-[var(--color-in-dim)] text-in",
  sortie: "bg-[var(--color-out-dim)] text-out",
  ajustement: "bg-[var(--color-surface-high)] text-[var(--color-text-muted)]",
  retour: "bg-[var(--color-return-dim)] text-return",
  vente: "bg-[color:rgba(167,139,250,0.18)] text-cash",
};

export function FlowTag({ type }: FlowTagProps) {
  return (
    <Chip radius="sm" variant="flat" classNames={{ base: STYLE_BY_TYPE[type] }}>
      {type.toUpperCase()}
    </Chip>
  );
}
