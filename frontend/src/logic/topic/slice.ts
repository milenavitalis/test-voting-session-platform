import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  TopicListCallback,
  SessionCallback,
  VoteCallback,
  Result,
} from "@/common/schemas";

type TopicState = {
  loadTopics: boolean;
  topics: TopicListCallback;
  loadSession: boolean;
  session: SessionCallback | null;
  loadVote: boolean;
  vote: VoteCallback | null;
  loadVoteResult: boolean;
  voteResult: Result | null;
};

const initialState: TopicState = {
  loadTopics: false,
  topics: [],
  loadSession: false,
  session: null,
  loadVote: false,
  vote: null,
  loadVoteResult: false,
  voteResult: null,
};

const possibleStatus = {
  pending: "Aguardando Abertura",
  open: "Sessão aberta",
  close: "Sessão encerrada",
};

const topicSlicer = createSlice({
  name: "topic",
  initialState,
  reducers: {
    setLoadTopics(state, action: PayloadAction<boolean>) {
      state.loadTopics = action.payload;
    },
    setTopics(state, action: PayloadAction<TopicListCallback>) {
      state.topics = action.payload.map((topic) => ({
        ...topic,
        status:
          possibleStatus[topic.status as keyof typeof possibleStatus] ||
          topic.status,
      }));
    },
    addTopic(state, action: PayloadAction<TopicListCallback[number]>) {
      state.topics = [action.payload, ...(state.topics || [])];
    },
    setLoadSession(state, action: PayloadAction<boolean>) {
      state.loadSession = action.payload;
    },
    setSession(state, action: PayloadAction<SessionCallback | null>) {
      state.session = action.payload;
    },
    updateTopicStatus(state, action: PayloadAction<SessionCallback>) {
      if (!state.topics || !action.payload) return;
      state.topics = state.topics.map((topic) => {
        if (topic.id === action.payload.topic_id) {
          return {
            ...topic,
            status: possibleStatus[action.payload.status],
          };
        }
        return topic;
      });
    },
    setLoadVote(state, action: PayloadAction<boolean>) {
      state.loadVote = action.payload;
    },
    setVote(state, action: PayloadAction<VoteCallback | null>) {
      state.vote = action.payload;
    },
    setLoadVoteResult(state, action: PayloadAction<boolean>) {
      state.loadVoteResult = action.payload;
    },
    setVoteResult(state, action: PayloadAction<Result | null>) {
      state.voteResult = action.payload;
    },
  },
});

export const {
  setLoadTopics,
  setTopics,
  addTopic,
  setLoadSession,
  setSession,
  updateTopicStatus,
  setLoadVote,
  setVote,
  setLoadVoteResult,
  setVoteResult,
} = topicSlicer.actions;
export const topicReducer = topicSlicer.reducer;
