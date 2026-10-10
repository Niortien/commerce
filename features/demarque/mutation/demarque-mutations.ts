"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AppError } from "@/types";
import { appliquerDemarque, type AppliquerDemarqueBody } from "../api/demarque-api";
import { demarqueKeys } from "../query/demarque-queries";

export function useAppliquerDemarque() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AppliquerDemarqueBody) => appliquerDemarque(body),
    onSuccess: async ({ data }) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: demarqueKeys.all }),
        qc.invalidateQueries({ queryKey: ["produits"] }),
        qc.invalidateQueries({ queryKey: ["balles"] }),
      ]);
      const n = data.nbDemarquees;
      if (n === 0) {
        toast("Aucun prix n'a baissé : ces pièces sont vendues ou déjà à ce prix.");
      } else {
        toast.success(`${n} pièce${n > 1 ? "s" : ""} démarquée${n > 1 ? "s" : ""}`);
      }
    },
    onError: (error: AppError) => toast.error(error?.message ?? "La démarque n'a pas pu être appliquée"),
  });
}
