import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import LogRocket from "logrocket";

// Check localStorage flag
const shouldEnableLogRocket =
  localStorage.getItem("logrocketEnabled") === "false";

// Conditionally initialize LogRocket
if (shouldEnableLogRocket) {
  LogRocket.init("ocet2n/codein");
} else {
  console.log("LogRocket is disabled. Enable it by setting localStorage.");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
