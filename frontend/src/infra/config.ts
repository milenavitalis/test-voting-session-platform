// const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export function getApiHost(endpoint: string): string {
  const baseUrl = API_BASE_URL || "http://localhost:8000";
  return `${baseUrl}/${endpoint}`;
}
