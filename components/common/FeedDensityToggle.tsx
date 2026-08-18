"use client";

import { Button } from "@heroui/react";
import { useUiStore } from "@/stores/uiStore";

export function FeedDensityToggle() {
  const density = useUiStore((state) => state.feedDensity);
  const setDensity = useUiStore((state) => state.setFeedDensity);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-[0.08em] text-text-muted">Densite</span>
      <Button
        size="sm"
        variant={density === "compact" ? "solid" : "flat"}
        className={density === "compact" ? "bg-accent text-black" : "bg-[var(--color-surface-high)] text-text"}
        onPress={() => setDensity("compact")}
      >
        Compact
      </Button>
      <Button
        size="sm"
        variant={density === "cozy" ? "solid" : "flat"}
        className={density === "cozy" ? "bg-accent text-black" : "bg-[var(--color-surface-high)] text-text"}
        onPress={() => setDensity("cozy")}
      >
        Cozy
      </Button>
    </div>
  );
}
