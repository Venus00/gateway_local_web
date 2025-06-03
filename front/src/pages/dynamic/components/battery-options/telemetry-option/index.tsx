import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGridStore } from "@/pages/dynamic/grid-store";
import { useAddWidgetStore } from "@/pages/dynamic/widget-store";
import { useLocation } from "react-router-dom";

export default function TelemetryOption() {
  const { data, setAttribute } = useAddWidgetStore();
  const { dashboard } = useGridStore();
  const location = useLocation();
  const machineId = location.pathname.split("/")[2];
  const dashboardItem = dashboard.find(
    (machine: { machineId: number }) => machine.machineId === Number(machineId)
  );
  const isAnalytic = location.pathname.startsWith("/analytic");
  const id = dashboardItem ? dashboardItem.machineId : undefined;
  const machine = dashboardItem ? dashboardItem.machine : undefined;
  console.log(machine);

  return (
    <div className="grid grid-cols-[min-content,1fr] items-center gap-x-4 gap-y-2">
      <Label htmlFor="telemetry">Telemetry Name</Label>
      <Select
        name="telemetry"
        required
        defaultValue={(data.attributes?.telemetryName as string) || undefined}
        onValueChange={(value) => {
          setAttribute("telemetryName", value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Telemetry" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {isAnalytic
              ? machine?.telemetries?.split(",").map((item: string) => {
                  return (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  );
                })
              : machine?.connectionInputs?.map((item: any, index: number) => {
                  return (
                    <SelectItem
                      key={index}
                      value={item?.input?.label?.trimEnd()}
                    >
                      {item?.input?.label?.trimEnd()}
                    </SelectItem>
                  );
                })}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* <Input
        value={(data.attributes?.telemetryName as string) || ""}
        onChange={(e) => {
          e.preventDefault();
          setAttribute("telemetryName", e.currentTarget.value);
        }}
      /> */}
    </div>
  );
}
