"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@heroui/react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { apiPost } from "@/lib/api";
import { loginSchema, type LoginInput } from "@/lib/validators/auth.schema";
import { useAuthStore, type AuthUser } from "@/stores/authStore";
import type { AppError } from "@/types";
import { Role } from "@/types";

export function LoginView() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  const token = useAuthStore((state) => state.accessToken);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (token) router.replace(user?.role === Role.SUPER_ADMIN ? "/super-admin/boutiques" : "/stock");
  }, [token, user?.role, router]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);

    try {
      const response = await apiPost<{
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          email: string;
          role: string;
          boutiqueId?: string | null;
          boutiqueName?: string | null;
          boutiqueStatut?: string | null;
        };
      }, LoginInput>("/auth/login", values);

      const { accessToken, refreshToken, user: loggedInUser } = response.data;
      const role = loggedInUser.role as Role;

      setTokens(accessToken, refreshToken);
      setUser({
        id: loggedInUser.id,
        email: loggedInUser.email,
        role,
        boutiqueId: loggedInUser.boutiqueId ?? null,
        boutiqueName: loggedInUser.boutiqueName ?? null,
        boutiqueStatut: (loggedInUser.boutiqueStatut as AuthUser["boutiqueStatut"]) ?? null,
      });
      toast.success("Connexion réussie");
      router.push(role === Role.SUPER_ADMIN ? "/super-admin/boutiques" : "/stock");
    } catch (error) {
      const message = (error as AppError)?.message ?? "Connexion impossible";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <section className="mx-auto mt-16 max-w-md rounded-lg border border-border bg-surface p-6">
      <h1 className="mb-4 font-[var(--font-display)] text-2xl md:text-3xl">Connexion</h1>
      <div className="space-y-3">
        <Input
          type="email"
          label="Email"
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
              {showPassword ? (
                <IconEyeOff size={20} />
              ) : (
                <IconEye size={20} />
              )}
            </button>
          }
          {...register("password")}
        />
        <Button className="w-full bg-accent text-white" onPress={() => void onSubmit()} isLoading={isSubmitting}>
          Se connecter
        </Button>
        <Link href="/forgot-password" className="block text-center text-sm text-default-500 hover:underline">
          Mot de passe oublié ?
        </Link>
        <p className="text-center text-sm text-default-500">
          Votre boutique n&apos;a pas encore de compte ?{" "}
          <Link href="/inscription" className="font-semibold text-accent hover:underline">
            Inscrivez-la
          </Link>
        </p>
      </div>
    </section>
  );
}
