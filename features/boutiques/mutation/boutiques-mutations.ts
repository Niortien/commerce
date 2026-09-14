"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateMyBoutique } from "../api/boutiques-api";
import { boutiqueKeys } from "../query/boutiques-queries";

export function useUpdateMyBoutique() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateMyBoutique,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: boutiqueKeys.me() });
      toast.success("Boutique mise à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });
}
