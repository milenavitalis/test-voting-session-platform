import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "@/logic/reducer";

type ProtectedRouteProps = {
  Element: React.ElementType;
};

const ProtectedRoute = ({ Element }: ProtectedRouteProps) => {
  const token = useSelector((state: RootState) => state.login.token);

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Element />;
};

export default ProtectedRoute;
