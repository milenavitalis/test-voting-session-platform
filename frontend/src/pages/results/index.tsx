import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/logic/reducer";
import { TopicCallback } from "@/common/schemas";
import TableWithDividers from "@/components/common/table-with-dividers";
import Header from "@/components/common/header";
import * as actions from "@/logic/topic/actions";

const Results = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { topics } = useSelector((state: RootState) => state.topic);

  const closeTopics = topics.filter(
    (topic) => topic.status === "Sessão encerrada"
  );

  useEffect(() => {
    if (!topics || topics.length === 0) actions.getTopics(() => {})(dispatch);
  }, [dispatch]);

  const headerOptions = [
    { label: "ID", value: "id" },
    { label: "Tópico", value: "title" },
    { label: "Descrição", value: "description" },
    { label: "Status", value: "status" },
  ];

  const rowOptions = closeTopics.map((topic: any) => ({
    id: topic.id,
    title: topic.title,
    description: topic.description || "-",
    status: topic.status,
  }));

  const handleSelectTopic = (topic: TopicCallback) => {
    actions.getVoteResult(topic.id, (res, error) => {
      if (res) {
        navigate(`/home/result/${topic.id}`);
      }
    })(dispatch);
  };

  return (
    <div className="p-4 gap-3 flex flex-col min-h-screen">
      <Header
        title="Tópicos com sessão encerrada"
        description="Selecione um tópico para visualizar a votação"
      />
      <TableWithDividers
        headerOptions={headerOptions}
        rowOptions={rowOptions}
        onClick={handleSelectTopic}
      />
    </div>
  );
};

export default Results;
