import { z } from "zod";

export const CHAT_MAX_LENGTH = 2000;

export const sendMessageSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Message vide")
    .max(CHAT_MAX_LENGTH, `${CHAT_MAX_LENGTH} caractères maximum`),
});
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
