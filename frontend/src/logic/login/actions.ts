import * as Worker from "./worker";
import * as UserSlice from "@/logic/user/slice";
import * as LoginSlice from "@/logic/login/slice";
import { type Register, type Login } from "@/common/schemas/login";
import { cleanCpf } from "@/common/utils/formatWord";
import { toast } from "sonner";

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
      dispatch(UserSlice.setUser(response));
      dispatch(LoginSlice.setToken(response.access_token));

      cloud.setTokenUser(response.access_token);
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
      dispatch(UserSlice.setUser(response));
      dispatch(LoginSlice.setToken(response.access_token));

      cloud.setTokenUser(response.access_token);
      if (callback) callback();
    });
  };

export const logout = () => (dispatch: AppDispatch) => {
  return logoutAndClearUser()(dispatch);
};

const logoutAndClearUser = () => (dispatch: AppDispatch) => {
  toast.error("Erro ao fazer login, tente novamente");
  dispatch(LoginSlice.setLoadLogin(false));
  dispatch(LoginSlice.setToken(null));
  dispatch(UserSlice.clearUser());
  cloud.setTokenUser(undefined);
};

export const register = (data: Register) => (dispatch: AppDispatch) => {
  dispatch(LoginSlice.setLoadRegister(true));
  console.log("Registering user with data:", data);

  Worker.register(data, (response, error) => {
    dispatch(LoginSlice.setLoadRegister(false));
    if (error || !response) {
      return logoutAndClearUser()(dispatch);
    }
    dispatch(UserSlice.setUser(response));
    dispatch(LoginSlice.setToken(response.access_token));

    cloud.setTokenUser(response.access_token);
  });
};
