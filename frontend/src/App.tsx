import { useEffect, useState, useRef } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "@/routes";
import BubbleLoader from "@/components/layouts/loader";
import { loginByToken } from "@/logic/login/actions";
import type { RootState } from "./logic/reducer";
import { toast } from "sonner";
import cloud from "@/infra/cloud";

function App() {
  const dispatch = useDispatch();
  const loadLogin = useSelector((state: RootState) => state.login.loadLogin);
  const token = useSelector((state: RootState) => state.login.token);
  const [checkingToken, setCheckingToken] = useState(true);
  const router = createBrowserRouter(routes);
  const hasCalledLoginByToken = useRef(false);

  useEffect(() => {
    const cookieToken = cloud.getTokenUser();

    const checkAuth = async () => {
      if (!token && cookieToken && !hasCalledLoginByToken.current) {
        hasCalledLoginByToken.current = true;
        loginByToken(() => {
          setCheckingToken(false);
        })(dispatch);
        return;
      }

      if (
        !token &&
        !cookieToken &&
        !window.location.pathname.match(/\/auth\//) &&
        !window.location.pathname.match(/\/register\//)
      ) {
        toast.error("Direcionado para a página de login");

        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 5000);
      } else {
        setCheckingToken(false);
      }
    };

    checkAuth();
  }, [dispatch, token]);

  if (loadLogin || checkingToken) {
    return <BubbleLoader />;
  }

  return <RouterProvider router={router} />;
}

export default App;
