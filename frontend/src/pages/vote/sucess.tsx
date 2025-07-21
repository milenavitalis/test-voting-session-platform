// app/success/page.tsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleRedirectResults = () => {
    [navigate("/home/result")];
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-4xl font-bold text-center">Parabéns!</h1>
      <p className="text-lg text-center">
        Seu voto foi registrado com sucesso.
      </p>
      <Button className="mt-4" onClick={handleRedirectResults}>
        Ver resultados
      </Button>
    </div>
  );
};

export default SuccessPage;
