"use client";

import { Chip } from "@heroui/react";

interface SortieStatChipsProps {
  selected: "7j" | "30j" | "90j";
  onSelect: (value: "7j" | "30j" | "90j") => void;
}

export function SortieStatChips({ selected, onSelect }: SortieStatChipsProps) {
  const periods: Array<"7j" | "30j" | "90j"> = ["7j", "30j", "90j"];

  return (
    <div className="flex gap-2">
      {periods.map((period) => (
        <Chip
          key={period}
          variant="flat"
          className={period === selected ? "bg-accent text-black" : "bg-[var(--color-surface-high)]"}
          onClick={() => onSelect(period)}
        >
          {period}
        </Chip>
      ))}
    </div>
  );
}
