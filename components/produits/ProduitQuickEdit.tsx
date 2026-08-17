"use client";

import { Input } from "@heroui/react";

interface ProduitQuickEditProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProduitQuickEdit({ value, onChange }: ProduitQuickEditProps) {
  return <Input value={value} onValueChange={onChange} variant="underlined" aria-label="Edition rapide" />;
}
