import { EmptyRiver } from "@/components/common/EmptyRiver";
import { Timeline } from "@/components/common/Timeline";
import type { StockItem } from "@/types";
import { StockFlowRow } from "./StockFlowRow";

interface StockTimelineProps {
  items: StockItem[];
  density?: "compact" | "cozy";
}

export function StockTimeline({ items, density = "cozy" }: StockTimelineProps) {
  if (!items.length) {
    return <EmptyRiver message="Aucun article en stock" cta="Ajouter via Ctrl+K" />;
  }

  return (
    <Timeline density={density}>
      {items.map((item) => (
        <StockFlowRow key={item.id} item={item} />
      ))}
    </Timeline>
  );
}
