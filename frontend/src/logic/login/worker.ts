import cloud from "@/infra/cloud";
import {
  Login,
  LoginCallbackSchema,
  LoginSchema,
  RegisterCallbackSchema,
  RegisterSchema,
  type LoginCallback,
} from "@/common/schemas/login";
import { Callback } from "@/common/schemas/types";
import { handleZodError } from "@/common/utils/apiError";

export function login(data: Login, callback: Callback<LoginCallback>) {
  const { data: parsedData, success, error } = LoginSchema.safeParse(data);

  if (!success) return handleZodError(error, callback);

  const { cpf, password } = parsedData;

  cloud.post("v1/login", { cpf, password }, callback, LoginCallbackSchema);
}

export function loginByToken(callback: Callback<LoginCallback>) {
  const token = cloud.getTokenUser();

  if (!token) {
    return callback(undefined, { msg: "Token não encontrado" });
  }

  cloud.get("v1/login/token", { token }, callback, LoginCallbackSchema);
}

export function register(data: Login, callback: Callback<LoginCallback>) {
  const { data: parsedData, success, error } = RegisterSchema.safeParse(data);

  if (!success) return handleZodError(error, callback);

  const { name, cpf, password } = parsedData;

  cloud.post(
    "v1/register",
    { name, cpf, password },
    callback,
    RegisterCallbackSchema
  );
}
