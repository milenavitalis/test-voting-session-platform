import ErrorLayout from "@/layouts/error-layout";
import LoginLayout from "@/layouts/login-layout";
import RegisterLayout from "@/layouts/register-layout";
import ProtectedRoute from "./protected-route";

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
    element: <ProtectedRoute Element={() => <div>Home</div>} />,
    children: [
      {
        path: "dashboard",
        element: <ProtectedRoute Element={() => <div>Dashboard</div>} />,
      },
      {
        path: "create-session",
        element: <ProtectedRoute Element={() => <div>Create Session</div>} />,
      },
      {
        path: "create-agenda",
        element: <ProtectedRoute Element={() => <div>Create Agenda</div>} />,
      },
      {
        path: "topics",
        element: <ProtectedRoute Element={() => <div>Topics</div>} />,
      },
      {
        path: "topics/:id/vote",
        element: <ProtectedRoute Element={() => <div>Vote on Topic</div>} />,
      },
      {
        path: "topics/:id/result",
        element: <ProtectedRoute Element={() => <div>Results</div>} />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorLayout />,
  },
];
