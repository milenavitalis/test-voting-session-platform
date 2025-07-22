import { ZodObject, ZodArray } from "zod";
import Cookie from "js-cookie";
import { Callback } from "@/common/schemas/types";
import { validateApiError } from "@/common/utils/apiError";
import { getApiHost } from "@/infra/config";

type UnauthorizedHandler = () => void;
class Cloud {
  private tokenUser: string | null;
  private onUnauthorized: UnauthorizedHandler | null = null;

  constructor() {
    this.tokenUser = Cookie.get("tokenUser") || null;
  }
  public registerUnauthorizedHandler(fn: UnauthorizedHandler) {
    this.onUnauthorized = fn;
  }

  public getTokenUser() {
    return this.tokenUser;
  }
  public setTokenUser(token: string | null) {
    this.tokenUser = token ?? null;

    if (token) {
      Cookie.set("tokenUser", token, { expires: 1 });
    } else {
      Cookie.remove("tokenUser");
    }
  }

  public get(
    endpoint: string,
    data: Record<string, unknown>,
    callback: Callback<unknown>
  ): void;
  public get<T>(
    endpoint: string,
    data: Record<string, unknown>,
    callback: Callback<T>,
    schema: ZodObject | ZodArray
  ): void;
  public get<T>(
    endpoint: string,
    data: Record<string, unknown>,
    callback: Callback<T>,
    schema?: ZodObject | ZodArray
  ) {
    this.request("GET", endpoint, data, callback, schema);
  }

  public post(
    endpoint: string,
    data: Record<string, unknown>,
    callback: Callback<unknown>
  ): void;
  public post<T>(
    endpoint: string,
    data: Record<string, unknown>,
    callback: Callback<T>,
    schema: ZodObject
  ): void;
  public post<T>(
    endpoint: string,
    data: Record<string, unknown>,
    callback: Callback<T>,
    schema?: ZodObject
  ) {
    this.request("POST", endpoint, data, callback, schema);
  }
  public put(
    endpoint: string,
    data: Record<string, unknown>,
    callback: Callback<unknown>
  ): void;
  public put<T>(
    endpoint: string,
    data: Record<string, unknown>,
    callback: Callback<T>,
    schema: ZodObject
  ): void;
  public put<T>(
    endpoint: string,
    data: Record<string, unknown>,
    callback: Callback<T>,
    schema?: ZodObject
  ) {
    this.request("PUT", endpoint, data, callback, schema);
  }

  public delete(
    endpoint: string,
    data: Record<string, unknown>,
    callback: Callback<unknown>
  ): void;
  public delete<T>(
    endpoint: string,
    data: Record<string, unknown>,
    callback: Callback<T>,
    schema: ZodObject
  ): void;
  public delete<T>(
    endpoint: string,
    data: Record<string, unknown>,
    callback: Callback<T>,
    schema?: ZodObject
  ) {
    this.request("DELETE", endpoint, data, callback, schema);
  }

  private getDefaultHeaders(endpoint: string) {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const tokenUser = this.getTokenUser();

    if (tokenUser) {
      headers["Authorization"] = `Bearer ${tokenUser}`;
    }
    return headers;
  }

  private request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data: Record<string, unknown> = {},
    callback: Callback<T>,
    schema?: ZodObject | ZodArray
  ) {
    let url = `${getApiHost()}/${endpoint}`;
    const headers = this.getDefaultHeaders(endpoint);

    const config: RequestInit = {
      method,
      headers,
    };

    if (method === "GET" && data) {
      const queryParams = new URLSearchParams();
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined) {
          queryParams.append(key, data[key] as string);
        }
      }
      url += `?${queryParams.toString()}`;
    } else if (data) {
      config.body = JSON.stringify(data);
    }

    const finalCallback = schema
      ? validateApiError(schema, callback)
      : callback;

    fetch(url, config)
      .then((response) =>
        response
          .json()
          .then((data) => {
            console.log("response", data);

            if (!response.ok) {
              if (response.status === 401) {
                this.setTokenUser(null);
                this.onUnauthorized?.();
              } else {
                finalCallback(undefined, data);
              }
            } else {
              finalCallback(data);
            }
          })
          .catch((error) => {
            console.log("error1", error);

            finalCallback(undefined, { detail: "Erro ao processar resposta" });
          })
      )
      .catch((error) => {
        console.log("error2", error);

        finalCallback(undefined, { detail: "Erro ao processar resposta" });
      });
  }
}

const cloud = new Cloud();
export default cloud;
