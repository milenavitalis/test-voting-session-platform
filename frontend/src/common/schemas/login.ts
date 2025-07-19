import { z } from "zod";

export const LoginSchema = z.object({
  cpf: z.string(),
  password: z.string(),
});

export const LoginCallbackSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    cpf: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

export const LoginByTokenSchema = z.object({
  token: z.string(),
});

export type Login = z.infer<typeof LoginSchema>;
export type LoginCallback = z.infer<typeof LoginCallbackSchema>;
export type LoginByToken = z.infer<typeof LoginByTokenSchema>;
