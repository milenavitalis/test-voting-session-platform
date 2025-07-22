import * as Worker from "./worker";
import * as TopicSlice from "@/logic/topic/slice";
import {
  type Topic,
  type TopicCallback,
  type TopicListCallback,
  type Session,
  type SessionCallback,
  type VoteCreate,
  type VoteCallback,
  type Result,
} from "@/common/schemas/topic";

import type { AppDispatch } from "@/logic/reducer";
import { Callback } from "@/common/schemas";

export const getTopics =
  (callback: Callback<TopicListCallback>) => (dispatch: AppDispatch) => {
    dispatch(TopicSlice.setLoadTopics(true));
    Worker.getTopics((response, error) => {
      dispatch(TopicSlice.setLoadTopics(false));
      if (error || !response) {
        callback?.(undefined, error);
        return;
      }
      dispatch(TopicSlice.setTopics(response));
      callback?.(response, undefined);
    });
  };

export const createTopic =
  (data: Topic, callback: Callback<TopicCallback>) =>
  (dispatch: AppDispatch) => {
    dispatch(TopicSlice.setLoadTopics(true));
    Worker.createTopic(data, (response, error) => {
      dispatch(TopicSlice.setLoadTopics(false));
      if (error || !response) {
        callback?.(undefined, error);
        return;
      }
      dispatch(TopicSlice.addTopic(response));
      callback?.(response, undefined);
    });
  };

export const openVotingSession =
  (data: Session, callback: Callback<SessionCallback>) =>
  (dispatch: AppDispatch) => {
    dispatch(TopicSlice.setLoadSession(true));
    Worker.openVotingSession(data, (response, error) => {
      dispatch(TopicSlice.setLoadSession(false));
      if (error || !response) {
        callback?.(undefined, error);
        return;
      }
      dispatch(TopicSlice.setSession(response));
      dispatch(TopicSlice.updateTopicStatus(response));
      callback?.(response, undefined);
    });
  };

export const createVote =
  (data: VoteCreate, callback: Callback<VoteCallback>) =>
  (dispatch: AppDispatch) => {
    dispatch(TopicSlice.setLoadVote(true));
    Worker.createVote(data, (response, error) => {
      dispatch(TopicSlice.setLoadVote(false));
      if (error || !response) {
        callback?.(undefined, error);
        return;
      }
      dispatch(TopicSlice.setVote(response));
      callback?.(response, undefined);
    });
  };

export const getVoteResult =
  (topic_id: number, callback: Callback<Result>) => (dispatch: AppDispatch) => {
    dispatch(TopicSlice.setLoadVoteResult(true));
    Worker.getVoteResult(topic_id, (response, error) => {
      dispatch(TopicSlice.setLoadVoteResult(false));
      if (error || !response) {
        callback?.(undefined, error);
        return;
      }
      dispatch(TopicSlice.setVoteResult(response));
      callback?.(response, undefined);
    });
  };
