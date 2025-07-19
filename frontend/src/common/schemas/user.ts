import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type User = z.infer<typeof UserSchema>;
