export type ApiError = {
  code?: number;
  detail?: string;
};

export type Callback<T> = (data?: T, error?: ApiError) => void;
