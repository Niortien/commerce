import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VitrineView } from "@/components/vitrine/VitrineView";
import { getVitrine, vitrineMetadata } from "@/lib/vitrine";

interface VitrinePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: VitrinePageProps): Promise<Metadata> {
  const vitrine = await getVitrine(params.slug);
  return vitrine ? vitrineMetadata(vitrine) : { title: "Vitrine introuvable", robots: { index: false } };
}

export default async function VitrinePage({ params }: VitrinePageProps) {
  const vitrine = await getVitrine(params.slug);
  if (!vitrine) notFound();
  return <VitrineView vitrine={vitrine} />;
}
