"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { markConversationRead, openConversation, sendMessage } from "../api/chat-api";
import { chatKeys } from "../query/chat-queries";

export function useSendMessage(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => sendMessage(conversationId, { body }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: chatKeys.messages(conversationId) });
      void qc.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
    onError: () => toast.error("Message non envoyé. Réessaie."),
  });
}

export function useOpenConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: openConversation,
    onSuccess: () => void qc.invalidateQueries({ queryKey: chatKeys.conversations() }),
    onError: () => toast.error("Impossible d'ouvrir la conversation."),
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markConversationRead,
    onSuccess: () => void qc.invalidateQueries({ queryKey: chatKeys.conversations() }),
  });
}
