export type ChatSenderRole = "SUPER_ADMIN" | "ADMIN";

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: ChatSenderRole;
  body: string;
  createdAt: string;
  readAt: string | null;
}

export interface ChatParticipant {
  id: string;
  email: string;
  telephone: string | null;
  boutique: { id: string; nom: string } | null;
}

/** Une conversation = un ADMIN de boutique face au Super Admin de la plateforme. */
export interface ChatConversation {
  id: string;
  admin: ChatParticipant;
  lastMessage: ChatMessage | null;
  /** Messages de l'autre partie non lus par l'utilisateur connecté. */
  unreadCount: number;
  updatedAt: string;
}
