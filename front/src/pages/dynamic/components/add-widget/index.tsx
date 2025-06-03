import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import { useGridStore } from "../../grid-store";

interface PropsType {
  id: number;
}
export default function AddWidget({ id }: PropsType) {
  const { setWidgetIdMachine } = useGridStore();
  return (
    <Button
      onClick={() => setWidgetIdMachine(id, "new")}
      className="flex items-center gap-2 py-1 px-2 rounded-lg text-xs h-fit dark:text-white"
    >
      <PlusSquare size={12} />
      <span>Add widget</span>
    </Button>
  );
}
