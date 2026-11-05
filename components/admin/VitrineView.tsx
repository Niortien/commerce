"use client";

import { Skeleton } from "@heroui/react";
import { useMyBoutique } from "@/features/boutiques/query/boutiques-queries";
import { VitrineBoutiqueSection } from "./VitrineBoutiqueSection";

/** Page « Vitrine en ligne » de l'ADMIN : publier la page publique de sa boutique et en partager le lien. */
export function VitrineView() {
  const { data: res, isLoading } = useMyBoutique();
  const boutique = res?.data;

  if (isLoading || !boutique) {
    return (
      <div className="p-6">
        <Skeleton className="mb-4 h-8 w-48 rounded-lg" />
        <Skeleton className="h-40 w-full max-w-xl rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Vitrine en ligne</h1>
        <p className="text-sm text-text-muted">
          Votre boutique sur internet : vos clients voient vos articles en stock et commandent sur votre WhatsApp.
        </p>
      </div>
      <VitrineBoutiqueSection boutique={boutique} />
    </div>
  );
}
