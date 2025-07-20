import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type LoginState = {
  loadLogin: boolean;
  loadRegister?: boolean;
  token: string | null;
};

const initialState: LoginState = {
  loadLogin: false,
  loadRegister: false,
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
    setLoadRegister(state, action: PayloadAction<boolean>) {
      state.loadLogin = action.payload;
    },
  },
});

export const { setLoadLogin, setToken, setLoadRegister } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
