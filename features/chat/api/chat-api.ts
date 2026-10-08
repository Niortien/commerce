import { apiGet, apiPost } from "@/lib/api";
import type { ChatConversation, ChatMessage } from "@/types";

export interface SendMessageBody {
  body: string;
}

/** SUPER_ADMIN : toutes les conversations. ADMIN : sa conversation avec le Super Admin. */
export const getConversations = () => apiGet<ChatConversation[]>("/chat/conversations");

/** SUPER_ADMIN uniquement : ouvre (ou renvoie) la conversation avec un admin. */
export const openConversation = (adminId: string) =>
  apiPost<ChatConversation, { adminId: string }>("/chat/conversations", { adminId });

export const getMessages = (conversationId: string) =>
  apiGet<ChatMessage[]>(`/chat/conversations/${conversationId}/messages`);

export const sendMessage = (conversationId: string, body: SendMessageBody) =>
  apiPost<ChatMessage, SendMessageBody>(`/chat/conversations/${conversationId}/messages`, body);

export const markConversationRead = (conversationId: string) =>
  apiPost<null, Record<string, never>>(`/chat/conversations/${conversationId}/read`, {});
