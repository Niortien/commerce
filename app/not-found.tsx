import Link from "next/link";
import { Button } from "@heroui/react";
import { BrandMark } from "@/components/common/BrandMark";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <BrandMark className="h-14" />
      <p className="font-mono text-sm text-text-muted">Erreur 404</p>
      <h1 className="font-display text-4xl font-extrabold tracking-tight">Page introuvable</h1>
      <p className="text-sm text-text-muted">Cette page n&apos;existe pas ou a été déplacée.</p>
      <Link href="/dashboard">
        <Button className="bg-accent font-semibold text-white">Retour au tableau de bord</Button>
      </Link>
    </main>
  );
}
