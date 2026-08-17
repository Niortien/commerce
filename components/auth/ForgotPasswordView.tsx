"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { apiPost } from "@/lib/api";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validators/auth.schema";
import type { AppError } from "@/types";

export function ForgotPasswordView() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await apiPost<{ message: string }>("/auth/forgot-password", values);
      setSent(true);
    } catch (error) {
      const message = (error as AppError)?.message ?? "Une erreur est survenue";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <section className="mx-auto mt-16 max-w-md rounded-lg border border-border bg-surface p-6">
      <h1 className="mb-4 font-[var(--font-display)] text-2xl md:text-3xl">Mot de passe oublié</h1>

      {sent ? (
        <p className="text-sm text-default-600">
          Si un compte existe avec cet email, un lien de réinitialisation vient d&apos;être envoyé.
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-default-600">
            Indique ton email, tu recevras un lien pour réinitialiser ton mot de passe.
          </p>
          <Input
            type="email"
            label="Email"
            variant="bordered"
            isInvalid={Boolean(errors.email)}
            errorMessage={errors.email?.message}
            {...register("email")}
          />
          <Button className="w-full bg-accent text-black" onPress={() => void onSubmit()} isLoading={isSubmitting}>
            Envoyer le lien
          </Button>
        </div>
      )}

      <Link href="/login" className="mt-4 block text-center text-sm text-default-500 hover:underline">
        ← Retour à la connexion
      </Link>
    </section>
  );
}
