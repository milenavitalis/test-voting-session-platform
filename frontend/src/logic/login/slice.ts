import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type LoginState = {
  loadLogin: boolean;
  token: string | null;
};

const initialState: LoginState = {
  loadLogin: false,
  token: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoadLogin(state, action: PayloadAction<boolean>) {
      state.loadLogin = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
  },
});

export const { setLoadLogin, setToken } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
