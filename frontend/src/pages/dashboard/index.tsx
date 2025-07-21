import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/logic/reducer";
import { Button } from "@/components/ui/button";
import DashboardTable from "@/components/common/table-with-dividers";
import DialogCreateTopic from "@/components/common/dashboard/dialog-create-topic";
import DialogOpenSession from "@/components/common/dashboard/dialog-open-session";
import { formatDate } from "@/components/utils";
import { TopicCallback } from "@/common/schemas";
import * as actions from "@/logic/topic/actions";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [openCreateTopicModal, setOpenCreateTopicModal] = useState(false);
  const [openSession, setOpenSession] = useState(false);
  const [item, setItem] = useState<TopicCallback | null>(null);
  const topics = useSelector((state: RootState) => state.topic.topics);

  const headerOptions = [
    { label: "ID", value: "id" },
    { label: "Tópico", value: "title" },
    { label: "Descrição", value: "description" },
    { label: "Status", value: "status" },
    { label: "Criado em:", value: "created_at" },
  ];
  const rowOptions = topics.map((topic: any) => ({
    id: topic.id,
    title: topic.title,
    description: topic.description || "-",
    status: topic.status,
    created_at: topic.created_at ? formatDate(topic.created_at) : "-",
    disabled: topic.status === "Sessão aberta",
  }));

  const handleSelectTopic = (item: TopicCallback) => {
    setOpenSession(true);
    setItem(item);
  };

  const handleCreateTopic = () => {
    setOpenCreateTopicModal(true);
  };

  useEffect(() => {
    actions.getTopics(() => {})(dispatch);
  }, [dispatch]);

  return (
    <div className="p-4 gap-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={handleCreateTopic}
        >
          Criar novo tópico
        </Button>
      </div>
      <DashboardTable
        headerOptions={headerOptions}
        rowOptions={rowOptions}
        onClick={handleSelectTopic}
      />
      {openCreateTopicModal && (
        <DialogCreateTopic
          open={openCreateTopicModal}
          setOpen={setOpenCreateTopicModal}
        />
      )}
      {openSession && item && (
        <DialogOpenSession
          open={openSession}
          setOpen={setOpenSession}
          item={item}
        />
      )}
    </div>
  );
};
export default Dashboard;
