export type ApiError = {
  msg: string;
  code?: number;
  details?: unknown;
};

export type Callback<T> = (data?: T, error?: ApiError) => void;
