export type AuthenticateResponse = {
  token: string;
  refreshToken: string;

  // optional
  email?: string;
  firstName?: string;
  userType?: string;
  lastName?: string;
  storeName?: string;
  storeId?: number;
};
