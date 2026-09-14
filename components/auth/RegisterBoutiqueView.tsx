"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { boutiqueSignupSchema, type BoutiqueSignupInput } from "@/lib/validators/boutique-signup.schema";
import { registerBoutiquePublic } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/stores/authStore";
import type { AppError } from "@/types";
import { Role } from "@/types";

/**
 * Auto-inscription publique : une boutique crée son compte, démarre un
 * essai gratuit de 14 jours, et atterrit directement sur son tableau de
 * bord. Elle apparaît ensuite dans la liste du Super Admin pour suivi.
 */
export function RegisterBoutiqueView() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoutiqueSignupInput>({
    resolver: zodResolver(boutiqueSignupSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const response = await registerBoutiquePublic(values);
      const { accessToken, refreshToken, user } = response.data;

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

  return (
    <section className="mx-auto mt-10 max-w-md rounded-lg border border-border bg-surface p-6">
      <h1 className="mb-1 font-[var(--font-display)] text-2xl md:text-3xl">Inscrire ma boutique</h1>
      <p className="mb-4 text-sm text-text-muted">
        Créez votre espace en 1 minute. Essai gratuit de 14 jours, sans engagement.
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
        <Input label="WhatsApp" variant="bordered" placeholder="+225 07 00 00 00 00" {...register("whatsapp")} />
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
        <Button className="w-full bg-accent text-black" onPress={() => void onSubmit()} isLoading={isSubmitting}>
          Créer ma boutique
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
