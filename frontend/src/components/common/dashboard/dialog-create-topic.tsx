import { useState } from "react";
import { useDispatch } from "react-redux";
import SimpleDialog from "@/components/common/simple-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import * as actions from "@/logic/topic/actions";

interface DialogCreateTopicProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogCreateTopic = ({ open, setOpen }: DialogCreateTopicProps) => {
  const dispatch = useDispatch();
  const [config, setConfig] = useState({ title: "", description: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "title" | "description"
  ) => {
    const { value } = e.target;
    setConfig((prev) => ({ ...prev, [type]: value }));
  };

  const disabled = !config.title.trim() || !config.description.trim();

  const handleCreateTopic = () => {
    actions.createTopic(
      { title: config.title, description: config.description },
      () => handleClose()
    )(dispatch);
  };

  const handleClose = () => {
    setOpen(false);
    setConfig({ title: "", description: "" });
  };

  return (
    <SimpleDialog
      title="Criar Tópico"
      description="Preencha os detalhes do novo tópico"
      showCloseButton={true}
      open={open}
      setOpen={setOpen}
      maxWidth="md"
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-3">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            required
            value={config.title}
            onChange={(e) => handleChange(e, "title")}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            required
            value={config.description}
            onChange={(e) => handleChange(e, "description")}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
          <Button disabled={disabled} onClick={handleCreateTopic}>
            Salvar
          </Button>
        </div>
      </div>
    </SimpleDialog>
  );
};
export default DialogCreateTopic;
