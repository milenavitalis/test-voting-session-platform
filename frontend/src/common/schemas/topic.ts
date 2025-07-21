import { z } from "zod";

export const TopicSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const TopicCallbackSchema = TopicSchema.extend({
  id: z.number(),
  status: z.string(),
  created_at: z.string(),
});

export const TopicListCallbackSchema = z.array(TopicCallbackSchema);

export const SessionSchema = z.object({
  duration_minutes: z.number().optional().nullable(),
  topic_id: z.number(),
});

export const SessionCallbackSchema = z.object({
  id: z.number(),
  topic_id: z.number(),
  status: z.enum(["pending", "open", "close"]),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  duration_minutes: z.number(),
});

export const TopicWithSessionStatus = TopicCallbackSchema.extend({
  SessionCallbackSchema,
});

export const VoteSchema = z.object({
  vote: z.enum(["Sim", "Não"]),
  topic_id: z.number(),
});

export const VoteCallbackSchema = VoteSchema.extend({
  id: z.number(),
  user_id: z.number(),
});

export type Topic = z.infer<typeof TopicSchema>;
export type TopicCallback = z.infer<typeof TopicCallbackSchema>;
export type TopicListCallback = z.infer<typeof TopicListCallbackSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type SessionCallback = z.infer<typeof SessionCallbackSchema>;
export type VoteCreate = z.infer<typeof VoteSchema>;
export type VoteCallback = z.infer<typeof VoteCallbackSchema>;
