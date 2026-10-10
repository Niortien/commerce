"use client";

import { Chip } from "@heroui/react";
import { cn } from "@/lib/utils";
import type { ChatParticipant } from "@/types";

export interface ConversationListItem {
  /** Identifiant de l'admin (la conversation peut ne pas exister encore). */
  adminId: string;
  conversationId: string | null;
  admin: Pick<ChatParticipant, "email" | "boutique">;
  preview: string;
  unreadCount: number;
}

interface ConversationListProps {
  items: ConversationListItem[];
  activeAdminId: string | null;
  onSelect: (item: ConversationListItem) => void;
}

export function ConversationList({ items, activeAdminId, onSelect }: ConversationListProps) {
  if (items.length === 0) {
    return <p className="p-4 text-sm text-text-muted">Aucun admin pour le moment.</p>;
  }

  return (
    <ul aria-label="Conversations" className="flex flex-col divide-y divide-border">
      {items.map((item) => {
        const active = item.adminId === activeAdminId;
        return (
          <li key={item.adminId}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex min-h-14 w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
                active ? "bg-accent/10" : "hover:bg-surface-high"
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text">{item.admin.boutique?.nom ?? item.admin.email}</p>
                <p className="truncate text-xs text-text-muted">{item.preview || item.admin.email}</p>
              </div>
              {item.unreadCount > 0 && (
                <Chip size="sm" color="danger" aria-label={`${item.unreadCount} non lus`}>
                  {item.unreadCount}
                </Chip>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
