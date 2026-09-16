"use client";

import { useEffect } from "react";
import { Button, Chip, Input, Skeleton } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMyBoutique } from "@/features/boutiques/query/boutiques-queries";
import { useUpdateMyBoutique } from "@/features/boutiques/mutation/boutiques-mutations";
import { StatutAbonnement, StatutBoutique } from "@/types";

const schema = z.object({
  nom: z.string().min(1, "Requis"),
  ville: z.string().optional(),
  adresse: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  telephone: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const STATUT_LABELS: Record<StatutBoutique, { label: string; color: "success" | "warning" | "danger" | "default" }> = {
  [StatutBoutique.EN_ATTENTE]: { label: "En attente", color: "default" },
  [StatutBoutique.ESSAI]: { label: "Essai gratuit", color: "warning" },
  [StatutBoutique.ACTIF]: { label: "Actif", color: "success" },
  [StatutBoutique.SUSPENDU]: { label: "Suspendu", color: "danger" },
  [StatutBoutique.ARCHIVE]: { label: "Archivé", color: "default" },
};

/**
 * Profil de SA boutique, pour l'ADMIN. La gestion transverse de toutes les
 * boutiques (créer un tenant, changer son abonnement) appartient
 * exclusivement au Super Admin (/super-admin/boutiques).
 */
export function BoutiquesView() {
  const { data: res, isLoading } = useMyBoutique();
  const boutique = res?.data;
  const updateMutation = useUpdateMyBoutique();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (boutique) {
      reset({
        nom: boutique.nom,
        ville: boutique.ville ?? "",
        adresse: boutique.adresse ?? "",
        whatsapp: boutique.whatsapp ?? "",
        email: boutique.email ?? "",
        telephone: boutique.telephone ?? "",
      });
    }
  }, [boutique, reset]);

  const onSubmit = handleSubmit(async (data) => {
    await updateMutation.mutateAsync({
      ...data,
      email: data.email || undefined,
    });
  });

  if (isLoading || !boutique) {
    return (
      <div className="p-6">
        <Skeleton className="mb-4 h-8 w-48 rounded-lg" />
        <Skeleton className="h-64 w-full max-w-xl rounded-lg" />
      </div>
    );
  }

  const statut = STATUT_LABELS[boutique.statut];
  const abonnement = boutique.abonnementActif;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Ma boutique</h1>
        <p className="text-sm text-text-muted">
          Informations de votre boutique et statut de votre abonnement à la plateforme.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <Chip color={statut.color} variant="flat">{statut.label}</Chip>
        {abonnement && (
          <span className="text-sm text-text-muted">
            Plan <strong className="text-text">{abonnement.plan}</strong> — expire le{" "}
            <strong className="text-text">
              {new Date(abonnement.dateFin).toLocaleDateString("fr-FR")}
            </strong>
            {abonnement.statut !== StatutAbonnement.ACTIF && (
              <Chip size="sm" color="danger" variant="flat" className="ml-2">
                {abonnement.statut}
              </Chip>
            )}
          </span>
        )}
        {!abonnement && (
          <span className="text-sm text-text-muted">Aucun abonnement enregistré — contactez le support.</span>
        )}
      </div>

      <form onSubmit={(e) => void onSubmit(e)} className="flex max-w-xl flex-col gap-3 rounded-lg border border-border bg-surface p-4">
        <Input label="Nom de la boutique" variant="bordered" isInvalid={!!errors.nom} errorMessage={errors.nom?.message} {...register("nom")} />
        <Input label="Ville" variant="bordered" {...register("ville")} />
        <Input label="Adresse" variant="bordered" {...register("adresse")} />
        <Input label="WhatsApp" variant="bordered" placeholder="+225 07 00 00 00 00" {...register("whatsapp")} />
        <Input label="Email de contact" variant="bordered" isInvalid={!!errors.email} errorMessage={errors.email?.message} {...register("email")} />
        <Input label="Téléphone" variant="bordered" {...register("telephone")} />
        <Button type="submit" className="mt-2 w-fit bg-accent text-white" isLoading={updateMutation.isPending}>
          Enregistrer
        </Button>
      </form>
    </div>
  );
}
