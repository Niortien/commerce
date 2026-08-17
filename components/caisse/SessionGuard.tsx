"use client";

import { Button, Spinner } from "@heroui/react";
import { useActiveSession } from "@/features/caisse/query/caisse-queries";
import { useOuvrirSession } from "@/features/caisse/mutation/caisse-mutations";

interface SessionGuardProps {
  children: React.ReactNode;
}

export function SessionGuard({ children }: SessionGuardProps) {
  const { data, isLoading } = useActiveSession();
  const openMutation = useOuvrirSession();
  const activeSession = data?.data ?? null;

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center gap-3">
        <Spinner color="warning" size="sm" />
        <p className="text-sm text-text-muted">Chargement de la caisse…</p>
      </div>
    );
  }

  if (!activeSession) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-in/30 bg-[color:rgba(57,211,83,0.06)] py-8 px-4 text-center sm:py-12 sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:rgba(57,211,83,0.12)] text-3xl">
          ☀️
        </div>
        <div>
          <p className="font-[var(--font-display)] text-xl text-text">Prêt pour la journée ?</p>
          <p className="mt-1 text-sm text-text-muted">Aucune session caisse n&apos;est ouverte</p>
        </div>
        <Button
          size="lg"
          className="w-full max-w-xs bg-in font-semibold text-black"
          isLoading={openMutation.isPending}
          onPress={() => openMutation.mutate({ montantOuverture: "0" })}
        >
          Commencer la journée
        </Button>
        {openMutation.isError && (
          <p className="text-xs text-out">Impossible d&apos;ouvrir la caisse. Vérifie ta connexion.</p>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
