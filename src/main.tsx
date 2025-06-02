import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";

import App from "./App.tsx";
import GlobalErrorPage from "./GlobalErrorPage.tsx";
import { GlobalErrorProvider } from "./GlobalErrorProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallbackRender={() => <GlobalErrorPage />}>
      <GlobalErrorProvider>
        <App />
      </GlobalErrorProvider>
    </ErrorBoundary>
  </StrictMode>,
);
