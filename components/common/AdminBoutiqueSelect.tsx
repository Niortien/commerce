"use client";

import { Select, SelectItem } from "@heroui/react";
import { useAdminStore } from "@/stores/adminStore";
import { useBoutiques } from "@/features/boutiques/query/boutiques-queries";

export function AdminBoutiqueSelect() {
  const { currentBoutiqueId, setCurrentBoutique } = useAdminStore();
  const { data: boutiquesRes } = useBoutiques();
  const boutiques = boutiquesRes?.data ?? [];

  const items = [
    { key: "all", label: "Toutes les boutiques" },
    ...boutiques.map((b) => ({
      key: b.id,
      label: b.nom + (b.ville ? ` · ${b.ville}` : ""),
    })),
  ];

  return (
    <Select
      size="sm"
      label="Boutique active"
      items={items}
      selectedKeys={new Set([currentBoutiqueId])}
      onSelectionChange={(keys) => {
        const val = Array.from(keys)[0] as string | undefined;
        setCurrentBoutique(val ?? "all");
      }}
      classNames={{
        trigger: "bg-surface/60 border border-border",
        value: "text-text text-sm font-semibold",
      }}
      aria-label="Sélectionner une boutique"
    >
      {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
    </Select>
  );
}
