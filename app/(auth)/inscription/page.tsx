import type { Metadata } from "next";
import { RegisterBoutiqueView } from "@/components/auth/RegisterBoutiqueView";
import { openGraphPage, twitterPage } from "@/lib/seo";
import { SIGNUP_PLANS, type SignupPlan } from "@/lib/validators/boutique-signup.schema";

const DESCRIPTION =
  "Créez l'espace de votre boutique sur Mon Djossi : stock, caisse et entrées/sorties, avec un abonnement adapté. Essai gratuit 14 jours.";

export const metadata: Metadata = {
  title: "Inscrire ma boutique",
  description: DESCRIPTION,
  alternates: { canonical: "/inscription" },
  robots: { index: true, follow: true },
  openGraph: openGraphPage("Inscrire ma boutique | Mon Djossi", DESCRIPTION, "/inscription"),
  twitter: twitterPage("Inscrire ma boutique | Mon Djossi", DESCRIPTION),
};

export default async function InscriptionPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  const initialPlan = SIGNUP_PLANS.find((p) => p === plan?.toUpperCase()) as SignupPlan | undefined;
  return <RegisterBoutiqueView initialPlan={initialPlan} />;
}
