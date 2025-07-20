import { User } from "@/common/schemas";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  loadUser: boolean;
  user: User;
};

const initialState: UserState = {
  loadUser: false,
  user: {
    id: "",
    name: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoadUser(state, action: PayloadAction<boolean>) {
      state.loadUser = action.payload;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = {
        id: "",
        name: "",
      };
    },
  },
});

export const { setLoadUser, setUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
