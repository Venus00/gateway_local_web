import { Scaling } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useGridStore } from "../../grid-store";

interface PropsType {
  id: number;
}
export function ToggleEdit({ id }: PropsType) {
  const { dashboard, toggleMachineEditMode } = useGridStore();
  const editMode = dashboard.find((machine) => machine.machineId === id)?.editMode;
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("hidden xl:flex", {
              "text-foreground": editMode,
              "text-foreground/50": !editMode,
            })}
            onClick={() => toggleMachineEditMode(id)}
          >
            <Scaling size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={"bottom-end" as unknown as "bottom"}>
          {editMode ? "exitEditMode" : "enterEditMode"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
