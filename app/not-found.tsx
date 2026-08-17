import Link from "next/link";
import { Button } from "@heroui/react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-[var(--font-mono)] text-sm text-text-muted">Erreur 404</p>
      <h1 className="font-[var(--font-display)] text-4xl">Page introuvable</h1>
      <p className="text-sm text-text-muted">Cette ressource n existe pas ou a ete deplacee.</p>
      <Link href="/stock">
        <Button className="bg-accent text-black">Retour au dashboard</Button>
      </Link>
    </main>
  );
}
