import type { ZodObject, ZodArray } from "zod";
import { $ZodError } from "zod/v4/core";
import type { ApiError, Callback } from "@/common/schemas/types";

export function validateApiError(
  zodSchema: ZodObject | ZodArray,
  callback: Callback<any>
) {
  return (data: unknown, error?: ApiError) => {
    if (error) return callback(undefined, error);

    try {
      const validated = zodSchema.parse(data);
      return callback(validated);
    } catch (error: unknown) {
      if (error instanceof $ZodError) {
        handleZodError(error, callback);
      } else {
        callback(undefined, { msg: "Erro desconhecido", details: error });
      }
    }
  };
}

export function handleZodError(error: $ZodError, callback: Callback<any>) {
  console.error("ZodError", error.issues);
  callback(undefined, {
    msg: "Erro ao validar dados",
  });
}
