import React from "react";
import { RegisterForm } from "@/components/layouts/register-form";

const RegisterLayout: React.FC = () => {
  console.log("teste");
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterLayout;
