"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useUpdateEntree } from "@/features/entrees/mutation/entrees-mutations";
import type { Entree } from "@/types";

interface EditEntreeModalProps {
  entree: Entree | null;
  onClose: () => void;
}

export function EditEntreeModal({ entree, onClose }: EditEntreeModalProps) {
  const [fournisseur, setFournisseur] = useState("");
  const [notes, setNotes] = useState("");
  const mutation = useUpdateEntree();

  useEffect(() => {
    if (entree) {
      setFournisseur(entree.fournisseur);
      setNotes(entree.notes?.replace("[ANNULEE]", "").trim() ?? "");
    }
  }, [entree]);

  const handleSave = () => {
    if (!entree) return;
    mutation.mutate(
      { id: entree.id, body: { fournisseur: fournisseur.trim(), notes: notes.trim() || undefined } },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal
      isOpen={!!entree}
      onClose={onClose}
      onOpenChange={(open) => { if (!open) onClose(); }}
      size="sm"
      classNames={{
        wrapper: "z-[1100]",
        backdrop: "z-[1050]",
        base: "bg-[var(--color-surface)] border border-border",
        header: "border-b border-border/60",
        footer: "border-t border-border/60",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-base font-semibold">Modifier l&apos;entrée</ModalHeader>
        <ModalBody className="gap-3">
          <Input
            label="Fournisseur"
            labelPlacement="outside"
            variant="bordered"
            value={fournisseur}
            onValueChange={setFournisseur}
          />
          <Input
            label="Notes"
            labelPlacement="outside"
            variant="bordered"
            placeholder="Optionnel"
            value={notes}
            onValueChange={setNotes}
          />
        </ModalBody>
        <ModalFooter className="gap-3">
          <Button variant="flat" className="flex-1 text-text-muted" onPress={onClose} isDisabled={mutation.isPending}>
            Annuler
          </Button>
          <Button
            className="flex-1 bg-[var(--color-in)] font-semibold text-black"
            isLoading={mutation.isPending}
            onPress={handleSave}
          >
            Enregistrer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
