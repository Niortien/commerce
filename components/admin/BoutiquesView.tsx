"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBoutiques } from "@/features/boutiques/query/boutiques-queries";
import {
  useCreateBoutique,
  useDeleteBoutique,
  useUpdateBoutique,
} from "@/features/boutiques/mutation/boutiques-mutations";
import type { Boutique } from "@/types";

const schema = z.object({
  nom: z.string().min(1, "Requis"),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  whatsapp: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function BoutiquesView() {
  const { data: res, isLoading } = useBoutiques();
  const boutiques = res?.data ?? [];
  const createMutation = useCreateBoutique();
  const updateMutation = useUpdateBoutique();
  const deleteMutation = useDeleteBoutique();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<Boutique | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function openCreate() {
    setEditing(null);
    reset({ nom: "", adresse: "", ville: "", whatsapp: "" });
    onOpen();
  }

  function openEdit(b: Boutique) {
    setEditing(b);
    reset({ nom: b.nom, adresse: b.adresse ?? "", ville: b.ville ?? "", whatsapp: b.whatsapp ?? "" });
    onOpen();
  }

  const onSubmit = handleSubmit(async (data) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, body: data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onClose();
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Boutiques</h1>
        <Button className="bg-accent text-black" onPress={openCreate}>
          + Nouvelle boutique
        </Button>
      </div>

      <Table aria-label="Liste des boutiques">
        <TableHeader>
          <TableColumn>Nom</TableColumn>
          <TableColumn>Ville</TableColumn>
          <TableColumn>Adresse</TableColumn>
          <TableColumn>WhatsApp</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody isLoading={isLoading} emptyContent="Aucune boutique">
          {boutiques.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="font-medium">{b.nom}</TableCell>
              <TableCell>{b.ville ?? "—"}</TableCell>
              <TableCell>{b.adresse ?? "—"}</TableCell>
              <TableCell>{b.whatsapp ?? "—"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="flat" onPress={() => openEdit(b)}>
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    isLoading={deleteMutation.isPending}
                    onPress={() => deleteMutation.mutate(b.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{editing ? "Modifier la boutique" : "Nouvelle boutique"}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              <Input label="Nom" variant="bordered" isInvalid={!!errors.nom} errorMessage={errors.nom?.message} {...register("nom")} />
              <Input label="Ville" variant="bordered" {...register("ville")} />
              <Input label="Adresse" variant="bordered" {...register("adresse")} />
              <Input label="WhatsApp" variant="bordered" placeholder="+221 77 000 00 00" {...register("whatsapp")} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Annuler</Button>
            <Button
              className="bg-accent text-black"
              isLoading={createMutation.isPending || updateMutation.isPending}
              onPress={() => void onSubmit()}
            >
              {editing ? "Enregistrer" : "Créer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
