"use client";

import { Button, Spinner } from "@heroui/react";
import { IconSunHigh } from "@tabler/icons-react";
import { PageHero } from "@/components/common/PageHero";
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
      <div role="status" className="flex h-32 items-center justify-center gap-3">
        <Spinner color="primary" size="sm" />
        <p className="text-sm text-text-muted">Chargement de la caisse…</p>
      </div>
    );
  }

  if (!activeSession) {
    return (
      <PageHero
        tone="in"
        icon={IconSunHigh}
        eyebrow="Caisse fermée"
        title="Prêt pour la journée ?"
        description="Aucune session de caisse n'est ouverte. Ouvrez-la pour enregistrer les ventes de l'équipe."
        actions={
          <Button
            size="lg"
            className="bg-in font-semibold text-white"
            isLoading={openMutation.isPending}
            onPress={() => openMutation.mutate({ montantOuverture: "0" })}
          >
            Commencer la journée
          </Button>
        }
      >
        {openMutation.isError && (
          <p role="alert" className="text-sm text-out-text">
            Impossible d&apos;ouvrir la caisse. Vérifiez votre connexion puis réessayez.
          </p>
        )}
      </PageHero>
    );
  }

  return <>{children}</>;
}
