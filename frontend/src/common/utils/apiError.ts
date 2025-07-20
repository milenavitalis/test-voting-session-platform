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
      toastError();
      return callback(undefined, error);
    }

    try {
      const validated = zodSchema.parse(data);
      return callback(validated);
    } catch (error: unknown) {
      if (error instanceof $ZodError) {
        toastError();
        handleZodError(error, callback);
      } else {
        toastError();
        callback(undefined, { msg: "Erro desconhecido", details: error });
      }
    }
  };
}

export function handleZodError(error: $ZodError, callback: Callback<any>) {
  callback(undefined, {
    msg: "Erro ao validar dados",
  });
}

const toastError = () => {
  toast.error("Ocorreu um erro");
};
