import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "./app/providers";
import { setupAuthInterceptors } from "./app/api/interceptors/index";
import "./index.css";

setupAuthInterceptors();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
);
