import type { Metadata } from "next";
import { RegisterBoutiqueView } from "@/components/auth/RegisterBoutiqueView";
import { SIGNUP_PLANS, type SignupPlan } from "@/lib/validators/boutique-signup.schema";

export const metadata: Metadata = {
  title: "Inscrire ma boutique",
  description: "Créez l'espace de votre boutique sur Mon Djossi : stock, caisse et entrées/sorties, avec un abonnement adapté.",
  alternates: { canonical: "/inscription" },
  robots: { index: true, follow: true },
};

export default async function InscriptionPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  const initialPlan = SIGNUP_PLANS.find((p) => p === plan?.toUpperCase()) as SignupPlan | undefined;
  return <RegisterBoutiqueView initialPlan={initialPlan} />;
}
