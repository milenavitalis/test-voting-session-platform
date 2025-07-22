import ErrorLayout from "@/layouts/error-layout";
import LoginLayout from "@/layouts/login-layout";
import RegisterLayout from "@/layouts/register-layout";
import ProtectedRoute from "./protected-route";
import MainLayout from "@/layouts/main-layout";
import Dashboard from "@/pages/dashboard";
import Vote from "@/pages/vote";
import SuccessPage from "@/pages/vote/sucess";
import Results from "@/pages/results";
import ResultVote from "@/pages/result-vote";

export const routes = [
  {
    path: "/auth/login",
    element: <LoginLayout />,
  },
  {
    path: "/auth/register",
    element: <RegisterLayout />,
  },
  {
    path: "/home",
    element: <ProtectedRoute Element={() => <MainLayout />} />,
    children: [
      {
        path: "dashboard",
        element: <ProtectedRoute Element={() => <Dashboard />} />,
      },
      {
        path: "vote",
        element: <ProtectedRoute Element={() => <Vote />} />,
      },
      {
        path: "result",
        element: <ProtectedRoute Element={() => <Results />} />,
      },
      {
        path: "result/:topic_id",
        element: <ProtectedRoute Element={() => <ResultVote />} />,
      },
      {
        path: "success",
        element: <ProtectedRoute Element={() => <SuccessPage />} />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorLayout />,
  },
];
