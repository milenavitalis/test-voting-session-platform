import * as Worker from "./worker";
import * as UserSlice from "@/logic/user/slice";
import * as LoginSlice from "@/logic/login/slice";
import { type Login } from "@/common/schemas/login";
import { cleanCpf } from "@/common/utils/formatWord";

import type { AppDispatch } from "@/logic/reducer";
import cloud from "@/infra/cloud";

export const login = (data: Login) => (dispatch: AppDispatch) => {
  dispatch(LoginSlice.setLoadLogin(true));

  const { cpf, password } = data || {};
  try {
    const cleanedCpf = cleanCpf(cpf);
    if (!cleanedCpf) {
      throw new Error("Invalid CPF format");
    }
    Worker.login({ cpf: cleanedCpf, password }, (response, error) => {
      dispatch(LoginSlice.setLoadLogin(false));
      if (error || !response) {
        return logoutAndClearUser()(dispatch);
      }
      dispatch(UserSlice.setUser(response.user));
      dispatch(LoginSlice.setToken(response.token));

      cloud.setTokenUser(response.token);
    });
  } catch (error) {
    logoutAndClearUser()(dispatch);
  }
};

export const loginByToken =
  (callback?: () => void) => (dispatch: AppDispatch) => {
    dispatch(LoginSlice.setLoadLogin(true));
    Worker.loginByToken((response, error) => {
      dispatch(LoginSlice.setLoadLogin(false));
      if (error || !response) {
        cloud.setTokenUser(undefined);
        dispatch(LoginSlice.setToken(null));
        return logout()(dispatch);
      }
      dispatch(UserSlice.setUser(response.user));
      dispatch(LoginSlice.setToken(response.token));

      cloud.setTokenUser(response.token);
      if (callback) callback();
    });
  };

export const logout = () => (dispatch: AppDispatch) => {
  return logoutAndClearUser()(dispatch);
};

const logoutAndClearUser = () => (dispatch: AppDispatch) => {
  dispatch(LoginSlice.setLoadLogin(false));
  dispatch(LoginSlice.setToken(null));
  dispatch(UserSlice.clearUser());
  cloud.setTokenUser(undefined);
};
