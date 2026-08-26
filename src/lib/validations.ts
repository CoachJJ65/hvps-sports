import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const grokChatSchema = z.object({
  prompt: z.string().trim().min(1).max(4000),
});

export type GrokChatInput = z.infer<typeof grokChatSchema>;
