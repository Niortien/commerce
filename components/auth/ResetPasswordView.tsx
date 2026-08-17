"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { apiPost } from "@/lib/api";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validators/auth.schema";
import type { AppError } from "@/types";

export function ResetPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!token || !email) {
      toast.error("Lien de réinitialisation invalide");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiPost<{ message: string }>("/auth/reset-password", { email, token, password: values.password });
      toast.success("Mot de passe réinitialisé, connecte-toi");
      router.push("/login");
    } catch (error) {
      const message = (error as AppError)?.message ?? "Lien invalide ou expiré";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  if (!token || !email) {
    return (
      <section className="mx-auto mt-16 max-w-md rounded-lg border border-border bg-surface p-6">
        <h1 className="mb-4 font-[var(--font-display)] text-2xl md:text-3xl">Lien invalide</h1>
        <p className="text-sm text-default-600">
          Ce lien de réinitialisation est incomplet ou a expiré.
        </p>
        <Link href="/forgot-password" className="mt-4 block text-center text-sm text-accent hover:underline">
          Demander un nouveau lien
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-16 max-w-md rounded-lg border border-border bg-surface p-6">
      <h1 className="mb-4 font-[var(--font-display)] text-2xl md:text-3xl">Nouveau mot de passe</h1>
      <div className="space-y-3">
        <Input
          type="password"
          label="Nouveau mot de passe"
          variant="bordered"
          isInvalid={Boolean(errors.password)}
          errorMessage={errors.password?.message}
          {...register("password")}
        />
        <Button className="w-full bg-accent text-black" onPress={() => void onSubmit()} isLoading={isSubmitting}>
          Réinitialiser
        </Button>
      </div>
    </section>
  );
}
