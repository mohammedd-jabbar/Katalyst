import { http } from "../client";
import { authRequestInterceptor } from "./authInterceptor";
import { refreshTokenInterceptor } from "./refreshInterceptor";

// Attach interceptors only once (prevents duplicates in StrictMode/HMR).
let interceptorsAttached = false;

// Should be called once at app initialization
export function setupAuthInterceptors() {
  if (interceptorsAttached) return;
  interceptorsAttached = true;

  // Attach request interceptor
  http.interceptors.request.use(authRequestInterceptor);

  // Attach response interceptor
  http.interceptors.response.use(
    (response) => response,
    refreshTokenInterceptor,
  );
}
