"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { IconArrowBackUp, IconEye } from "@tabler/icons-react";
import { useConsultation } from "@/hooks/useConsultation";
import { useAuthStore } from "@/stores/authStore";
import { Role } from "@/types";

/** Minutes restantes avant la fin du jeton de consultation. */
function minutesRestantes(expireA: number): number {
  return Math.max(0, Math.ceil((expireA - Date.now()) / 60_000));
}

/**
 * Rappel permanent quand le Super Admin regarde l'espace d'un admin ou d'un caissier :
 * quel compte, en lecture seule, combien de temps il reste, et le retour à son propre espace.
 */
export function ConsultationBanner() {
  const consultation = useAuthStore((s) => s.consultation);
  const user = useAuthStore((s) => s.user);
  const { quitter } = useConsultation();
  const [minutes, setMinutes] = useState(() => (consultation ? minutesRestantes(consultation.expireA) : 0));

  useEffect(() => {
    if (!consultation) return;
    setMinutes(minutesRestantes(consultation.expireA));
    const minuterie = setInterval(() => setMinutes(minutesRestantes(consultation.expireA)), 30_000);
    return () => clearInterval(minuterie);
  }, [consultation]);

  if (!consultation || !user) return null;

  const role = user.role === Role.ADMIN ? "admin" : "caissier";

  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-return-line bg-return-dim px-4 py-2 text-sm text-return-text"
    >
      <IconEye size={18} aria-hidden className="shrink-0" />
      <p className="min-w-0 flex-1">
        <span className="font-semibold">Consultation</span> de l&apos;espace {role} de {user.email}
        {user.boutiqueName && <> · {user.boutiqueName}</>} — lecture seule, encore {minutes} min
      </p>
      <Button
        size="sm"
        className="min-h-9 bg-return font-semibold text-white"
        startContent={<IconArrowBackUp size={16} aria-hidden />}
        onPress={quitter}
      >
        Revenir au Super Admin
      </Button>
    </div>
  );
}
