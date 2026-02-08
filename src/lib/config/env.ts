export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  dev: import.meta.env.DEV as boolean,
};

if (!env.apiBaseUrl) {
  // fail fast in dev
  console.warn("Missing VITE_API_BASE_URL in .env");
}
