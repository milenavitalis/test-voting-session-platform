import { useSelector } from "react-redux";
import type { RootState } from "@/logic/reducer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOptionProps {
  value: { topic_id: number | null; vote: "Sim" | "Não" | "" };
  setValue: (newValue: {
    topic_id: number | null;
    vote: "Sim" | "Não" | "";
  }) => void;
}

const SelectTopic = ({ value, setValue }: SelectOptionProps) => {
  const { topics } = useSelector((state: RootState) => state.topic);

  const openTopics = topics.filter((topic) => topic.status === "Sessão aberta");

  const handleValueChange = (selectedId: string) => {
    const selectedTopic = openTopics.find(
      (topic) => String(topic.id) === selectedId
    );
    if (selectedTopic) {
      setValue({ ...value, topic_id: selectedTopic.id });
    }
  };

  return (
    <Select
      onValueChange={handleValueChange}
      value={value.topic_id ? String(value.topic_id) : ""}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecionar" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tópicos</SelectLabel>
          {openTopics.length > 0 &&
            openTopics.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.title}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectTopic;
