"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

interface CaisseCloseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function CaisseCloseModal({ isOpen, onOpenChange, onConfirm }: CaisseCloseModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="rounded-[24px] border border-border bg-surface">
        <ModalHeader className="text-base font-semibold">Terminer la journée ?</ModalHeader>
        <ModalBody>
          <p className="text-sm text-text-muted">
            La caisse sera fermée et les recettes du jour seront enregistrées.
            Tu pourras toujours consulter l&apos;historique.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button color="danger" onPress={onConfirm}>
            Oui, terminer la journée
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
