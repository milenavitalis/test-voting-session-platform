import { z } from "zod";

export const LoginSchema = z.object({
  cpf: z.string(),
  password: z.string(),
});

export const LoginCallbackSchema = z.object({
  access_token: z.string(),
  id: z.number().transform((val) => String(val)),
  name: z.string(),
  cpf: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const LoginByTokenSchema = z.object({
  access_token: z.string(),
});

export const RegisterSchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
});

export const RegisterCallbackSchema = z.object({
  access_token: z.string(),
  id: z.number().transform((val) => String(val)),
  name: z.string(),
  cpf: z.string().optional(),
});

export type Login = z.infer<typeof LoginSchema>;
export type LoginCallback = z.infer<typeof LoginCallbackSchema>;
export type LoginByToken = z.infer<typeof LoginByTokenSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type RegisterCallback = z.infer<typeof RegisterCallbackSchema>;
