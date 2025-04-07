import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { AdminAuthProvider } from "./context/AdminAuthContext";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <AdminAuthProvider>
          <App />
        </AdminAuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}
