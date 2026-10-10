"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { IconBarcode } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { ScanCodeBarre } from "@/components/common/ScanCodeBarre";
import { useCodeBarreVariante } from "@/features/produits/mutation/produits-mutations";
import { isVarianteUnique } from "@/lib/unites";
import type { AppError, Variante } from "@/types";

function estAppError(e: unknown): e is AppError {
  return typeof e === "object" && e !== null && "code" in e && "message" in e;
}

function LigneCode({ variante, seule }: { variante: Variante; seule: boolean }) {
  const [valeur, setValeur] = useState(variante.codeBarre ?? "");
  const [scan, setScan] = useState(false);
  const mutation = useCodeBarreVariante();
  const modifie = valeur.trim() !== (variante.codeBarre ?? "");
  const libelle = seule || isVarianteUnique(variante) ? "Code-barres" : `${variante.taille} · ${variante.couleur}`;

  const enregistrer = async (code: string) => {
    try {
      await mutation.mutateAsync({ id: variante.id, codeBarre: code.trim() || null });
      toast.success(code.trim() ? "Code-barres enregistré" : "Code-barres retiré");
    } catch (e) {
      toast.error(estAppError(e) ? e.message : "Enregistrement impossible");
    }
  };

  return (
    <li className="flex items-center gap-2">
      <Input
        size="sm"
        label={libelle}
        variant="bordered"
        value={valeur}
        onValueChange={setValeur}
        onKeyDown={(e) => {
          // Lecteur USB : il tape le code puis Entrée → on enregistre.
          if (e.key === "Enter") {
            e.preventDefault();
            if (modifie) void enregistrer(valeur);
          }
        }}
      />
      <Button isIconOnly size="sm" variant="flat" aria-label={`Scanner le code de ${libelle}`} onPress={() => setScan(true)}>
        <IconBarcode size={18} aria-hidden />
      </Button>
      <Button size="sm" variant="flat" isDisabled={!modifie} isLoading={mutation.isPending} onPress={() => void enregistrer(valeur)}>
        OK
      </Button>
      <ScanCodeBarre
        isOpen={scan}
        onClose={() => setScan(false)}
        onCode={(code) => {
          setScan(false);
          setValeur(code);
          void enregistrer(code);
        }}
      />
    </li>
  );
}

/** Codes-barres des variantes d'un produit déjà créé : chaque taille/couleur peut avoir le sien. */
export function CodesBarresVariantes({ variantes }: { variantes: Variante[] }) {
  if (variantes.length === 0) return null;
  return (
    <section className="rounded-lg border border-border/80 bg-[var(--color-surface-high)] p-4">
      <p className="mb-1 text-sm font-medium text-text">Codes-barres</p>
      <p className="mb-3 text-xs text-text-muted">Scanne l&apos;étiquette : à la caisse, l&apos;article s&apos;ajoutera tout seul.</p>
      <ul className="space-y-2">
        {variantes.map((v) => (
          <LigneCode key={v.id} variante={v} seule={variantes.length === 1} />
        ))}
      </ul>
    </section>
  );
}
