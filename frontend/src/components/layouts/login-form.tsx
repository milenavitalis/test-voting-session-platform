import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RootState, AppDispatch } from "@/logic/reducer";
import { cleanCpf, isValidCpf } from "@/common/utils/formatWord";
import * as actions from "@/logic/login/actions";

interface LoginFormProps {
  className?: string;
  value?: string;
}

export function LoginForm({ className, value, ...props }: LoginFormProps) {
  const [cpf, setCpf] = useState(value || "");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loadLogin } = useSelector((state: RootState) => state.login);
  const disabled =
    loadLogin || !isValidCpf(cpf) || !password.trim() || password.length < 6;

  const formatCpf = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const formatted = formatCpf(newValue);
    setCpf(formatted);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSignUpNavigate = () => {
    navigate("/auth/register");
  };

  const handleSubmit = () => {
    actions.login({ cpf: cleanCpf(cpf), password }, () =>
      navigate("/home/dashboard")
    )(dispatch);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Entre na sua conta</CardTitle>
          <CardDescription>
            Digite seu CPF abaixo para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  required
                  value={cpf}
                  onChange={handleCpfChange}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  min={6}
                  placeholder="*********"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={disabled}
                >
                  Entrar
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={handleSignUpNavigate}
                className="text- cursor-pointer hover:underline "
              >
                Inscreva-se
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
