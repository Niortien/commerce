"use client";

import { SegmentedControl } from "@/components/common/SegmentedControl";
import { useUiStore } from "@/stores/uiStore";

export function FeedDensityToggle() {
  const density = useUiStore((state) => state.feedDensity);
  const setDensity = useUiStore((state) => state.setFeedDensity);

  return (
    <SegmentedControl
      ariaLabel="Densité de l'affichage"
      value={density}
      onChange={setDensity}
      options={[
        { key: "compact", label: "Compact" },
        { key: "cozy", label: "Aéré" },
      ]}
    />
  );
}
