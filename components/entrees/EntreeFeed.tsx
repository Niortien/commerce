import { Timeline } from "@/components/common/Timeline";
import type { Entree } from "@/types";
import { EntreeFeedItem } from "./EntreeFeedItem";

interface EntreeFeedProps {
  items: Entree[];
  onCancel: (id: string) => void;
  density?: "compact" | "cozy";
}

export function EntreeFeed({ items, onCancel, density = "cozy" }: EntreeFeedProps) {
  return (
    <Timeline density={density}>
      {items.map((entree) => (
        <EntreeFeedItem key={entree.id} entree={entree} onCancel={onCancel} />
      ))}
    </Timeline>
  );
}
