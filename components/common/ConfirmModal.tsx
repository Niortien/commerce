"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  danger?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmer",
  isLoading = false,
  danger = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
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
        <ModalHeader className="text-base font-semibold">{title}</ModalHeader>
        <ModalBody>
          <p className="text-sm text-text-muted">{message}</p>
        </ModalBody>
        <ModalFooter className="gap-3">
          <Button variant="flat" className="flex-1 text-text-muted" onPress={onClose} isDisabled={isLoading}>
            Annuler
          </Button>
          <Button
            className={`flex-1 font-semibold ${danger ? "bg-[var(--color-out)] text-white" : "bg-accent text-black"}`}
            isLoading={isLoading}
            isDisabled={isLoading}
            onPress={onConfirm}
          >
            {confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
