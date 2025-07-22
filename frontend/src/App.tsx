import { useEffect, useState, useRef } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "@/routes";
import BubbleLoader from "@/components/layouts/loader";
import type { RootState } from "./logic/reducer";
import { toast } from "sonner";
import cloud from "@/infra/cloud";
import { setToken } from "./logic/login/slice";

function App() {
  const dispatch = useDispatch();
  const loadLogin = useSelector((state: RootState) => state.login.loadLogin);
  const token = useSelector((state: RootState) => state.login.token);
  const [checkingToken, setCheckingToken] = useState(true);
  const router = createBrowserRouter(routes);

  useEffect(() => {
    const cookieToken = cloud.getTokenUser();
    if (
      !cookieToken &&
      !window.location.pathname.match(/\/auth\//) &&
      !window.location.pathname.match(/\/register\//)
    ) {
      toast.error("Você precisa estar logado para acessar esta página.");

      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 4000);
    } else {
      if (cookieToken) {
        dispatch(setToken(cookieToken));
      }
      setCheckingToken(false);
    }
  }, []);

  if (loadLogin || checkingToken) {
    return <BubbleLoader />;
  }

  return <RouterProvider router={router} />;
}

export default App;
