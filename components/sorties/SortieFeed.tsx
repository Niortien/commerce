import { Timeline } from "@/components/common/Timeline";
import type { Sortie } from "@/types";
import { SortieFeedItem } from "./SortieFeedItem";

interface SortieFeedProps {
  items: Sortie[];
  density?: "compact" | "cozy";
  onCancel: (id: string) => void;
}

export function SortieFeed({ items, density = "cozy", onCancel }: SortieFeedProps) {
  return (
    <Timeline density={density}>
      {items.map((sortie) => (
        <SortieFeedItem key={sortie.id} sortie={sortie} onCancel={onCancel} />
      ))}
    </Timeline>
  );
}
