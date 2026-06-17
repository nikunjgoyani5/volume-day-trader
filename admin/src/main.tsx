import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "@/App";
import { AlertDialogProvider } from "@/components/ui/alert-dialog-provider";
import { store } from "@/redux/store";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <AlertDialogProvider>
        <App />
      </AlertDialogProvider>
    </Provider>
  </StrictMode>,
);
