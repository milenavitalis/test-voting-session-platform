import cloud from "@/infra/cloud";
import {
  TopicSchema,
  TopicCallbackSchema,
  TopicListCallbackSchema,
  SessionSchema,
  SessionCallbackSchema,
  VoteSchema,
  VoteCallbackSchema,
  type Topic,
  type TopicCallback,
  type TopicListCallback,
  type Session,
  type SessionCallback,
  type VoteCreate,
  type VoteCallback,
} from "@/common/schemas/topic";
import { Callback } from "@/common/schemas/types";
import { handleZodError } from "@/common/utils/apiError";

export const getTopics = (callback: Callback<TopicListCallback>) => {
  cloud.get("v1/topics", {}, callback, TopicListCallbackSchema);
};

export const createTopic = (data: Topic, callback: Callback<TopicCallback>) => {
  const { data: parsedData, success, error } = TopicSchema.safeParse(data);

  if (!success) return handleZodError(error, callback);

  cloud.post("v1/topics", parsedData, callback, TopicCallbackSchema);
};

export const openVotingSession = (
  data: Session,
  callback: Callback<SessionCallback>
) => {
  const { data: parsedData, success, error } = SessionSchema.safeParse(data);

  if (!success) return handleZodError(error, callback);

  const { topic_id } = parsedData;

  cloud.post(
    `v1/topics/${topic_id}/session`,
    parsedData,
    callback,
    SessionCallbackSchema
  );
};

export const createVote = (
  data: VoteCreate,
  callback: Callback<VoteCallback>
) => {
  const { data: parsedData, success, error } = VoteSchema.safeParse(data);

  if (!success) return handleZodError(error, callback);

  const { topic_id } = parsedData;

  cloud.post(
    `v1/topics/${topic_id}/vote`,
    parsedData,
    callback,
    VoteCallbackSchema
  );
};

export const getVoteResult = (
  topicId: number,
  callback: Callback<VoteCallback>
) => {
  cloud.get(`v1/topics/${topicId}/result`, {}, callback, VoteCallbackSchema);
};
