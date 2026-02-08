export { http } from "./client";
export { setupAuthInterceptors } from "./interceptors";

// API type
export type ApiError = {
  status?: number;
  data?: unknown;
  message?: string;
};
