import { configureStore } from "@reduxjs/toolkit";
import { loginReducer } from "@/logic/login/slice";
import { userReducer } from "@/logic/user/slice";
import { topicReducer } from "@/logic/topic/slice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    user: userReducer,
    topic: topicReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
