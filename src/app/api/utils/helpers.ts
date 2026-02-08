// API request helper utilities
export const REQUIRED_HEADERS = {
  Language: "English",
  storeId: "1",
  ratio: "1500",
} as const;

//Check if request is to login endpoint
export function isLoginRequest(url?: string): boolean {
  return (url ?? "").includes("/Accounts/authenticate");
}

// Check if request is to refresh token endpoint
export function isRefreshRequest(url?: string): boolean {
  return (url ?? "").includes("/Accounts/refresh-token");
}

// Check if request is an auth-related endpoint
export function isAuthEndpoint(url?: string): boolean {
  return isLoginRequest(url) || isRefreshRequest(url);
}
