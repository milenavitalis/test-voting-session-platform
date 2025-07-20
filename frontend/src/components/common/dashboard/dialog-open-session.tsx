import { useState } from "react";
import { useDispatch } from "react-redux";
import { TopicCallback } from "@/common/schemas";
import SimpleDialog from "@/components/common/simple-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import * as actions from "@/logic/topic/actions";

interface DialogOpenSessionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: TopicCallback;
}

const DialogOpenSession = ({ open, setOpen, item }: DialogOpenSessionProps) => {
  const dispatch = useDispatch();
  const [duration, setDuration] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenSession = () => {
    actions.openVotingSession(
      { duration_minutes: duration, topic_id: item.id },
      () => handleClose()
    )(dispatch);
  };

  return (
    <SimpleDialog
      open={open}
      setOpen={setOpen}
      title="Abrir sessão de votação"
      description="Adicionar uma nova sessão de votação do tópico"
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-3">
          <Label htmlFor="duration_minutes">Duração (em minutos)</Label>
          <Input
            id="duration_minutes"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
          <Button onClick={handleOpenSession}>Salvar</Button>
        </div>
      </div>
    </SimpleDialog>
  );
};

export default DialogOpenSession;
