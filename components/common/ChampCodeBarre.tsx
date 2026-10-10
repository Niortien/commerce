"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { IconBarcode } from "@tabler/icons-react";
import { ScanCodeBarre } from "@/components/common/ScanCodeBarre";

interface ChampCodeBarreProps {
  valeur: string;
  onChange: (valeur: string) => void;
  erreur?: string;
}

/** Champ « Code-barres » : se remplit au lecteur USB, à la caméra ou à la main. */
export function ChampCodeBarre({ valeur, onChange, erreur }: ChampCodeBarreProps) {
  const [scan, setScan] = useState(false);

  return (
    <>
      <div className="flex items-start gap-2">
        <Input
          label="Code-barres (facultatif)"
          variant="bordered"
          value={valeur}
          onValueChange={onChange}
          // Un lecteur USB termine par Entrée : on ne veut pas valider le formulaire pour autant.
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          description="Scanne l'étiquette : à la caisse, l'article s'ajoutera tout seul"
          isInvalid={Boolean(erreur)}
          errorMessage={erreur}
        />
        <Button
          isIconOnly
          variant="flat"
          className="mt-1 h-12 w-12 shrink-0"
          aria-label="Lire le code-barres avec la caméra"
          onPress={() => setScan(true)}
        >
          <IconBarcode size={20} aria-hidden />
        </Button>
      </div>
      <ScanCodeBarre
        isOpen={scan}
        onClose={() => setScan(false)}
        onCode={(code) => {
          onChange(code);
          setScan(false);
        }}
      />
    </>
  );
}
