import type { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../../../features/auth/store/useAuthStore";
import {
  REQUIRED_HEADERS,
  isLoginRequest,
  isRefreshRequest,
} from "../utils/helpers";

/**
 * Request interceptor that adds authentication headers
 *
 * Attaches:
 * - Authorization: Bearer token
 * - Custom headers: Language, storeId, ratio
 */
export function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const url = config.url ?? "";
  const { token } = useAuthStore.getState();

  // Initialize headers
  config.headers = config.headers ?? {};

  // Login endpoint: minimal headers
  if (isLoginRequest(url)) {
    return config;
  }

  // Add required custom headers
  config.headers["Language"] = REQUIRED_HEADERS.Language;
  config.headers["storeId"] = REQUIRED_HEADERS.storeId;
  config.headers["ratio"] = REQUIRED_HEADERS.ratio;

  // Skip auth header for refresh endpoint
  if (isRefreshRequest(url)) {
    return config;
  }

  // Add JWT for authenticated requests
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
}
