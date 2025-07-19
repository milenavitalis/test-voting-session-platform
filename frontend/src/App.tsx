import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "@/routes";
import BubbleLoader from "@/components/layouts/loader";
import { loginByToken } from "@/logic/login/actions";
import type { RootState } from "./logic/reducer";

function App() {
  const dispatch = useDispatch();
  const loadLogin = useSelector((state: RootState) => state.login.loadLogin);
  const token = useSelector((state: RootState) => state.login.token);

  const router = createBrowserRouter(routes);

  useEffect(() => {
    loginByToken(() => {})(dispatch);
  }, [dispatch]);

  if (loadLogin) {
    return <BubbleLoader />;
  }

  return <RouterProvider router={router} />;
}

export default App;
