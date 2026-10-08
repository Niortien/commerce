"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { Role } from "@/types";
import { getConversations, getMessages } from "../api/chat-api";

/** Pas de socket côté API : le chat se rafraîchit par polling. */
const MESSAGES_POLL_MS = 5_000;
const CONVERSATIONS_POLL_MS = 15_000;

export const chatKeys = {
  all: ["chat"] as const,
  conversations: () => ["chat", "conversations"] as const,
  messages: (conversationId: string) => ["chat", "messages", conversationId] as const,
};

function useCanChat(): boolean {
  const token = useAuthStore((s) => s.accessToken);
  const role = useAuthStore((s) => s.user?.role);
  return !!token && (role === Role.SUPER_ADMIN || role === Role.ADMIN);
}

export function useConversations() {
  const enabled = useCanChat();
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: getConversations,
    enabled,
    refetchInterval: CONVERSATIONS_POLL_MS,
  });
}

export function useMessages(conversationId: string | null) {
  const enabled = useCanChat();
  return useQuery({
    queryKey: chatKeys.messages(conversationId ?? ""),
    queryFn: () => getMessages(conversationId as string),
    enabled: enabled && !!conversationId,
    refetchInterval: MESSAGES_POLL_MS,
  });
}

/** Total des messages non lus (pastille de navigation). */
export function useChatUnreadCount(): number {
  const { data } = useConversations();
  return (data?.data ?? []).reduce((sum, c) => sum + c.unreadCount, 0);
}
