import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Add this
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import "./index.css";
import LogRocket from "logrocket";

const shouldEnableLogRocket =
  localStorage.getItem("logrocketEnabled") === "false";

if (shouldEnableLogRocket) {
  LogRocket.init("ocet2n/codein");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
