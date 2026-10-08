"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { boutiqueSignupSchema, type BoutiqueSignupInput, type SignupPlan } from "@/lib/validators/boutique-signup.schema";
import { PaiementEnAttente } from "@/components/auth/PaiementEnAttente";
import { PlanPicker, isPlanPayant, planName } from "@/components/auth/PlanPicker";
import { prixPlan } from "@/lib/pricing";
import { registerBoutiquePublic } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/stores/authStore";
import type { AppError } from "@/types";
import { Role } from "@/types";

/**
 * Auto-inscription publique. Plan « Essai » : la boutique démarre 14 jours gratuits et atterrit sur son tableau de bord.
 * Plans payants (mensuel, trimestriel, annuel) : la demande est enregistrée, la boutique reste en attente et n'est pas
 * connectée ; l'accès s'ouvre une fois le paiement confirmé par le Super Admin.
 */
export function RegisterBoutiqueView({ initialPlan = "ESSAI" }: { initialPlan?: SignupPlan }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attente, setAttente] = useState<{ boutique: string; plan: string; montant: string; whatsapp?: string } | null>(null);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BoutiqueSignupInput>({
    resolver: zodResolver(boutiqueSignupSchema),
    defaultValues: { plan: initialPlan },
  });
  const plan = watch("plan");

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const response = await registerBoutiquePublic(values);
      const { accessToken, refreshToken, user } = response.data;

      if (isPlanPayant(values.plan)) {
        // Paiement d'abord : pas de session ouverte tant que le Super Admin n'a pas confirmé le règlement.
        setAttente({ boutique: values.nomBoutique, plan: planName(values.plan), montant: prixPlan(values.plan), whatsapp: values.whatsapp?.trim() || undefined });
        return;
      }

      setTokens(accessToken, refreshToken);
      setUser({
        id: user.id,
        email: user.email,
        role: Role.ADMIN,
        boutiqueId: user.boutiqueId ?? null,
        boutiqueName: user.boutiqueName ?? null,
        boutiqueStatut: null,
      });
      toast.success("Boutique créée — essai gratuit de 14 jours activé !");
      router.push("/stock");
    } catch (error) {
      const message = (error as AppError)?.message ?? "Inscription impossible";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  if (attente) {
    return <PaiementEnAttente {...attente} />;
  }

  return (
    <section className="w-full rounded-lg border border-border bg-surface p-6 shadow-card md:p-8">
      <h1 className="mb-1 font-display text-2xl md:text-3xl">Inscrire ma boutique</h1>
      <p className="mb-4 text-sm text-text-muted">
        Créez votre espace en 1 minute. Choisissez l&apos;essai gratuit de 14 jours ou un abonnement.
      </p>
      <div className="space-y-3">
        <Input
          label="Nom de la boutique"
          variant="bordered"
          isInvalid={Boolean(errors.nomBoutique)}
          errorMessage={errors.nomBoutique?.message}
          {...register("nomBoutique")}
        />
        <Input label="Ville" variant="bordered" {...register("ville")} />
        <Input
          label="WhatsApp"
          variant="bordered"
          placeholder="+225 07 00 00 00 00"
          isInvalid={Boolean(errors.whatsapp)}
          errorMessage={errors.whatsapp?.message}
          {...register("whatsapp")}
        />
        <Input
          type="tel"
          label="Votre téléphone (admin)"
          variant="bordered"
          placeholder="+225 07 00 00 00 00"
          isInvalid={Boolean(errors.telephone)}
          errorMessage={errors.telephone?.message}
          {...register("telephone")}
        />
        <Input
          type="email"
          label="Votre email (admin)"
          variant="bordered"
          isInvalid={Boolean(errors.email)}
          errorMessage={errors.email?.message}
          {...register("email")}
        />
        <Input
          type={showPassword ? "text" : "password"}
          label="Mot de passe"
          variant="bordered"
          isInvalid={Boolean(errors.password)}
          errorMessage={errors.password?.message}
          endContent={
            <button
              type="button"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              onClick={() => setShowPassword((v) => !v)}
              className="text-default-400 hover:text-default-600 focus:outline-none"
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          }
          {...register("password")}
        />
        <PlanPicker value={plan} onChange={(p) => setValue("plan", p, { shouldValidate: true })} />
        <Button className="w-full bg-accent text-white" onPress={() => void onSubmit()} isLoading={isSubmitting}>
          {isPlanPayant(plan) ? "Continuer vers le paiement" : "Créer ma boutique"}
        </Button>
        <p className="text-center text-sm text-default-500">
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </section>
  );
}
