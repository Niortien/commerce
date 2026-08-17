import { Chip } from "@heroui/react";

interface StockBadgeProps {
  value: number;
  isAlert?: boolean;
}

export function StockBadge({ value, isAlert = false }: StockBadgeProps) {
  return (
    <Chip
      radius="full"
      variant="flat"
      classNames={{
        base: isAlert ? "bg-[var(--color-out-dim)] text-out" : "bg-[var(--color-surface-high)] text-text",
      }}
    >
      {value}
    </Chip>
  );
}
