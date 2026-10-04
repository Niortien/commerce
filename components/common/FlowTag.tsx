import { Chip } from "@heroui/react";

type FlowTagType = "entree" | "sortie" | "ajustement" | "retour" | "vente";

interface FlowTagProps {
  type: FlowTagType;
}

const STYLE_BY_TYPE: Record<FlowTagType, string> = {
  entree: "bg-in-dim text-in-text",
  sortie: "bg-out-dim text-out-text",
  ajustement: "bg-surface-high text-text-muted",
  retour: "bg-return-dim text-return-text",
  vente: "bg-cash-dim text-cash-text",
};

export function FlowTag({ type }: FlowTagProps) {
  return (
    <Chip radius="sm" variant="flat" classNames={{ base: STYLE_BY_TYPE[type] }}>
      {type.toUpperCase()}
    </Chip>
  );
}
