import type { AuthenticateResponse } from "./types";
import { http } from "../../../app/api/index";

export async function loginApi(username: string, password: string) {
  const { data } = await http.post<AuthenticateResponse>(
    "/Accounts/authenticate",
    {
      username,
      password,
    },
  );

  if (!data?.token || !data?.refreshToken) {
    throw new Error("Login response missing token/refreshToken");
  }
  return data;
}

export async function refreshTokenApi(payload: {
  token: string | null;
  refreshToken: string;
}) {
  // Send both to be safe across backend expectations.
  // Many backends ignore extra fields.
  const { data } = await http.post<AuthenticateResponse>(
    "/Accounts/refresh-token",
    payload,
  );

  if (!data?.token || !data?.refreshToken) {
    throw new Error("Refresh response missing token/refreshToken");
  }
  return data;
}
