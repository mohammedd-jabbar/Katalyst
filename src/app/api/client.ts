import axios from "axios";
import { env } from "../../lib/config/env";

// define the api URL
const baseURL = env.apiBaseUrl;

// Base HTTP client for all API requests
export const http = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
