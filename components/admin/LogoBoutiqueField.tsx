"use client";

import { useRef, useState } from "react";
import { Button } from "@heroui/react";
import { IconPhotoPlus, IconTrash } from "@tabler/icons-react";
import { reduireImage } from "@/lib/files";

interface LogoBoutiqueFieldProps {
  /** Data URL ou adresse du logo ; chaîne vide = pas de logo. */
  value: string;
  onChange: (value: string) => void;
}

/** Logo de la boutique, imprimé en haut des reçus : choisir, remplacer ou retirer. Réduit à 256 px avant l'envoi. */
export function LogoBoutiqueField({ value, onChange }: LogoBoutiqueFieldProps) {
  const input = useRef<HTMLInputElement>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [lecture, setLecture] = useState(false);

  const choisirFichier = async (file: File | undefined) => {
    if (!file) return;
    setErreur(null);
    setLecture(true);
    try {
      onChange(await reduireImage(file, { max: 256 }));
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Impossible de lire l'image.");
    } finally {
      setLecture(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-text">Logo</p>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-surface-high">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Logo de la boutique" className="h-full w-full object-contain p-1.5" />
          ) : (
            <IconPhotoPlus size={26} aria-hidden className="text-text-muted" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="bordered" isLoading={lecture} onPress={() => input.current?.click()}>
            {value ? "Changer le logo" : "Ajouter un logo"}
          </Button>
          {value && (
            <Button size="sm" variant="light" color="danger" startContent={<IconTrash size={16} aria-hidden />} onPress={() => onChange("")}>
              Retirer
            </Button>
          )}
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        aria-label="Choisir le logo de la boutique"
        onChange={(e) => void choisirFichier(e.target.files?.[0])}
      />
      <p className="text-xs text-text-muted">Il s&apos;imprime en haut de vos reçus. Une image carrée sur fond clair rend le mieux.</p>
      {erreur && <p className="text-xs text-out">{erreur}</p>}
    </div>
  );
}
