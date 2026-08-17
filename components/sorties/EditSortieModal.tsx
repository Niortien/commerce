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
import { useUpdateSortie } from "@/features/sorties/mutation/sorties-mutations";
import type { Sortie } from "@/types";

interface EditSortieModalProps {
  sortie: Sortie | null;
  onClose: () => void;
}

export function EditSortieModal({ sortie, onClose }: EditSortieModalProps) {
  const [notes, setNotes] = useState("");
  const mutation = useUpdateSortie();

  useEffect(() => {
    if (sortie) {
      setNotes(sortie.notes?.replace("[ANNULEE]", "").trim() ?? "");
    }
  }, [sortie]);

  const handleSave = () => {
    if (!sortie) return;
    mutation.mutate(
      { id: sortie.id, body: { notes: notes.trim() || undefined } },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal
      isOpen={!!sortie}
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
        <ModalHeader className="text-base font-semibold">Modifier la sortie</ModalHeader>
        <ModalBody className="gap-3">
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
            className="flex-1 bg-[var(--color-out)] font-semibold text-white"
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
