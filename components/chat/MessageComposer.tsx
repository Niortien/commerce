"use client";

import { Button, Textarea } from "@heroui/react";
import { IconSend } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMessageSchema, type SendMessageInput } from "@/lib/validators/chat.schema";
import { useSendMessage } from "@/features/chat/mutation/chat-mutations";

/** Entrée envoie, Maj+Entrée saute une ligne. */
export function MessageComposer({ conversationId }: { conversationId: string }) {
  const send = useSendMessage(conversationId);
  const { register, handleSubmit, reset } = useForm<SendMessageInput>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: { body: "" },
  });

  const onSubmit = handleSubmit(async ({ body }) => {
    await send.mutateAsync(body);
    reset({ body: "" });
  });

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="flex items-end gap-2 border-t border-border bg-surface p-3"
    >
      <Textarea
        aria-label="Écrire un message"
        placeholder="Écrire un message…"
        variant="bordered"
        minRows={1}
        maxRows={4}
        {...register("body")}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void onSubmit();
          }
        }}
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
