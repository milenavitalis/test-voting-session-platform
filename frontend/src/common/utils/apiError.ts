import type { ZodObject, ZodArray } from "zod";
import { $ZodError } from "zod/v4/core";
import type { ApiError, Callback } from "@/common/schemas/types";
import { toast } from "sonner";

export function validateApiError(
  zodSchema: ZodObject | ZodArray,
  callback: Callback<any>
) {
  return (data: unknown, error?: ApiError) => {
    if (error) {
      console.log("error -->", error);
      toastError(error.detail);
      return callback(undefined, error);
    }

    try {
      const validated = zodSchema.parse(data);
      return callback(validated);
    } catch (error: unknown) {
      if (error instanceof $ZodError) {
        console.log("error", error.message);
        toastError();
        handleZodError(error, callback);
      } else {
        toastError();
        callback(undefined, { detail: "Erro desconhecido" });
      }
    }
  };
}

export function handleZodError(error: $ZodError, callback: Callback<any>) {
  callback(undefined, {
    detail: "Erro ao validar dados",
  });
}

const toastError = (msg?: string) => {
  toast.error(msg || "Ocorreu um erro");
};
