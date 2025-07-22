import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/logic/reducer";
import SelectTopic from "@/components/common/vote/select-topic";
import SelectVote from "@/components/common/vote/select-vote";
import { Button } from "@/components/ui/button";
import * as actions from "@/logic/topic/actions";

const Vote = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { topics, loadVote } = useSelector((state: RootState) => state.topic);
  const [value, setValue] = useState<{
    topic_id: number | null;
    vote: "Sim" | "Não" | "";
  }>({
    topic_id: null,
    vote: "",
  });

  useEffect(() => {
    if (!topics || topics.length === 0) actions.getTopics(() => {})(dispatch);
  }, [dispatch]);

  const handleSaveVote = () => {
    if (!value.topic_id || !value.vote) return;
    actions.createVote(
      { topic_id: value.topic_id, vote: value.vote },
      (res, error) => {
        if (res) {
          navigate("/home/success");
        }
      }
    )(dispatch);
  };

  return (
    <div className="p-4 gap-8 flex flex-col min-h-screen">
      <div className="gap-3 flex flex-col">
        <div className="font-semibold">Selecione o tópico para votação:</div>
        <SelectTopic value={value} setValue={setValue} />
      </div>
      <div className="gap-3 flex flex-col">
        <div className="font-semibold">Escolha o seu voto:</div>
        <SelectVote value={value} setValue={setValue} />
      </div>
      <Button
        disabled={!value.topic_id || !value.vote || loadVote}
        onClick={handleSaveVote}
      >
        Salvar
      </Button>
    </div>
  );
};

export default Vote;
