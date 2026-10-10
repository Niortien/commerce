"use client";

import { useEffect, useRef } from "react";
import { Spinner } from "@heroui/react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMessages } from "@/features/chat/query/chat-queries";
import { useMarkRead } from "@/features/chat/mutation/chat-mutations";
import { useAuthStore } from "@/stores/authStore";

export function MessageThread({ conversationId, unreadCount }: { conversationId: string; unreadCount: number }) {
  const { data, isLoading } = useMessages(conversationId);
  const messages = data?.data ?? [];
  const userId = useAuthStore((s) => s.user?.id);
  const { mutate: markRead } = useMarkRead();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  useEffect(() => {
    if (unreadCount > 0) markRead(conversationId);
  }, [conversationId, unreadCount, markRead]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner color="warning" />
      </div>
    );
  }

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Messages"
      className="flex flex-1 flex-col gap-2 overflow-y-auto p-4"
    >
      {messages.length === 0 && (
        <p className="m-auto text-sm text-text-muted">Aucun message. Écris le premier !</p>
      )}
      {messages.map((m) => {
        const mine = m.senderId === userId;
        return (
          <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm md:max-w-[70%]",
                mine ? "rounded-br-sm bg-accent text-white" : "rounded-bl-sm bg-surface-high text-text"
              )}
            >
              {m.body}
              <time
                dateTime={m.createdAt}
                className={cn("mt-1 block text-right font-mono text-[10px]", mine ? "text-white/70" : "text-text-muted")}
              >
                {format(new Date(m.createdAt), "dd/MM HH:mm")}
              </time>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
