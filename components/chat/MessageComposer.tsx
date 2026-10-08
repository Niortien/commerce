"use client";

import { useRef } from "react";
import { Button, Textarea } from "@heroui/react";
import { IconSend } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMessageSchema, type SendMessageInput } from "@/lib/validators/chat.schema";
import { useSendMessage } from "@/features/chat/mutation/chat-mutations";

/** Entrée envoie, Maj+Entrée saute une ligne. */
export function MessageComposer({ conversationId }: { conversationId: string }) {
  const send = useSendMessage(conversationId);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { control, handleSubmit, reset } = useForm<SendMessageInput>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: { body: "" },
  });

  const onSubmit = handleSubmit(async ({ body }) => {
    if (send.isPending) return;
    try {
      await send.mutateAsync(body);
      // Vidé seulement après succès : en cas d'échec le texte reste pour réessayer.
      reset({ body: "" });
      inputRef.current?.focus();
    } catch {
      // Le toast d'erreur est géré par useSendMessage.
    }
  });

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="flex items-end gap-2 border-t border-border bg-surface p-3"
    >
      {/* Champ contrôlé : le Textarea HeroUI garde sa propre valeur en mode non contrôlé, `reset` ne le viderait pas. */}
      <Controller
        name="body"
        control={control}
        render={({ field }) => (
          <Textarea
            ref={inputRef}
            aria-label="Écrire un message"
            placeholder="Écrire un message…"
            variant="bordered"
            minRows={1}
            maxRows={4}
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void onSubmit();
              }
            }}
          />
        )}
      />
      <Button
        type="submit"
        isIconOnly
        aria-label="Envoyer le message"
        className="h-11 w-11 shrink-0 bg-accent text-white"
        isLoading={send.isPending}
      >
        <IconSend size={18} aria-hidden />
      </Button>
    </form>
  );
}
