"use client";

import { useId } from "react";
import { Input } from "@heroui/react";
import { IconBike, IconPaperBag, IconToolsKitchen2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ModeService } from "@/types";

const OPTIONS = [
  { mode: ModeService.SUR_PLACE, label: "Sur place", icon: IconToolsKitchen2 },
  { mode: ModeService.A_EMPORTER, label: "À emporter", icon: IconPaperBag },
  { mode: ModeService.LIVRAISON, label: "Livraison", icon: IconBike },
] as const;

interface ModeServicePickerProps {
  mode: ModeService;
  table: string;
  onModeChange: (mode: ModeService) => void;
  onTableChange: (table: string) => void;
}

/** Restaurant : comment la commande est servie, et à quelle table quand c'est sur place. */
export function ModeServicePicker({ mode, table, onModeChange, onTableChange }: ModeServicePickerProps) {
  const labelId = useId();

  return (
    <div className="space-y-2">
      <p id={labelId} className="text-xs font-medium text-text-muted">
        Service
      </p>
      <div role="radiogroup" aria-labelledby={labelId} className="grid grid-cols-3 gap-2">
        {OPTIONS.map(({ mode: m, label, icon: Icon }) => {
          const selected = m === mode;
          return (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onModeChange(m)}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2 text-sm font-medium transition-colors duration-150",
                selected
                  ? "border-[color:var(--sector-restaurant)] bg-[color:color-mix(in_srgb,var(--sector-restaurant)_14%,transparent)] text-text"
                  : "border-border text-text-muted hover:text-text"
              )}
            >
              <Icon size={16} aria-hidden />
              {label}
            </button>
          );
        })}
      </div>
      {mode === ModeService.SUR_PLACE && (
        <Input
          size="sm"
          variant="bordered"
          label="Table"
          placeholder="Ex. Table 4, Terrasse"
          maxLength={30}
          value={table}
          onValueChange={onTableChange}
        />
      )}
    </div>
  );
}
