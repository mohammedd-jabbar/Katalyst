import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../../../features/auth/store/useAuthStore";
import { refreshTokenApi } from "../../../features/auth/api/authApi";
import { http } from "../client";
import { isLoginRequest, isRefreshRequest } from "../utils/helpers";
import type { AuthenticateResponse } from "../../../features/auth/api/types";
import { router } from "../../router";

// Shared promise to prevent concurrent refresh attempts
let refreshPromise: Promise<string> | null = null;

/**
 * Response interceptor that handles token refresh on 401 errors
 *
 * Flow:
 * 1. Catch 401 errors
 * 2. Attempt token refresh
 * 3. Retry original request with new token
 * 4. Logout if refresh fails
 */
export async function refreshTokenInterceptor(error: AxiosError) {
  const status = error.response?.status;
  const originalRequest = error.config as
    | (InternalAxiosRequestConfig & { _retry?: boolean })
    | undefined;

  if (!originalRequest) {
    return Promise.reject(error);
  }

  const url = originalRequest.url ?? "";

  // Only handle 401 for non-auth endpoints, and don't retry twice
  const shouldSkip =
    status !== 401 ||
    originalRequest._retry ||
    isLoginRequest(url) ||
    isRefreshRequest(url);

  if (shouldSkip) {
    return Promise.reject(error);
  }

  // Mark as retried
  originalRequest._retry = true;

  const { token, refreshToken, setAuth, logout } = useAuthStore.getState();

  // No refresh token available
  if (!refreshToken) {
    logout();
    router.navigate("/login", { replace: true });
    return Promise.reject(error);
  }

  // Use shared promise for concurrent requests
  if (!refreshPromise) {
    refreshPromise = performTokenRefresh(token, refreshToken, setAuth, logout);
  }

  try {
    const newToken = await refreshPromise;

    // Retry with new token
    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

    return http(originalRequest);
  } catch (refreshError) {
    // Logout on refresh failure
    useAuthStore.getState().logout();
    router.navigate("/login", { replace: true });
    return Promise.reject(refreshError);
  }
}

// Perform the actual token refresh
async function performTokenRefresh(
  token: string | null,
  refreshToken: string,

  setAuth: (data: AuthenticateResponse) => void,
  logout: () => void,
): Promise<string> {
  try {
    const data = await refreshTokenApi({ token, refreshToken });
    setAuth(data);
    return data.token;
  } catch (error) {
    logout();
    throw error;
  } finally {
    refreshPromise = null;
  }
}
