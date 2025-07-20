import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
