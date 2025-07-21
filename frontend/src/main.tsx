import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "@/logic/reducer";
import { Toaster } from "@/components/ui/sonner";
import cloud from "@/infra/cloud";
import { setToken as setLoginToken } from "@/logic/login/slice";
import { clearUser } from "@/logic/user/slice";
import { toast } from "sonner";
import "./index.css";

let alreadyRedirecting = false;

cloud.registerUnauthorizedHandler(() => {
  if (alreadyRedirecting) return;
  alreadyRedirecting = true;

  store.dispatch(setLoginToken(null));
  store.dispatch(clearUser());
  toast.error("Sessão expirada. Faça login novamente.");

  setTimeout(() => {
    window.location.href = "/auth/login";
  }, 2000);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster />
      <App />
    </Provider>
  </React.StrictMode>
);
