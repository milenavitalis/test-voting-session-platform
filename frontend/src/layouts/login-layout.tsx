import React from "react";
import { Outlet } from "react-router-dom";
import { LoginForm } from "@/components/common/login-form";

const LoginLayout: React.FC = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginLayout;
