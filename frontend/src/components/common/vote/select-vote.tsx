import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SelectVote {
  value: { topic_id: number | null; vote: "Sim" | "Não" | "" };
  setValue: (newValue: {
    topic_id: number | null;
    vote: "Sim" | "Não" | "";
  }) => void;
}

const SelectVote = ({ value, setValue }: SelectVote) => {
  const handleSelectVote = (selectedValue: "Sim" | "Não") => {
    setValue({
      ...value,
      vote: selectedValue,
    });
  };

  return (
    <RadioGroup className="flex gap-4 p-2" onValueChange={handleSelectVote}>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="Sim" id="yes" />
        <Label htmlFor="yes">Sim</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="Não" id="no" />
        <Label htmlFor="no">Não</Label>
      </div>
    </RadioGroup>
  );
};

export default SelectVote;
