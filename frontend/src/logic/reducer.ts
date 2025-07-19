import { configureStore } from "@reduxjs/toolkit";
import { loginReducer } from "@/logic/login/slice";
import { userReducer } from "@/logic/user/slice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
