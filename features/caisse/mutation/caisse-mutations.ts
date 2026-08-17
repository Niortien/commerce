"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { disconnectCaisseSocket, getCaisseSocket } from "@/lib/socket";
import { useAuthStore } from "@/stores/authStore";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import { useCaisseStore } from "@/stores/caisseStore";
import type { Transaction } from "@/types";
import {
  createTransaction,
  fermerSession,
  ouvrirSession,
  type CreateTransactionBody,
  type FermerSessionBody,
  type OuvrirSessionBody,
} from "../api/caisse-api";
import { caisseKeys } from "../query/caisse-queries";

export function useOuvrirSession() {
  const qc = useQueryClient();
  const boutiqueId = useBoutiqueId();
  const setSession = useCaisseStore((s) => s.setSession);
  return useMutation({
    mutationFn: (body: OuvrirSessionBody) => ouvrirSession(body, boutiqueId),
    onSuccess: async ({ data }) => {
      setSession(data);
      await qc.invalidateQueries({ queryKey: ["caisse"] });
      toast.success("Session ouverte");
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? "Impossible d'ouvrir la session");
    },
  });
}

export function useFermerSession() {
  const qc = useQueryClient();
  const router = useRouter();
  const clearSession = useCaisseStore((s) => s.clearSession);
  return useMutation({
    mutationFn: ({ id, montantFermeture }: { id: string; montantFermeture: string }) =>
      fermerSession(id, { montantFermeture }),
    onSuccess: async () => {
      clearSession();
      disconnectCaisseSocket();
      await qc.invalidateQueries({ queryKey: caisseKeys.all });
      toast.success("Session clôturée");
      router.push("/caisse");
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? "Impossible de clôturer la session");
    },
  });
}

export function useAddTransaction() {
  const qc = useQueryClient();
  const boutiqueId = useBoutiqueId();
  const addTransaction = useCaisseStore((s) => s.addTransaction);
  return useMutation({
    mutationFn: (body: CreateTransactionBody) => createTransaction(body, boutiqueId),
    onMutate: async (body) => {
      const optimistic: Transaction = {
        id: `optimistic-${Date.now()}`,
        sessionId: "pending",
        sortieId: body.sortieId ?? null,
        montant: body.montant,
        modePaiement: body.modePaiement,
        reference: body.reference ?? null,
        notes: body.notes ?? null,
        createdAt: new Date().toISOString(),
      };
      addTransaction(optimistic);
    },
    onSuccess: async ({ data }) => {
      addTransaction(data);
      await qc.invalidateQueries({ queryKey: caisseKeys.all });
      await qc.invalidateQueries({ queryKey: ["sorties"] });
    },
  });
}

export function useCaisseSocket() {
  const qc = useQueryClient();
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken);
  const addTransaction = useCaisseStore((s) => s.addTransaction);
  const clearSession = useCaisseStore((s) => s.clearSession);

  const connect = () => {
    if (!token) return;
    const socket = getCaisseSocket(token);

    socket.on("transaction.created", async (transaction: Transaction) => {
      addTransaction(transaction);
      await qc.invalidateQueries({ queryKey: caisseKeys.all });
    });

    socket.on("session.closed", async () => {
      clearSession();
      toast("Session clôturée");
      router.push("/caisse");
      await qc.invalidateQueries({ queryKey: caisseKeys.all });
    });

    socket.on("alerte-stock", (payload: { produitNom: string; quantite: number }) => {
      toast(`${payload.produitNom} en alerte stock (${payload.quantite})`);
    });

    socket.connect();
  };

  const disconnect = () => {
    disconnectCaisseSocket();
  };

  return { connect, disconnect };
}
